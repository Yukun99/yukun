<?php

declare(strict_types=1);

namespace Yukun\Api;

final class DbModelStore implements ModelStore
{
    public function all(): array
    {
        $rows = Db::run('SELECT id, name, link, size, created_at FROM models ORDER BY id')->fetchAll();
        return array_map(
            fn (array $row): array => [
                'id' => (int) $row['id'],
                'name' => (string) $row['name'],
                'link' => (string) $row['link'],
                'size' => (int) $row['size'],
                'createdAt' => (int) $row['created_at'],
            ],
            $rows,
        );
    }

    public function file(int $id): ?string
    {
        $row = Db::one('SELECT data FROM models WHERE id = ?', [$id]);
        return $row === null ? null : (string) $row['data'];
    }

    public function add(string $name, string $link, string $data, int $now): int
    {
        Db::run(
            'INSERT INTO models (name, link, size, data, created_at) VALUES (?, ?, ?, ?, ?)',
            [$name, $link, strlen($data), $data, $now],
        );
        return (int) Db::pdo()->lastInsertId();
    }

    public function remove(int $id): bool
    {
        return Db::run('DELETE FROM models WHERE id = ?', [$id])->rowCount() > 0;
    }
}
