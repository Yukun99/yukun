<?php

declare(strict_types=1);

use Yukun\Api\Visitors;

$browser = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0.0.0 Safari/537.36';
$gap = Visitors::VISIT_GAP_MS;

$store = new MemoryVisitorStore();
$visitors = new Visitors($store, 'test-salt');

$check('empty site peeks as nobody', $visitors->peek('203.0.113.1'), ['number' => null, 'total' => 0]);
$check('peek never writes', $store->writes, 0);

$check('first visitor is number 1', $visitors->visit('203.0.113.1', $browser, 1000), ['number' => 1, 'total' => 1]);
$check('second visitor is number 2', $visitors->visit('203.0.113.2', $browser, 2000), ['number' => 2, 'total' => 2]);
$check('third visitor is number 3 despite id gaps', $visitors->visit('203.0.113.3', $browser, 3000), ['number' => 3, 'total' => 3]);

$check('returning visitor keeps their number', $visitors->visit('203.0.113.1', $browser, 4000), ['number' => 1, 'total' => 3]);
$check('returning visitor adds no row', count($store->rows), 3);
$check('peek finds a known visitor', $visitors->peek('203.0.113.2'), ['number' => 2, 'total' => 3]);

$first = $store->find((string) Yukun\Api\Visitor::hash('203.0.113.1', 'test-salt'));
$check('reload inside the gap is the same visit', $store->rows[$first]['visits'], 1);
$check('reload still refreshes last_seen', $store->rows[$first]['last_seen'], 4000);
$visitors->visit('203.0.113.1', $browser, 4000 + $gap + 1);
$check('return after the gap is a new visit', $store->rows[$first]['visits'], 2);
$check('first_seen never changes', $store->rows[$first]['first_seen'], 1000);

$writes = $store->writes;
$check('bot gets the total but no number', $visitors->visit('203.0.113.9', 'Googlebot/2.1', 5000), ['number' => null, 'total' => 3]);
$check('missing user agent is treated as a bot', $visitors->visit('203.0.113.9', '', 5000), ['number' => null, 'total' => 3]);
$check('invalid address is not stored', $visitors->visit('garbage', $browser, 5000), ['number' => null, 'total' => 3]);
$check('none of those wrote', $store->writes, $writes);

$check('stored hashes never hold the address', str_contains(json_encode($store->rows), '203.0.113'), false);
