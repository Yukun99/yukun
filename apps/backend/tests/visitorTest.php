<?php

declare(strict_types=1);

use Yukun\Api\Visitor;

$salt = 'test-salt';

$check('hash is 64 hex chars', preg_match('/^[0-9a-f]{64}$/', (string) Visitor::hash('203.0.113.7', $salt)), 1);
$check('hash is stable', Visitor::hash('203.0.113.7', $salt), Visitor::hash('203.0.113.7', $salt));
$check('hash differs per address', Visitor::hash('203.0.113.7', $salt) === Visitor::hash('203.0.113.8', $salt), false);
$check('hash differs per salt', Visitor::hash('203.0.113.7', $salt) === Visitor::hash('203.0.113.7', 'other'), false);
$check('hash never holds the address', str_contains((string) Visitor::hash('203.0.113.7', $salt), '203'), false);
$check('invalid address has no hash', Visitor::hash('not-an-ip', $salt), null);
$check('empty address has no hash', Visitor::hash('', $salt), null);

$check(
    'IPv4-mapped IPv6 matches plain IPv4',
    Visitor::hash('::ffff:203.0.113.7', $salt),
    Visitor::hash('203.0.113.7', $salt),
);
$check(
    'IPv6 addresses in one /64 match',
    Visitor::hash('2001:db8:1:2:aaaa:bbbb:cccc:dddd', $salt),
    Visitor::hash('2001:db8:1:2::1', $salt),
);
$check(
    'IPv6 addresses in different /64s differ',
    Visitor::hash('2001:db8:1:2::1', $salt) === Visitor::hash('2001:db8:1:3::1', $salt),
    false,
);

$threw = false;
try {
    Visitor::hash('203.0.113.7', '');
} catch (RuntimeException) {
    $threw = true;
}
$check('empty salt is refused', $threw, true);

$browsers = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
];
foreach ($browsers as $index => $userAgent) {
    $check("browser $index is not a bot", Visitor::isBot($userAgent), false);
}

$bots = [
    '',
    '   ',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36',
    'curl/8.9.1',
    'python-requests/2.32.3',
    'facebookexternalhit/1.1',
    'Slackbot-LinkExpanding 1.0',
    'UptimeRobot/2.0 monitor',
];
foreach ($bots as $index => $userAgent) {
    $check("bot $index is a bot", Visitor::isBot($userAgent), true);
}
