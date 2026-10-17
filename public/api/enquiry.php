<?php
/**
 * Devriz Group website: enquiry and careers form handler.
 *
 * Receives the contact and careers forms, checks them, and emails the corporate
 * office. It stores nothing. It runs on Hostinger's standard PHP; no database.
 *
 * Before going live: create the mailbox in FROM_ADDRESS in hPanel (Emails), or
 * mail sent from this script is likely to be rejected or land in spam.
 */

declare(strict_types=1);

// ---- Settings ---------------------------------------------------------------
const RECIPIENT = 'info@devrizgroup.com';
const FROM_ADDRESS = 'no-reply@devrizgroup.com';
const ALLOWED_HOSTS = ['devrizgroup.com', 'www.devrizgroup.com'];
const RATE_LIMIT = 5;          // submissions allowed per address...
const RATE_WINDOW = 600;       // ...in this many seconds
const MIN_SECONDS = 3;         // a person takes longer than this to fill a form

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method']);
}

// Only accept posts that come from this site (or its Hostinger preview address).
$source = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$sourceHost = strtolower((string) parse_url($source, PHP_URL_HOST));
$preview = (bool) preg_match('/\.hostingersite\.com$/', $sourceHost);
if ($sourceHost === '' || (!in_array($sourceHost, ALLOWED_HOSTS, true) && !$preview)) {
    respond(403, ['ok' => false, 'error' => 'origin']);
}

// Bots fill the hidden field and submit instantly. Tell them it worked.
if (trim((string) ($_POST['website'] ?? '')) !== '' || (int) ($_POST['elapsed'] ?? 0) < MIN_SECONDS) {
    respond(200, ['ok' => true]);
}

// ---- Rate limit by address --------------------------------------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/dg-enquiry-' . hash('sha256', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($bucket)) {
    $hits = array_filter((array) json_decode((string) file_get_contents($bucket), true), fn ($t) => is_int($t) && $t > $now - RATE_WINDOW);
}
if (count($hits) >= RATE_LIMIT) {
    respond(429, ['ok' => false, 'error' => 'rate']);
}

// ---- Read and clean fields --------------------------------------------------
function text(string $key, int $max): string
{
    $value = (string) ($_POST[$key] ?? '');
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr(trim($value), 0, $max);
}

// Single-line fields can end up in mail headers, so line breaks are removed.
function line(string $key, int $max): string
{
    return trim((string) preg_replace('/[\r\n]+/', ' ', text($key, $max)));
}

$form = line('form', 20) === 'careers' ? 'careers' : 'contact';
$errors = [];

$name = line('name', 120);
$email = line('email', 200);
$phone = line('phone', 30);

if ($name === '') {
    $errors['name'] = 'Enter your full name.';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter an email address in the format name@example.com.';
}
if ($phone !== '') {
    $digits = preg_replace('/\D/', '', $phone);
    if (strlen((string) $digits) < 7 || strlen((string) $digits) > 15) {
        $errors['phone'] = 'Enter a phone number with 7 to 15 digits.';
    }
}
if (($_POST['consent'] ?? '') !== 'yes') {
    $errors['consent'] = 'Please tick this box so we can reply to you.';
}

$rows = [];

if ($form === 'careers') {
    if ($phone === '') {
        $errors['phone'] = 'Enter your mobile number.';
    }
    $required = ['city' => 'current city', 'role' => 'role', 'experience' => 'total experience', 'resume' => 'resume link'];
    foreach ($required as $key => $label) {
        if (line($key, 300) === '') {
            $errors[$key] = "Enter your {$label}.";
        }
    }
    foreach (['resume', 'portfolio'] as $key) {
        $url = line($key, 300);
        if ($url !== '' && !preg_match('#^https?://#i', $url)) {
            $errors[$key] = 'Enter a full link starting with https://';
        }
    }
    $summary = text('summary', 4000);
    if ($summary === '') {
        $errors['summary'] = 'Enter your work experience summary.';
    }

    $subject = 'Career application: ' . line('role', 80) . ' - ' . $name;
    $rows = [
        'Name' => $name,
        'Mobile' => $phone,
        'Email' => $email,
        'Current city' => line('city', 120),
        'Applying for' => line('role', 120),
        'Total experience' => line('experience', 40),
        'Current salary' => line('current_salary', 80),
        'Expected salary' => line('expected_salary', 80),
        'Notice period' => line('notice_period', 80),
        'Portfolio' => line('portfolio', 300),
        'Resume' => line('resume', 300),
    ];
    $message = $summary;
} else {
    $types = [
        'general' => 'General',
        'partnership' => 'Partnership',
        'vendor' => 'Vendor registration',
        'media' => 'Media',
        'feedback' => 'Feedback',
    ];
    $type = line('enquiry', 20);
    if (!isset($types[$type])) {
        $type = 'general';
    }
    if ($email === '') {
        $errors['email'] = 'Enter your email.';
    }
    $organisation = line('organisation', 160);
    if (in_array($type, ['partnership', 'vendor'], true) && $organisation === '') {
        $errors['organisation'] = 'Enter your organisation.';
    }
    if ($type === 'vendor' && line('vendor_category', 80) === '') {
        $errors['vendor_category'] = 'Choose an option.';
    }
    $gstin = strtoupper(line('gstin', 15));
    if ($type === 'vendor' && $gstin !== '' && !preg_match('/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/', $gstin)) {
        $errors['gstin'] = 'A GSTIN has 15 characters, for example 09AAAAA0000A1Z5.';
    }
    if ($type === 'media' && line('publication', 160) === '') {
        $errors['publication'] = 'Enter your publication or outlet.';
    }
    $message = text('message', 4000);
    if ($message === '') {
        $errors['message'] = 'Enter your message.';
    }

    $subject = $types[$type] . ' enquiry - ' . $name;
    $rows = [
        'Enquiry type' => $types[$type],
        'Regarding' => line('regarding', 80),
        'Name' => $name,
        'Email' => $email,
        'Phone' => $phone,
        'Organisation' => $organisation,
    ];
    if ($type === 'vendor') {
        $rows += ['Supplies' => line('vendor_category', 80), 'GSTIN' => $gstin, 'City and state' => line('city', 120)];
    }
    if ($type === 'partnership') {
        $rows += ['Sector of interest' => line('sector', 80)];
    }
    if ($type === 'media') {
        $rows += ['Publication' => line('publication', 160), 'Deadline' => line('deadline', 80)];
    }
}

if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

// ---- Compose and send -------------------------------------------------------
$body = '';
foreach ($rows as $label => $value) {
    if ($value !== '') {
        $body .= str_pad($label . ':', 20) . $value . "\n";
    }
}
$body .= "\n" . ($form === 'careers' ? "Work experience\n---------------\n" : "Message\n-------\n") . $message . "\n\n";
$body .= "--\nSent from " . line('page', 120) . ' on ' . gmdate('j M Y, H:i') . " UTC\n";

$headers = [
    'From: Devriz Group website <' . FROM_ADDRESS . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = mail(
    RECIPIENT,
    mb_encode_mimeheader('[devrizgroup.com] ' . $subject, 'UTF-8', 'B'),
    $body,
    implode("\r\n", $headers),
    '-f' . FROM_ADDRESS
);

if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'mail']);
}

$hits[] = $now;
@file_put_contents($bucket, json_encode(array_values($hits)), LOCK_EX);

respond(200, ['ok' => true]);
