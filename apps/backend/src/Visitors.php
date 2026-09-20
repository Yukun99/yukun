<?php

declare(strict_types=1);

namespace Yukun\Api;

final class Visitors
{
    public const VISIT_GAP_MS = 30 * 60 * 1000;

    public function __construct(private readonly VisitorStore $store, private readonly string $salt)
    {
    }

    /** Registers or refreshes the visitor. Bots are never stored and get `number: null`. */
    public function visit(string $ip, string $userAgent, int $now): array
    {
        $hash = Visitor::isBot($userAgent) ? null : Visitor::hash($ip, $this->salt);
        if ($hash === null) {
            return $this->result(null);
        }
        $id = $this->store->find($hash);
        if ($id === null) {
            $id = $this->store->add($hash, $now);
        } else {
            $this->store->touch($id, $now, self::VISIT_GAP_MS);
        }
        return $this->result($id);
    }

    /** Read-only lookup; never writes. */
    public function peek(string $ip): array
    {
        $hash = Visitor::hash($ip, $this->salt);
        return $this->result($hash === null ? null : $this->store->find($hash));
    }

    private function result(?int $id): array
    {
        return [
            'number' => $id === null ? null : $this->store->number($id),
            'total' => $this->store->total(),
        ];
    }
}
