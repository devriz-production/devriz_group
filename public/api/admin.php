<?php
/**
 * Devriz Group site admin: sign-in, career openings and newsletters.
 *
 * One endpoint, chosen by ?action=. Every action except status, setup and login
 * needs a signed-in session, and every change needs the session's CSRF token.
 * The page at /admin/ is the only client.
 */

declare(strict_types=1);

require __DIR__ . '/_lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = clean_line($_GET['action'] ?? '', 40);

if ($method === 'POST' && !same_origin()) {
    json_out(403, ['ok' => false, 'error' => 'origin', 'message' => 'This request did not come from the admin page.']);
}

// ---- Session ----------------------------------------------------------------
// A session cookie is only created on sign-in, so opening /admin/ sets nothing.

function open_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name(DG_SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

if (isset($_COOKIE[DG_SESSION_NAME])) {
    open_session();
}

$admin = read_json('admin.json', null);
$configured = is_array($admin) && !empty($admin['hash']);

// Sessions are tied to the current password, so changing it signs out every other browser.
$passwordTag = $configured ? substr(hash('sha256', (string) $admin['hash']), 0, 24) : '';
$authed = $configured
    && !empty($_SESSION['authed'])
    && hash_equals((string) ($_SESSION['tag'] ?? ''), $passwordTag)
    && (time() - (int) ($_SESSION['seen'] ?? 0)) < DG_IDLE_SECONDS;

if ($authed) {
    $_SESSION['seen'] = time();
} elseif (session_status() === PHP_SESSION_ACTIVE && !empty($_SESSION['authed'])) {
    $_SESSION = [];
}

function sign_in(string $hash): string
{
    open_session();
    session_regenerate_id(true);
    $_SESSION['authed'] = true;
    $_SESSION['seen'] = time();
    $_SESSION['tag'] = substr(hash('sha256', $hash), 0, 24);
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

// ---- Sign-in attempts -------------------------------------------------------

function attempts_left(): int
{
    $all = read_json('attempts.json', []);
    $mine = array_filter((array) ($all[client_key()] ?? []), fn ($t) => is_int($t) && $t > time() - DG_LOGIN_WINDOW);
    return max(0, DG_LOGIN_ATTEMPTS - count($mine));
}

function record_attempt(): void
{
    $all = read_json('attempts.json', []);
    $cutoff = time() - DG_LOGIN_WINDOW;
    $fresh = [];
    foreach ((array) $all as $key => $times) {
        $times = array_values(array_filter((array) $times, fn ($t) => is_int($t) && $t > $cutoff));
        if ($times) {
            $fresh[$key] = $times;
        }
    }
    $fresh[client_key()][] = time();
    write_json('attempts.json', $fresh);
    usleep(400000);
}

function require_attempts(): void
{
    if (attempts_left() === 0) {
        json_out(429, ['ok' => false, 'error' => 'locked', 'message' => 'Too many attempts. Wait 15 minutes and try again.']);
    }
}

function password_problem(string $password): string
{
    if (mb_strlen($password) < DG_MIN_PASSWORD) {
        return 'Use at least ' . DG_MIN_PASSWORD . ' characters.';
    }
    if (mb_strlen($password) > 200) {
        return 'Use 200 characters or fewer.';
    }
    return '';
}

// ---- Actions open to everyone -----------------------------------------------

if ($action === 'status') {
    json_out(200, [
        'ok' => true,
        'configured' => $configured,
        'authed' => $authed,
        'csrf' => $authed ? ($_SESSION['csrf'] ?? '') : '',
        'setupReady' => is_file(__DIR__ . '/setup-key.php'),
        'maxUpload' => max_upload_bytes(),
        'minPassword' => DG_MIN_PASSWORD,
    ]);
}

if ($method !== 'POST' && !in_array($action, ['jobs', 'newsletters'], true)) {
    json_out(405, ['ok' => false, 'error' => 'method']);
}

if ($action === 'setup') {
    if ($configured) {
        json_out(409, ['ok' => false, 'error' => 'configured', 'message' => 'An admin password already exists. Sign in instead.']);
    }
    require_attempts();
    $keyFile = __DIR__ . '/setup-key.php';
    $expected = is_file($keyFile) ? (string) (include $keyFile) : '';
    if (!preg_match('/^[a-f0-9]{64}$/', $expected)) {
        json_out(503, ['ok' => false, 'error' => 'no-key', 'message' => 'No setup key has been published with the site. Run "npm run admin:key", rebuild and upload again.']);
    }
    $key = strtoupper((string) preg_replace('/[^A-Za-z0-9]/', '', (string) ($_POST['key'] ?? '')));
    if (!hash_equals($expected, hash('sha256', $key))) {
        record_attempt();
        json_out(401, ['ok' => false, 'errors' => ['key' => 'That setup key is not correct.']]);
    }
    $password = (string) ($_POST['password'] ?? '');
    if ($problem = password_problem($password)) {
        json_out(422, ['ok' => false, 'errors' => ['password' => $problem]]);
    }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    write_json('admin.json', ['hash' => $hash, 'created' => gmdate('c')]);
    json_out(200, ['ok' => true, 'csrf' => sign_in($hash)]);
}

if ($action === 'login') {
    if (!$configured) {
        json_out(409, ['ok' => false, 'error' => 'not-configured']);
    }
    require_attempts();
    $password = (string) ($_POST['password'] ?? '');
    if ($password === '' || !password_verify($password, (string) $admin['hash'])) {
        record_attempt();
        $left = attempts_left();
        json_out(401, ['ok' => false, 'errors' => ['password' => $left > 0 ? "That password is not correct. {$left} " . ($left === 1 ? 'try' : 'tries') . ' left.' : 'Too many attempts. Wait 15 minutes and try again.']]);
    }
    if (password_needs_rehash((string) $admin['hash'], PASSWORD_DEFAULT)) {
        $admin['hash'] = password_hash($password, PASSWORD_DEFAULT);
        write_json('admin.json', $admin);
    }
    json_out(200, ['ok' => true, 'csrf' => sign_in((string) $admin['hash'])]);
}

// ---- Everything below needs a signed-in session ------------------------------

if (!$authed) {
    json_out(401, ['ok' => false, 'error' => 'auth', 'message' => 'Your session has ended. Sign in again.']);
}
if ($method === 'POST' && !hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''))) {
    json_out(403, ['ok' => false, 'error' => 'csrf', 'message' => 'This page is out of date. Reload it and try again.']);
}

switch ($action) {
    case 'logout':
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            setcookie(DG_SESSION_NAME, '', ['expires' => time() - 3600, 'path' => '/', 'secure' => is_https(), 'httponly' => true, 'samesite' => 'Strict']);
        }
        session_destroy();
        json_out(200, ['ok' => true]);
        break;

    case 'password':
        if (!password_verify((string) ($_POST['current'] ?? ''), (string) $admin['hash'])) {
            usleep(400000);
            json_out(422, ['ok' => false, 'errors' => ['current' => 'That is not the current password.']]);
        }
        $next = (string) ($_POST['next'] ?? '');
        if ($problem = password_problem($next)) {
            json_out(422, ['ok' => false, 'errors' => ['next' => $problem]]);
        }
        $hash = password_hash($next, PASSWORD_DEFAULT);
        write_json('admin.json', ['hash' => $hash, 'created' => $admin['created'] ?? gmdate('c'), 'changed' => gmdate('c')]);
        json_out(200, ['ok' => true, 'csrf' => sign_in($hash)]);
        break;

    // ---- Career openings ----
    case 'jobs':
        json_out(200, ['ok' => true, 'jobs' => sort_jobs(load_jobs())]);
        break;

    case 'job-save':
        $jobs = load_jobs();
        $id = clean_line($_POST['id'] ?? '', 20);
        $job = [
            'title' => clean_line($_POST['title'] ?? '', 120),
            'department' => clean_line($_POST['department'] ?? '', 60),
            'type' => clean_line($_POST['type'] ?? '', 20),
            'experience' => clean_line($_POST['experience'] ?? '', 60),
            'location' => clean_line($_POST['location'] ?? '', 120),
            'summary' => clean_text($_POST['summary'] ?? '', 600),
            'points' => array_slice(array_values(array_filter(array_map(fn ($p) => clean_line($p, 240), explode("\n", clean_text($_POST['points'] ?? '', 4000))))), 0, 12),
            'fit' => clean_text($_POST['fit'] ?? '', 600),
            'status' => clean_line($_POST['status'] ?? '', 12),
            'posted' => clean_line($_POST['posted'] ?? '', 10),
        ];
        $errors = [];
        if ($job['title'] === '') {
            $errors['title'] = 'Enter the job title.';
        }
        if ($job['department'] === '') {
            $errors['department'] = 'Enter the department.';
        }
        if ($job['location'] === '') {
            $errors['location'] = 'Enter the location.';
        }
        if ($job['summary'] === '') {
            $errors['summary'] = 'Describe the role in a sentence or two.';
        }
        if (!in_array($job['type'], DG_JOB_TYPES, true)) {
            $errors['type'] = 'Choose an employment type.';
        }
        if (!in_array($job['status'], DG_JOB_STATUSES, true)) {
            $errors['status'] = 'Choose a status.';
        }
        if ($job['posted'] === '') {
            $job['posted'] = date('Y-m-d');
        } elseif (!valid_date($job['posted'])) {
            $errors['posted'] = 'Enter a real date.';
        }
        if ($errors) {
            json_out(422, ['ok' => false, 'errors' => $errors]);
        }
        $job['updated'] = time();
        if ($id === '') {
            $job = ['id' => new_id('j_')] + $job;
            $jobs[] = $job;
        } else {
            $found = false;
            foreach ($jobs as $index => $existing) {
                if (($existing['id'] ?? '') === $id) {
                    $job = ['id' => $id] + $job;
                    $jobs[$index] = $job;
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                json_out(404, ['ok' => false, 'error' => 'missing', 'message' => 'That opening no longer exists.']);
            }
        }
        write_json('jobs.json', array_values($jobs));
        json_out(200, ['ok' => true, 'job' => $job, 'jobs' => sort_jobs($jobs)]);
        break;

    case 'job-delete':
        $id = clean_line($_POST['id'] ?? '', 20);
        $jobs = load_jobs();
        $kept = array_values(array_filter($jobs, fn ($j) => ($j['id'] ?? '') !== $id));
        if (count($kept) === count($jobs)) {
            json_out(404, ['ok' => false, 'error' => 'missing', 'message' => 'That opening no longer exists.']);
        }
        write_json('jobs.json', $kept);
        json_out(200, ['ok' => true, 'jobs' => sort_jobs($kept)]);
        break;

    // ---- Newsletters ----
    case 'newsletters':
        json_out(200, ['ok' => true, 'issues' => sort_issues(load_issues())]);
        break;

    case 'newsletter-save':
        $issues = load_issues();
        $id = clean_line($_POST['id'] ?? '', 20);
        $index = null;
        foreach ($issues as $i => $existing) {
            if (($existing['id'] ?? '') === $id) {
                $index = $i;
                break;
            }
        }
        if ($id !== '' && $index === null) {
            json_out(404, ['ok' => false, 'error' => 'missing', 'message' => 'That newsletter no longer exists.']);
        }
        $issue = [
            'title' => clean_line($_POST['title'] ?? '', 160),
            'date' => clean_line($_POST['date'] ?? '', 10),
            'summary' => clean_text($_POST['summary'] ?? '', 600),
            'status' => clean_line($_POST['status'] ?? '', 12),
        ];
        $errors = [];
        if ($issue['title'] === '') {
            $errors['title'] = 'Enter a title.';
        }
        if (!valid_date($issue['date'])) {
            $errors['date'] = 'Enter the issue date.';
        }
        if (!in_array($issue['status'], DG_ISSUE_STATUSES, true)) {
            $errors['status'] = 'Choose a status.';
        }

        $upload = $_FILES['file'] ?? null;
        $hasUpload = is_array($upload) && ($upload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
        if ($hasUpload) {
            if (($upload['error'] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file((string) $upload['tmp_name'])) {
                $errors['file'] = 'The file did not upload. It may be larger than this server allows.';
            } elseif ((int) $upload['size'] > max_upload_bytes()) {
                $errors['file'] = 'That file is too large.';
            } else {
                // A PDF is recognised by its content, never by the name it was given.
                $head = (string) file_get_contents((string) $upload['tmp_name'], false, null, 0, 5);
                $mime = class_exists('finfo') ? (string) (new finfo(FILEINFO_MIME_TYPE))->file((string) $upload['tmp_name']) : 'application/pdf';
                if ($head !== '%PDF-' || $mime !== 'application/pdf') {
                    $errors['file'] = 'Upload the newsletter as a PDF.';
                }
            }
        } elseif ($index === null) {
            $errors['file'] = 'Choose the PDF to upload.';
        }
        if ($errors) {
            json_out(422, ['ok' => false, 'errors' => $errors]);
        }

        $previous = $index !== null ? $issues[$index] : [];
        $issue['id'] = $previous['id'] ?? new_id('n_');
        $issue['file'] = $previous['file'] ?? '';
        $issue['size'] = $previous['size'] ?? 0;
        if ($hasUpload) {
            $stored = $issue['id'] . '-' . bin2hex(random_bytes(4)) . '.pdf';
            if (!move_uploaded_file((string) $upload['tmp_name'], issue_dir() . DIRECTORY_SEPARATOR . $stored)) {
                json_out(500, ['ok' => false, 'error' => 'storage', 'message' => 'The file could not be saved.']);
            }
            if ($issue['file'] !== '') {
                @unlink(issue_dir() . DIRECTORY_SEPARATOR . basename((string) $issue['file']));
            }
            $issue['file'] = $stored;
            $issue['size'] = (int) $upload['size'];
        }
        $issue['updated'] = time();
        if ($index === null) {
            $issues[] = $issue;
        } else {
            $issues[$index] = $issue;
        }
        write_json('newsletters.json', array_values($issues));
        json_out(200, ['ok' => true, 'issue' => $issue, 'issues' => sort_issues($issues)]);
        break;

    case 'newsletter-delete':
        $id = clean_line($_POST['id'] ?? '', 20);
        $issues = load_issues();
        $kept = [];
        $removed = false;
        foreach ($issues as $existing) {
            if (($existing['id'] ?? '') === $id) {
                $removed = true;
                if (!empty($existing['file'])) {
                    @unlink(issue_dir() . DIRECTORY_SEPARATOR . basename((string) $existing['file']));
                }
                continue;
            }
            $kept[] = $existing;
        }
        if (!$removed) {
            json_out(404, ['ok' => false, 'error' => 'missing', 'message' => 'That newsletter no longer exists.']);
        }
        write_json('newsletters.json', $kept);
        json_out(200, ['ok' => true, 'issues' => sort_issues($kept)]);
        break;

    default:
        json_out(400, ['ok' => false, 'error' => 'action']);
}
