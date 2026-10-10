<?php

declare(strict_types=1);

namespace Yukun\Api;

final class DbIdeaStore implements IdeaStore
{
    public function all(): array
    {
        $rows = Db::run('SELECT slot, title, content FROM ideas ORDER BY slot')->fetchAll();
        return array_map(
            fn (array $row): array => ['slot' => (int) $row['slot'], 'title' => (string) $row['title'], 'content' => (string) $row['content']],
            $rows,
        );
    }

    public function save(array $ideas, int $now): void
    {
        $pdo = Db::pdo();
        $pdo->beginTransaction();
        try {
            foreach ($ideas as $slot => $idea) {
                Db::run(
                    'INSERT INTO ideas (slot, title, content, updated_at) VALUES (?, ?, ?, ?) '
                    . 'ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), updated_at = VALUES(updated_at)',
                    [$slot, $idea['title'], $idea['content'], $now],
                );
            }
            $pdo->commit();
        } catch (\Throwable $throwable) {
            $pdo->rollBack();
            throw $throwable;
        }
    }
}
