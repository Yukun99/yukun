<?php

declare(strict_types=1);

namespace Yukun\Api;

final class Http
{
    private const MAX_BODY = 16 * 1024 * 1024;

    public static function json(int $status, mixed $data): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        exit;
    }

    /** Request path relative to the directory holding index.php, e.g. `/visitors`. */
    public static function routePath(): string
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
        if ($base !== '' && str_starts_with($path, $base)) {
            $path = substr($path, strlen($base));
        }
        return '/' . trim($path, '/');
    }

    /** Only the socket address is trusted; forwarded headers are client-controlled. */
    public static function ip(): string
    {
        return (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    }

    public static function userAgent(): string
    {
        return (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    }

    /** Apache on shared hosting often exposes the header only as the redirected variable. */
    public static function authorization(): ?string
    {
        return $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
    }

    /** Query string value, or null when absent or not a plain string. */
    public static function query(string $key): ?string
    {
        $value = $_GET[$key] ?? null;
        return is_string($value) ? $value : null;
    }

    public static function rawBody(): string
    {
        $raw = file_get_contents('php://input', false, null, 0, self::MAX_BODY + 1);
        if ($raw === false || $raw === '') {
            return '';
        }
        if (strlen($raw) > self::MAX_BODY) {
            throw new ApiError(413, 'Body too large');
        }
        return $raw;
    }

    /** The second header() argument replaces the global no-store. */
    public static function noContent(): never
    {
        http_response_code(204);
        exit;
    }

    public static function binary(int $status, string $contentType, string $bytes): never
    {
        http_response_code($status);
        header('Content-Type: ' . $contentType);
        header('Content-Length: ' . strlen($bytes));
        header('Cache-Control: public, max-age=31536000, immutable', true);
        echo $bytes;
        exit;
    }

    public static function jsonBody(): mixed
    {
        $raw = self::rawBody();
        if ($raw === '') {
            return null;
        }
        try {
            return json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new ApiError(400, 'Invalid JSON');
        }
    }
}
