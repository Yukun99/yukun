<?php

declare(strict_types=1);

use Yukun\Api\VisitorStore;

/** In-memory stand-in for the MySQL store, with id gaps like AUTO_INCREMENT leaves. */
final class MemoryVisitorStore implements VisitorStore
{
    /** @var array<int, array{hash: string, first_seen: int, last_seen: int, visits: int}> */
    public array $rows = [];

    public int $writes = 0;

    private int $nextId = 1;

    public function find(string $hash): ?int
    {
        foreach ($this->rows as $id => $row) {
            if ($row['hash'] === $hash) {
                return $id;
            }
        }
        return null;
    }

    public function add(string $hash, int $now): int
    {
        $this->writes++;
        $id = $this->nextId;
        $this->nextId += 3;
        $this->rows[$id] = ['hash' => $hash, 'first_seen' => $now, 'last_seen' => $now, 'visits' => 1];
        return $id;
    }

    public function touch(int $id, int $now, int $visitGap): void
    {
        $this->writes++;
        if ($this->rows[$id]['last_seen'] < $now - $visitGap) {
            $this->rows[$id]['visits']++;
        }
        $this->rows[$id]['last_seen'] = $now;
    }

    public function number(int $id): int
    {
        return count(array_filter(array_keys($this->rows), fn (int $other): bool => $other <= $id));
    }

    public function total(): int
    {
        return count($this->rows);
    }
}
