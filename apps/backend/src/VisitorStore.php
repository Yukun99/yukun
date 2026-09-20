<?php

declare(strict_types=1);

namespace Yukun\Api;

interface VisitorStore
{
    /** Id of the visitor with this hash, or null. */
    public function find(string $hash): ?int;

    /** Inserts the visitor and returns its id; returns the existing id if another request won the race. */
    public function add(string $hash, int $now): int;

    /** Updates `last_seen`, counting a new visit only when the last one is older than `$visitGap` ms. */
    public function touch(int $id, int $now, int $visitGap): void;

    /** 1-based position of the visitor in arrival order. */
    public function number(int $id): int;

    public function total(): int;
}
