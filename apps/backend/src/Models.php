<?php

declare(strict_types=1);

namespace Yukun\Api;

/** Uploaded 3D models, stored as GLB files; the owner can add and delete them but never change one. */
final class Models
{
    public const MAX_NAME = 50;
    public const MAX_LINK = 500;
    public const MAX_SIZE = 16 * 1024 * 1024;
    public const LINK_PREFIX = 'https://makerworld.com/';

    public function __construct(private readonly ModelStore $store)
    {
    }

    /** @return array{models: list<array{id: int, name: string, link: string, size: int, createdAt: int}>} */
    public function all(): array
    {
        return ['models' => $this->store->all()];
    }

    public function file(int $id): string
    {
        return $this->store->file($id) ?? throw new ApiError(404, 'Model not found');
    }

    public function remove(int $id): void
    {
        if (!$this->store->remove($id)) {
            throw new ApiError(404, 'Model not found');
        }
    }

    /** @return array{id: int, name: string, link: string, size: int, createdAt: int} */
    public function add(?string $name, ?string $link, string $data, int $now): array
    {
        $name = trim($name ?? '');
        if ($name === '') {
            throw new ApiError(400, 'Name is required');
        }
        if (self::length($name) > self::MAX_NAME) {
            throw new ApiError(400, 'Name is over ' . self::MAX_NAME . ' characters');
        }

        $link ??= '';
        if ($link !== '') {
            if (!str_starts_with($link, self::LINK_PREFIX)) {
                throw new ApiError(400, 'Link must start with ' . self::LINK_PREFIX);
            }
            if (preg_match('/[\s\x00-\x1f\x7f]/', $link) === 1) {
                throw new ApiError(400, 'Link must not contain whitespace');
            }
            if (self::length($link) > self::MAX_LINK) {
                throw new ApiError(400, 'Link is over ' . self::MAX_LINK . ' characters');
            }
        }

        $size = strlen($data);
        if ($size === 0) {
            throw new ApiError(400, 'File is required');
        }
        if ($size > self::MAX_SIZE) {
            throw new ApiError(400, 'File is over 16 MiB');
        }
        if (!self::isGlb($data)) {
            throw new ApiError(400, 'File is not a GLB');
        }

        $id = $this->store->add($name, $link, $data, $now);
        return ['id' => $id, 'name' => $name, 'link' => $link, 'size' => $size, 'createdAt' => $now];
    }

    private static function isGlb(string $data): bool
    {
        if (strlen($data) < 12 || !str_starts_with($data, 'glTF')) {
            return false;
        }
        $header = unpack('Vversion/Vlength', $data, 4);
        return $header['version'] === 2 && $header['length'] === strlen($data);
    }

    /** Characters, not bytes; `mbstring` is optional on shared hosting and local PHP builds. */
    private static function length(string $text): int
    {
        return function_exists('mb_strlen') ? mb_strlen($text) : (int) preg_match_all('/./su', $text);
    }
}
