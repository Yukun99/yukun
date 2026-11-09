<?php

declare(strict_types=1);

namespace Yukun\Api;

final class DbModelStore implements ModelStore
{
    private const COLUMNS = 'id, name, link, size, created_at, updated_at, thumbnail IS NOT NULL AS has_thumbnail, source IS NOT NULL AS has_source';

    public function all(): array
    {
        return array_map(self::row(...), Db::run('SELECT ' . self::COLUMNS . ' FROM models ORDER BY id')->fetchAll());
    }

    public function one(int $id): ?array
    {
        $row = Db::one('SELECT ' . self::COLUMNS . ' FROM models WHERE id = ?', [$id]);
        return $row === null ? null : self::row($row);
    }

    private static function row(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
            'link' => (string) $row['link'],
            'size' => (int) $row['size'],
            'createdAt' => (int) $row['created_at'],
            'updatedAt' => (int) $row['updated_at'],
            'thumbnail' => (bool) $row['has_thumbnail'],
            'source' => (bool) $row['has_source'],
        ];
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

    public function source(int $id): ?string
    {
        $row = Db::one('SELECT source FROM models WHERE id = ?', [$id]);
        return $row === null || $row['source'] === null ? null : (string) $row['source'];
    }

    public function exists(int $id): bool
    {
        return Db::one('SELECT 1 FROM models WHERE id = ?', [$id]) !== null;
    }

    public function addThumbnail(int $id, string $data): bool
    {
        return Db::run('UPDATE models SET thumbnail = ? WHERE id = ? AND thumbnail IS NULL', [$data, $id])->rowCount() > 0;
    }

    public function addSource(int $id, string $data): bool
    {
        return Db::run('UPDATE models SET source = ? WHERE id = ? AND source IS NULL', [$data, $id])->rowCount() > 0;
    }

    public function add(string $name, string $link, string $data, int $now): int
    {
        Db::run(
            'INSERT INTO models (name, link, size, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [$name, $link, strlen($data), $data, $now, $now],
        );
        return (int) Db::pdo()->lastInsertId();
    }

    public function update(int $id, string $name, string $link, int $now): bool
    {
        if (!$this->exists($id)) {
            return false;
        }
        Db::run('UPDATE models SET name = ?, link = ?, updated_at = ? WHERE id = ?', [$name, $link, $now, $id]);
        return true;
    }

    public function replaceFile(int $id, string $data, int $now): bool
    {
        if (!$this->exists($id)) {
            return false;
        }
        Db::run('UPDATE models SET data = ?, size = ?, thumbnail = NULL, source = NULL, updated_at = ? WHERE id = ?', [$data, strlen($data), $now, $id]);
        return true;
    }

    public function remove(int $id): bool
    {
        return Db::run('DELETE FROM models WHERE id = ?', [$id])->rowCount() > 0;
    }
}
