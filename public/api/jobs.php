<?php
/** Public feed of published career openings, read by the careers page. */

declare(strict_types=1);

require __DIR__ . '/_lib.php';

header('Cache-Control: public, max-age=120');

$public = [];
foreach (sort_jobs(load_jobs()) as $job) {
    if (($job['status'] ?? '') !== 'published') {
        continue;
    }
    $public[] = [
        'id' => $job['id'],
        'title' => $job['title'],
        'department' => $job['department'],
        'type' => $job['type'],
        'experience' => $job['experience'],
        'location' => $job['location'],
        'summary' => $job['summary'],
        'points' => $job['points'],
        'fit' => $job['fit'],
        'posted' => $job['posted'],
    ];
}

json_out(200, ['ok' => true, 'jobs' => $public]);
