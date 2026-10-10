<?php

declare(strict_types=1);

use Yukun\Api\IdeaStore;

/** In-memory stand-in for the MySQL store. */
final class MemoryIdeaStore implements IdeaStore
{
    /** @var array<int, array{title: string, content: string}> */
    public array $rows = [];

    public int $writes = 0;

    public function all(): array
    {
        ksort($this->rows);
        $all = [];
        foreach ($this->rows as $slot => $row) {
            $all[] = ['slot' => $slot, 'title' => $row['title'], 'content' => $row['content']];
        }
        return $all;
    }

    public function save(array $ideas, int $now): void
    {
        $this->writes++;
        foreach ($ideas as $slot => $idea) {
            $this->rows[$slot] = ['title' => $idea['title'], 'content' => $idea['content']];
        }
    }
}
