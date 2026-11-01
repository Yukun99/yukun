<?php

declare(strict_types=1);

namespace Yukun\Api;

/** Uploaded 3D models, stored as GLB files; the owner can add and delete them but never change one. */
final class Models
{
    public const MAX_NAME = 50;
    public const MAX_LINK = 500;
    public const MAX_SIZE = 16 * 1024 * 1024;
    public const MAX_THUMBNAIL = 1024 * 1024;
    public const MAX_THUMBNAIL_PX = 1024;
    public const MAX_SOURCE = 16 * 1024 * 1024;
    public const LINK_PREFIX = 'https://makerworld.com/';

    public function __construct(private readonly ModelStore $store)
    {
    }

    /** @return array{models: list<array{id: int, name: string, link: string, size: int, createdAt: int, thumbnail: bool, source: bool}>} */
    public function all(): array
    {
        return ['models' => $this->store->all()];
    }

    public function file(int $id): string
    {
        return $this->store->file($id) ?? throw new ApiError(404, 'Model not found');
    }

    public function thumbnail(int $id): string
    {
        return $this->store->thumbnail($id) ?? throw new ApiError(404, 'Thumbnail not found');
    }

    /** Write-once, so the immutable cache header on the thumbnail route stays valid. */
    public function addThumbnail(int $id, string $data): void
    {
        if ($data === '') {
            throw new ApiError(400, 'Thumbnail is required');
        }
        if (strlen($data) > self::MAX_THUMBNAIL) {
            throw new ApiError(400, 'Thumbnail is over 1 MiB');
        }
        if (strlen($data) < 24 || !str_starts_with($data, "\x89PNG\r\n\x1a\n") || substr($data, 12, 4) !== 'IHDR') {
            throw new ApiError(400, 'Thumbnail is not a PNG');
        }
        $size = unpack('Nwidth/Nheight', $data, 16);
        foreach ($size as $pixels) {
            if ($pixels < 1 || $pixels > self::MAX_THUMBNAIL_PX) {
                throw new ApiError(400, 'Thumbnail must be 1 to ' . self::MAX_THUMBNAIL_PX . ' pixels on a side');
            }
        }
        if (!$this->store->addThumbnail($id, $data)) {
            throw $this->store->exists($id)
                ? new ApiError(409, 'Thumbnail already set')
                : new ApiError(404, 'Model not found');
        }
    }

    public function source(int $id): string
    {
        return $this->store->source($id) ?? throw new ApiError(404, 'Source not found');
    }

    /** Write-once, so the immutable cache header on the source route stays valid. */
    public function addSource(int $id, string $data): void
    {
        if ($data === '') {
            throw new ApiError(400, 'Source is required');
        }
        if (strlen($data) > self::MAX_SOURCE) {
            throw new ApiError(400, 'Source is over 16 MiB');
        }
        if (!str_starts_with($data, "PK\x03\x04")) {
            throw new ApiError(400, 'Source is not a 3MF');
        }
        if (!$this->store->addSource($id, $data)) {
            throw $this->store->exists($id)
                ? new ApiError(409, 'Source already set')
                : new ApiError(404, 'Model not found');
        }
    }

    public function remove(int $id): void
    {
        if (!$this->store->remove($id)) {
            throw new ApiError(404, 'Model not found');
        }
    }

    /** @return array{id: int, name: string, link: string, size: int, createdAt: int, thumbnail: bool, source: bool} */
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
        return ['id' => $id, 'name' => $name, 'link' => $link, 'size' => $size, 'createdAt' => $now, 'thumbnail' => false, 'source' => false];
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
