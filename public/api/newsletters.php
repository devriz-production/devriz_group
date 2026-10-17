<?php
/** Public list of published newsletters, read by the newsletter page. */

declare(strict_types=1);

require __DIR__ . '/_lib.php';

header('Cache-Control: public, max-age=120');

$public = [];
foreach (sort_issues(load_issues()) as $issue) {
    if (($issue['status'] ?? '') !== 'published' || empty($issue['file'])) {
        continue;
    }
    $public[] = [
        'id' => $issue['id'],
        'title' => $issue['title'],
        'date' => $issue['date'],
        'summary' => $issue['summary'],
        'size' => (int) $issue['size'],
        'url' => '/api/newsletter-file.php?id=' . rawurlencode((string) $issue['id']),
    ];
}

json_out(200, ['ok' => true, 'issues' => $public]);
