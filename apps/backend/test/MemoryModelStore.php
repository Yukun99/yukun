<?php

declare(strict_types=1);

use Yukun\Api\ModelStore;

/** In-memory stand-in for the MySQL store. */
final class MemoryModelStore implements ModelStore
{
    /** @var array<int, array{name: string, link: string, data: string, createdAt: int, updatedAt?: int, thumbnail?: ?string, source?: ?string}> */
    public array $rows = [];

    public int $writes = 0;

    public function all(): array
    {
        ksort($this->rows);
        $all = [];
        foreach ($this->rows as $id => $row) {
            $all[] = [
                'id' => $id,
                'name' => $row['name'],
                'link' => $row['link'],
                'size' => strlen($row['data']),
                'createdAt' => $row['createdAt'],
                'updatedAt' => $row['updatedAt'] ?? $row['createdAt'],
                'thumbnail' => isset($row['thumbnail']),
                'source' => isset($row['source']),
            ];
        }
        return $all;
    }

    public function file(int $id): ?string
    {
        return $this->rows[$id]['data'] ?? null;
    }

    public function thumbnail(int $id): ?string
    {
        return $this->rows[$id]['thumbnail'] ?? null;
    }

    public function source(int $id): ?string
    {
        return $this->rows[$id]['source'] ?? null;
    }

    public function exists(int $id): bool
    {
        return isset($this->rows[$id]);
    }

    public function addThumbnail(int $id, string $data): bool
    {
        if (!isset($this->rows[$id]) || isset($this->rows[$id]['thumbnail'])) {
            return false;
        }
        $this->writes++;
        $this->rows[$id]['thumbnail'] = $data;
        return true;
    }

    public function addSource(int $id, string $data): bool
    {
        if (!isset($this->rows[$id]) || isset($this->rows[$id]['source'])) {
            return false;
        }
        $this->writes++;
        $this->rows[$id]['source'] = $data;
        return true;
    }

    public function add(string $name, string $link, string $data, int $now): int
    {
        $this->writes++;
        $id = $this->rows === [] ? 1 : max(array_keys($this->rows)) + 1;
        $this->rows[$id] = ['name' => $name, 'link' => $link, 'data' => $data, 'createdAt' => $now, 'updatedAt' => $now];
        return $id;
    }

    public function one(int $id): ?array
    {
        foreach ($this->all() as $model) {
            if ($model['id'] === $id) {
                return $model;
            }
        }
        return null;
    }

    public function update(int $id, string $name, string $link, int $now): bool
    {
        if (!isset($this->rows[$id])) {
            return false;
        }
        $this->writes++;
        $this->rows[$id]['name'] = $name;
        $this->rows[$id]['link'] = $link;
        $this->rows[$id]['updatedAt'] = $now;
        return true;
    }

    public function replaceFile(int $id, string $data, int $now): bool
    {
        if (!isset($this->rows[$id])) {
            return false;
        }
        $this->writes++;
        $this->rows[$id]['data'] = $data;
        unset($this->rows[$id]['thumbnail'], $this->rows[$id]['source']);
        $this->rows[$id]['updatedAt'] = $now;
        return true;
    }

    public function remove(int $id): bool
    {
        if (!isset($this->rows[$id])) {
            return false;
        }
        unset($this->rows[$id]);
        return true;
    }
}
