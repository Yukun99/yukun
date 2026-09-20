<?php

declare(strict_types=1);

namespace Yukun\Api;

final class DbVisitorStore implements VisitorStore
{
    public function find(string $hash): ?int
    {
        $row = Db::one('SELECT id FROM visitors WHERE ip_hash = ?', [$hash]);
        return $row === null ? null : (int) $row['id'];
    }

    public function add(string $hash, int $now): int
    {
        try {
            Db::run('INSERT INTO visitors (ip_hash, first_seen, last_seen) VALUES (?, ?, ?)', [$hash, $now, $now]);
            return (int) Db::pdo()->lastInsertId();
        } catch (\PDOException $exception) {
            if (!Db::isDuplicate($exception)) {
                throw $exception;
            }
            return $this->find($hash) ?? throw $exception;
        }
    }

    public function touch(int $id, int $now, int $visitGap): void
    {
        Db::run(
            'UPDATE visitors SET visits = visits + (last_seen < ?), last_seen = ? WHERE id = ?',
            [$now - $visitGap, $now, $id],
        );
    }

    // Counted rather than read from `id`, because AUTO_INCREMENT leaves gaps.
    public function number(int $id): int
    {
        return (int) Db::one('SELECT COUNT(*) AS n FROM visitors WHERE id <= ?', [$id])['n'];
    }

    public function total(): int
    {
        return (int) Db::one('SELECT COUNT(*) AS n FROM visitors')['n'];
    }
}
