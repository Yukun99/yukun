<?php

declare(strict_types=1);

namespace Yukun\Api;

/** Values from the gitignored `config.php`, read once per request. */
final class Config
{
    private static ?array $values = null;

    public static function get(string $key): string
    {
        self::$values ??= require __DIR__ . '/../config.php';
        return (string) (self::$values[$key] ?? '');
    }
}
