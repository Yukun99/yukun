<?php

declare(strict_types=1);

namespace Yukun\Api;

final class Db
{
    private const DUPLICATE_KEY_ERRNO = 1062;

    private static ?\PDO $pdo = null;

    public static function pdo(): \PDO
    {
        if (self::$pdo === null) {
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', Config::get('host'), Config::get('name'));
            self::$pdo = new \PDO($dsn, Config::get('user'), Config::get('password'), [
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
