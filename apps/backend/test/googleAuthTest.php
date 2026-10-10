<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\GoogleAuth;

$check('bearer of null', GoogleAuth::bearer(null), null);
$check('bearer of empty', GoogleAuth::bearer(''), null);
$check('bearer without prefix', GoogleAuth::bearer('abc.def'), null);
$check('bearer with other scheme', GoogleAuth::bearer('Basic abc'), null);
$check('bearer token', GoogleAuth::bearer('Bearer abc.def'), 'abc.def');
$check('bearer lower-case prefix', GoogleAuth::bearer('bearer x'), 'x');
$check('bearer surrounding spaces', GoogleAuth::bearer('  Bearer   x  '), 'x');
$check('bearer prefix alone', GoogleAuth::bearer('Bearer'), null);

$client = 'client-id.apps.googleusercontent.com';
$editor = 'Me@Example.com';

$info = fn (array $override = []): string => json_encode(array_merge([
    'aud' => $client,
    'email' => 'me@example.com',
    'email_verified' => 'true',
    'exp' => (string) (time() + 3600),
    'expires_in' => '3599',
], $override));

$auth = function (?string $body, ?string $clientId = null) use ($client, $editor, &$requested): GoogleAuth {
    return new GoogleAuth($clientId ?? $client, $editor, function (string $url) use ($body, &$requested): ?string {
        $requested = $url;
        return $body;
    });
};

/** Status of the ApiError thrown by `$run`, or null when nothing was thrown. */
$status = function (callable $run): ?int {
    try {
        $run();
    } catch (ApiError $error) {
        return $error->status;
    }
    return null;
};

$check('verify returns the email', $auth($info())->verify('Bearer tok'), 'me@example.com');
$check('verify asks tokeninfo with the encoded token', $requested, 'https://oauth2.googleapis.com/tokeninfo?access_token=tok');
$auth($info())->verify('Bearer a+b/c=');
$check('verify encodes the token', $requested, 'https://oauth2.googleapis.com/tokeninfo?access_token=a%2Bb%2Fc%3D');
$check('verify accepts boolean email_verified', $auth($info(['email_verified' => true]))->verify('Bearer t'), 'me@example.com');
$check('verify matches email case-insensitively', $auth($info(['email' => 'ME@EXAMPLE.COM']))->verify('Bearer t'), 'ME@EXAMPLE.COM');

$check('wrong audience is 401', $status(fn () => $auth($info(['aud' => 'other']))->verify('Bearer t')), 401);
$check('unverified email is 401', $status(fn () => $auth($info(['email_verified' => 'false']))->verify('Bearer t')), 401);
$check('expired token is 401', $status(fn () => $auth($info(['exp' => (string) (time() - 5)]))->verify('Bearer t')), 401);
$check('failed fetch is 401', $status(fn () => $auth(null)->verify('Bearer t')), 401);
$check('invalid JSON is 401', $status(fn () => $auth('not json')->verify('Bearer t')), 401);
$check('error response is 401', $status(fn () => $auth('{"error":"invalid_token"}')->verify('Bearer t')), 401);
$check('other email is 403', $status(fn () => $auth($info(['email' => 'other@example.com']))->verify('Bearer t')), 403);
$check('missing header is 401', $status(fn () => $auth($info())->verify(null)), 401);
$check('malformed header is 401', $status(fn () => $auth($info())->verify('Basic abc')), 401);

$check('missing header is 401 even without config', $status(fn () => (new GoogleAuth('', ''))->verify(null)), 401);

$threw = false;
try {
    $auth($info(), '')->verify('Bearer t');
} catch (RuntimeException $exception) {
    $threw = !($exception instanceof ApiError);
}
$check('empty client id is a configuration error', $threw, true);

$threw = false;
try {
    (new GoogleAuth($client, ''))->verify('Bearer t');
} catch (RuntimeException $exception) {
    $threw = !($exception instanceof ApiError);
}
$check('empty editor email is a configuration error', $threw, true);
