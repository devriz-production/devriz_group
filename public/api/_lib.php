<?php
/**
 * Shared code for the admin API and the public job and newsletter feeds.
 *
 * Storage is plain JSON files in a private folder called dg-data. It is created
 * next to public_html (outside the web root) so that it cannot be opened in a
 * browser and is never touched when the site files are re-uploaded.
 */

declare(strict_types=1);

// This file only defines functions. Opening it directly does nothing.
if (basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

// Dates entered in the admin are Indian dates.
date_default_timezone_set('Asia/Kolkata');

const DG_SESSION_NAME = 'dg_admin';
const DG_IDLE_SECONDS = 3600;              // signed out after an hour without activity
const DG_MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB per newsletter
const DG_LOGIN_ATTEMPTS = 5;               // wrong passwords allowed...
const DG_LOGIN_WINDOW = 900;               // ...per 15 minutes, per address
const DG_MIN_PASSWORD = 10;

const DG_JOB_STATUSES = ['published', 'draft', 'closed'];
const DG_JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const DG_ISSUE_STATUSES = ['published', 'draft'];

function json_out(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

/** A POST must come from a page on this same host. */
function same_origin(): bool
{
    $source = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    $sourceHost = strtolower((string) parse_url($source, PHP_URL_HOST));
    $sourcePort = parse_url($source, PHP_URL_PORT);
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    if ($sourceHost === '' || $host === '') {
        return false;
    }
    return $host === $sourceHost || $host === $sourceHost . ':' . $sourcePort;
}

function client_key(): string
{
    return substr(hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown')), 0, 24);
}

// ---- Storage ----------------------------------------------------------------

function data_dir(): string
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    $root = rtrim((string) realpath($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__)), '/\\');
    // First choice is beside the web root. The fallback is inside it, locked by .htaccess.
    $candidates = [dirname($root) . DIRECTORY_SEPARATOR . 'dg-data', $root . DIRECTORY_SEPARATOR . 'dg-data'];

    foreach ($candidates as $candidate) {
        if (is_dir($candidate) && is_writable($candidate)) {
            return $dir = $candidate;
        }
    }
    foreach ($candidates as $candidate) {
        if (@mkdir($candidate, 0750, true) && is_writable($candidate)) {
            @file_put_contents(
                $candidate . DIRECTORY_SEPARATOR . '.htaccess',
                "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n"
            );
            @file_put_contents($candidate . DIRECTORY_SEPARATOR . 'index.html', '');
            return $dir = $candidate;
        }
    }
    json_out(500, ['ok' => false, 'error' => 'storage', 'message' => 'The server could not create its data folder.']);
    return '';
}

function data_path(string $name): string
{
    return data_dir() . DIRECTORY_SEPARATOR . $name;
}

/** @return mixed */
function read_json(string $name, $default)
{
    $path = data_path($name);
    if (!is_file($path)) {
        return $default;
    }
    $handle = @fopen($path, 'rb');
    if (!$handle) {
        return $default;
    }
    flock($handle, LOCK_SH);
    $raw = stream_get_contents($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    $value = json_decode((string) $raw, true);
    return $value === null ? $default : $value;
}

/** Writes to a temporary file and renames it, so a reader never sees half a file. */
function write_json(string $name, $value): void
{
    $path = data_path($name);
    $temp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false || file_put_contents($temp, $json, LOCK_EX) === false || !rename($temp, $path)) {
        @unlink($temp);
        json_out(500, ['ok' => false, 'error' => 'storage', 'message' => 'The change could not be saved.']);
    }
}

function new_id(string $prefix): string
{
    return $prefix . bin2hex(random_bytes(6));
}

// ---- Input ------------------------------------------------------------------

function clean_text($value, int $max): string
{
    $value = is_string($value) ? $value : '';
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return mb_substr(trim($value), 0, $max);
}

function clean_line($value, int $max): string
{
    return trim((string) preg_replace('/\s+/u', ' ', clean_text($value, $max)));
}

function valid_date(string $value): bool
{
    $date = DateTime::createFromFormat('!Y-m-d', $value);
    return $date !== false && $date->format('Y-m-d') === $value;
}

// ---- Career openings ---------------------------------------------------------

/** All openings. The first call copies the starter list that ships with the site. */
function load_jobs(): array
{
    $jobs = read_json('jobs.json', null);
    if (is_array($jobs)) {
        return $jobs;
    }
    $jobs = [];
    $seedFile = dirname(__DIR__) . '/admin/seed/jobs.json';
    $seed = is_file($seedFile) ? json_decode((string) file_get_contents($seedFile), true) : null;
    if (is_array($seed)) {
        $today = date('Y-m-d');
        foreach ($seed as $row) {
            if (!is_array($row) || empty($row['title'])) {
                continue;
            }
            $jobs[] = [
                'id' => new_id('j_'),
                'title' => clean_line($row['title'] ?? '', 120),
                'department' => clean_line($row['department'] ?? '', 60),
                'type' => in_array($row['type'] ?? '', DG_JOB_TYPES, true) ? $row['type'] : 'Full-time',
                'experience' => clean_line($row['experience'] ?? '', 60),
                'location' => clean_line($row['location'] ?? '', 120),
                'summary' => clean_text($row['summary'] ?? '', 600),
                'points' => array_values(array_filter(array_map(fn ($p) => clean_line($p, 240), (array) ($row['points'] ?? [])))),
                'fit' => clean_text($row['fit'] ?? '', 600),
                'status' => 'published',
                'posted' => $today,
                'updated' => time(),
            ];
        }
    }
    write_json('jobs.json', $jobs);
    return $jobs;
}

/** Newest first. Among openings posted on the same day, the one saved last leads. */
function sort_jobs(array $jobs): array
{
    $jobs = array_reverse($jobs);
    usort($jobs, fn ($a, $b) => [$b['posted'] ?? '', $b['updated'] ?? 0] <=> [$a['posted'] ?? '', $a['updated'] ?? 0]);
    return $jobs;
}

// ---- Newsletters ------------------------------------------------------------

function load_issues(): array
{
    $issues = read_json('newsletters.json', []);
    return is_array($issues) ? $issues : [];
}

function sort_issues(array $issues): array
{
    $issues = array_reverse($issues);
    usort($issues, fn ($a, $b) => [$b['date'] ?? '', $b['updated'] ?? 0] <=> [$a['date'] ?? '', $a['updated'] ?? 0]);
    return $issues;
}

function issue_dir(): string
{
    $dir = data_path('newsletters');
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    return $dir;
}

/** The largest PDF this server will accept, in bytes. */
function max_upload_bytes(): int
{
    $toBytes = function (string $value): int {
        $value = trim($value);
        $number = (float) $value;
        switch (strtolower(substr($value, -1))) {
            case 'g':
                return (int) ($number * 1024 * 1024 * 1024);
            case 'm':
                return (int) ($number * 1024 * 1024);
            case 'k':
                return (int) ($number * 1024);
            default:
                return (int) $number;
        }
    };
    $limits = [DG_MAX_PDF_BYTES];
    foreach (['upload_max_filesize', 'post_max_size'] as $key) {
        $bytes = $toBytes((string) ini_get($key));
        if ($bytes > 0) {
            $limits[] = $bytes;
        }
    }
    return (int) min($limits);
}
