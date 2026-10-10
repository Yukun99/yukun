<?php

declare(strict_types=1);

namespace Yukun\Api;

/** Checks a Google access token with Google's `tokeninfo` endpoint and that it belongs to the editor. */
final class GoogleAuth
{
    private const TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo?access_token=';

    private readonly \Closure $fetch;

    /** @param ?\Closure(string): ?string $fetch Returns the response body for a URL, or null on failure. */
    public function __construct(
        private readonly string $clientId,
        private readonly string $editorEmail,
        ?\Closure $fetch = null,
    ) {
        $this->fetch = $fetch ?? self::download(...);
    }

    /** The token from a raw `Authorization` header value, or null. */
    public static function bearer(?string $header): ?string
    {
        if ($header === null || preg_match('/^\s*Bearer\s+(\S+)\s*$/i', $header, $match) !== 1) {
            return null;
        }
        return $match[1];
    }

    /** Returns the editor's email, or throws 401 (bad or missing token) / 403 (someone else). */
    public function verify(?string $authorization): string
    {
        $token = self::bearer($authorization) ?? throw new ApiError(401, 'Sign in required');
        if ($this->clientId === '') {
            throw new \RuntimeException('Google client id is not configured');
        }
        if ($this->editorEmail === '') {
            throw new \RuntimeException('Editor email is not configured');
        }

        $body = ($this->fetch)(self::TOKEN_INFO_URL . rawurlencode($token));
        $info = $body === null ? null : json_decode($body, true);
        if (
            !is_array($info)
            || isset($info['error'])
            || ($info['aud'] ?? null) !== $this->clientId
            || !in_array($info['email_verified'] ?? null, ['true', true], true)
            || (int) ($info['exp'] ?? 0) <= time()
            || !is_string($info['email'] ?? null)
        ) {
            throw new ApiError(401, 'Invalid token');
        }
        if (strtolower($info['email']) !== strtolower($this->editorEmail)) {
            throw new ApiError(403, 'Not allowed to edit');
        }
        return $info['email'];
    }

    private static function download(string $url): ?string
    {
        if (function_exists('curl_init')) {
            $curl = curl_init($url);
            curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 5]);
            $body = curl_exec($curl);
            return is_string($body) ? $body : null;
        }
        $context = stream_context_create(['http' => ['timeout' => 5, 'ignore_errors' => true]]);
        $body = @file_get_contents($url, false, $context);
        return $body === false ? null : $body;
    }
}
