<?php

declare(strict_types=1);

namespace Yukun\Api;

final class DbModelStore implements ModelStore
{
    public function all(): array
    {
        $rows = Db::run('SELECT id, name, link, size, created_at, thumbnail IS NOT NULL AS has_thumbnail FROM models ORDER BY id')->fetchAll();
        return array_map(
            fn (array $row): array => [
                'id' => (int) $row['id'],
                'name' => (string) $row['name'],
                'link' => (string) $row['link'],
                'size' => (int) $row['size'],
                'createdAt' => (int) $row['created_at'],
                'thumbnail' => (bool) $row['has_thumbnail'],
            ],
            $rows,
        );
    }

    public function file(int $id): ?string
    {
        $row = Db::one('SELECT data FROM models WHERE id = ?', [$id]);
        return $row === null ? null : (string) $row['data'];
    }

    public function thumbnail(int $id): ?string
    {
        $row = Db::one('SELECT thumbnail FROM models WHERE id = ?', [$id]);
        return $row === null || $row['thumbnail'] === null ? null : (string) $row['thumbnail'];
    }

    public function exists(int $id): bool
    {
        return Db::one('SELECT 1 FROM models WHERE id = ?', [$id]) !== null;
    }

    public function addThumbnail(int $id, string $data): bool
    {
        return Db::run('UPDATE models SET thumbnail = ? WHERE id = ? AND thumbnail IS NULL', [$data, $id])->rowCount() > 0;
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
