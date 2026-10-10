<?php

declare(strict_types=1);

namespace Yukun\Api;

interface IdeaStore
{
    /** @return list<array{slot: int, title: string, content: string}> Stored slots ordered by slot. */
    public function all(): array;

    /** Upserts every slot; `$ideas` is indexed by slot. */
    public function save(array $ideas, int $now): void;
}
