<?php

declare(strict_types=1);

namespace Yukun\Api;

interface ModelStore
{
    /** @return list<array{id: int, name: string, link: string, size: int, createdAt: int}> Ordered by id, without the bytes. */
    public function all(): array;

    /** The GLB bytes, or null when there is no such model. */
    public function file(int $id): ?string;

    /** Returns the new id. */
    public function add(string $name, string $link, string $data, int $now): int;

    /** Deletes the row and its bytes; false when there is no such model. */
    public function remove(int $id): bool;
}
