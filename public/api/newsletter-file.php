<?php
/**
 * Sends one published newsletter PDF. The files live outside the web root, so
 * this script is the only way to reach them, and drafts are never served.
 */

declare(strict_types=1);

require __DIR__ . '/_lib.php';

$id = (string) ($_GET['id'] ?? '');
if (!preg_match('/^n_[a-f0-9]{12}$/', $id)) {
    http_response_code(404);
    exit;
}

$match = null;
foreach (load_issues() as $issue) {
    if (($issue['id'] ?? '') === $id && ($issue['status'] ?? '') === 'published' && !empty($issue['file'])) {
        $match = $issue;
        break;
    }
}

$path = $match ? issue_dir() . DIRECTORY_SEPARATOR . basename((string) $match['file']) : '';
if (!$match || !is_file($path)) {
    http_response_code(404);
    exit;
}

$name = strtolower(trim((string) preg_replace('/[^A-Za-z0-9]+/', '-', (string) $match['title']), '-'));
$name = ($name !== '' ? substr($name, 0, 80) : 'devriz-group-newsletter') . '.pdf';

header('Content-Type: application/pdf');
header('Content-Length: ' . filesize($path));
header('Content-Disposition: inline; filename="' . $name . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=86400');
readfile($path);
