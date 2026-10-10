<?php

declare(strict_types=1);

namespace Yukun\Api;

/** The idea grid: a flat list of slots whose count is a multiple of COLS and never shrinks. */
final class Ideas
{
    public const COLS = 6;
    public const MIN_ROWS = 4;
    public const MAX_SLOTS = 396;
    public const MAX_TITLE = 50;
    public const MAX_CONTENT = 5000;

    public function __construct(private readonly IdeaStore $store)
    {
    }

    /** @return array{ideas: list<array{title: string, content: string}>} */
    public function all(): array
    {
        $stored = $this->store->all();
        $highest = $stored === [] ? 0 : max(array_column($stored, 'slot')) + 1;
        $count = max(self::COLS * self::MIN_ROWS, (int) (ceil($highest / self::COLS) * self::COLS));
        $ideas = array_fill(0, $count, ['title' => '', 'content' => '']);
        foreach ($stored as $row) {
            $ideas[$row['slot']] = ['title' => $row['title'], 'content' => $row['content']];
        }
        return ['ideas' => $ideas];
    }

    /** @return array{ideas: list<array{title: string, content: string}>} */
    public function replace(mixed $body, int $now): array
    {
        if (!is_array($body) || !is_array($body['ideas'] ?? null) || !array_is_list($body['ideas'])) {
            throw new ApiError(400, 'Body must be { "ideas": [...] }');
        }
        $incoming = $body['ideas'];
        $count = count($incoming);
        if ($count % self::COLS !== 0) {
            throw new ApiError(400, 'Slot count must be a multiple of ' . self::COLS);
        }
        if ($count < self::COLS * self::MIN_ROWS) {
            throw new ApiError(400, 'Need at least ' . self::COLS * self::MIN_ROWS . ' slots');
        }
        if ($count > self::MAX_SLOTS) {
            throw new ApiError(400, 'At most ' . self::MAX_SLOTS . ' slots');
        }
        if ($count < count($this->all()['ideas'])) {
            throw new ApiError(400, 'The grid cannot shrink');
        }

        $clean = [];
        foreach ($incoming as $idea) {
            if (!is_array($idea) || !is_string($idea['title'] ?? null) || !is_string($idea['content'] ?? null)) {
                throw new ApiError(400, 'Every idea needs a string title and content');
            }
            $title = trim($idea['title']);
            if (self::length($title) > self::MAX_TITLE) {
                throw new ApiError(400, 'Title is over ' . self::MAX_TITLE . ' characters');
            }
            if (self::length($idea['content']) > self::MAX_CONTENT) {
                throw new ApiError(400, 'Content is over ' . self::MAX_CONTENT . ' characters');
            }
            $clean[] = ['title' => $title, 'content' => $idea['content']];
        }

        $this->store->save($clean, $now);
        return $this->all();
    }

    /** Characters, not bytes; `mbstring` is optional on shared hosting and local PHP builds. */
    private static function length(string $text): int
    {
        return function_exists('mb_strlen') ? mb_strlen($text) : (int) preg_match_all('/./su', $text);
    }
}
