<?php

declare(strict_types=1);

namespace Yukun\Api;

interface ModelStore
{
    /** @return list<array{id: int, name: string, link: string, size: int, createdAt: int, updatedAt: int, thumbnail: bool, source: bool}> Ordered by id, without the bytes. */
    public function all(): array;

    /** The GLB bytes, or null when there is no such model. */
    public function file(int $id): ?string;

    /** The PNG bytes, or null when there is no such model or it has no thumbnail. */
    public function thumbnail(int $id): ?string;

    /** The 3MF bytes, or null when there is no such model or it has no source. */
    public function source(int $id): ?string;

    public function exists(int $id): bool;

    /** Stores the thumbnail only when the model exists and has none yet; false otherwise. */
    public function addThumbnail(int $id, string $data): bool;

    /** Stores the source only when the model exists and has none yet; false otherwise. */
    public function addSource(int $id, string $data): bool;

    /** Returns the new id. */
    public function add(string $name, string $link, string $data, int $now): int;

    /** One model's metadata, or null when there is no such model. */
    public function one(int $id): ?array;

    /** Changes name and link; false when there is no such model. */
    public function update(int $id, string $name, string $link, int $now): bool;

    /** Swaps the GLB bytes and clears thumbnail and source; false when there is no such model. */
    public function replaceFile(int $id, string $data, int $now): bool;

    /** Deletes the row and its bytes; false when there is no such model. */
    public function remove(int $id): bool;
}
