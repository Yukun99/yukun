<?php

declare(strict_types=1);

use Yukun\Api\ModelStore;

/** In-memory stand-in for the MySQL store. */
final class MemoryModelStore implements ModelStore
{
    /** @var array<int, array{name: string, link: string, data: string, createdAt: int}> */
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
            ];
        }
        return $all;
    }

    public function file(int $id): ?string
    {
        return $this->rows[$id]['data'] ?? null;
    }

    public function add(string $name, string $link, string $data, int $now): int
    {
        $this->writes++;
        $id = $this->rows === [] ? 1 : max(array_keys($this->rows)) + 1;
        $this->rows[$id] = ['name' => $name, 'link' => $link, 'data' => $data, 'createdAt' => $now];
        return $id;
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
