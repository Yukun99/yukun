<?php

declare(strict_types=1);

namespace Yukun\Api;

interface ModelStore
{
    /** @return list<array{id: int, name: string, link: string, size: int, createdAt: int, thumbnail: bool}> Ordered by id, without the bytes. */
    public function all(): array;

    /** The GLB bytes, or null when there is no such model. */
    public function file(int $id): ?string;

    /** The PNG bytes, or null when there is no such model or it has no thumbnail. */
    public function thumbnail(int $id): ?string;

    public function exists(int $id): bool;

    /** Stores the thumbnail only when the model exists and has none yet; false otherwise. */
    public function addThumbnail(int $id, string $data): bool;

    /** Returns the new id. */
    public function add(string $name, string $link, string $data, int $now): int;

    /** Deletes the row and its bytes; false when there is no such model. */
    public function remove(int $id): bool;
}
