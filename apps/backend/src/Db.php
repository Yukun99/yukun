<?php

declare(strict_types=1);

namespace Yukun\Api;

final class Db
{
    private const DUPLICATE_KEY_ERRNO = 1062;

    private static ?\PDO $pdo = null;

    public static function config(): array
    {
        return require __DIR__ . '/../config.php';
    }

    public static function pdo(): \PDO
    {
        if (self::$pdo === null) {
            $config = self::config();
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['name']);
            self::$pdo = new \PDO($dsn, $config['user'], $config['password'], [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }
        return self::$pdo;
    }

    public static function run(string $sql, array $params = []): \PDOStatement
    {
        $statement = self::pdo()->prepare($sql);
        $statement->execute($params);
        return $statement;
    }

    public static function one(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    public static function isDuplicate(\PDOException $exception): bool
    {
        return ($exception->errorInfo[1] ?? null) === self::DUPLICATE_KEY_ERRNO;
    }
}
