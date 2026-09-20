<?php

declare(strict_types=1);

namespace Yukun\Api;

/** Pure helpers that turn a request into an anonymous visitor identity. */
final class Visitor
{
    private const BOT_PATTERN = '/bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|scrapy|externalhit'
        . '|curl|wget|python|httpclient|axios|node-fetch|go-http|java\/|okhttp|libwww/i';

    private const IPV4_MAPPED_PREFIX = "\0\0\0\0\0\0\0\0\0\0\xff\xff";

    /** Canonical address bytes, or null when `$ip` is not an IP address. */
    public static function normalise(string $ip): ?string
    {
        $bytes = @inet_pton($ip);
        if ($bytes === false) {
            return null;
        }
        if (strlen($bytes) === 4) {
            return $bytes;
        }
        if (str_starts_with($bytes, self::IPV4_MAPPED_PREFIX)) {
            return substr($bytes, 12);
        }
        // IPv6 privacy addresses rotate inside the /64, so only the network half identifies a visitor.
        return substr($bytes, 0, 8);
    }

    /** Keyed hash of the address, so the stored value can't be reversed without the salt. */
    public static function hash(string $ip, string $salt): ?string
    {
        if ($salt === '') {
            throw new \RuntimeException('Visitor salt is not configured');
        }
        $bytes = self::normalise($ip);
        return $bytes === null ? null : hash_hmac('sha256', $bytes, $salt);
    }

    public static function isBot(string $userAgent): bool
    {
        return trim($userAgent) === '' || preg_match(self::BOT_PATTERN, $userAgent) === 1;
    }
}
