<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\Config;
use Yukun\Api\DbVisitorStore;
use Yukun\Api\Http;
use Yukun\Api\Router;
use Yukun\Api\Visitors;

require __DIR__ . '/src/autoload.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$visitors = fn (): Visitors => new Visitors(new DbVisitorStore(), Config::get('salt'));
$now = fn (): int => (int) floor(microtime(true) * 1000);

$router = new Router();
$router->add('GET', '/visitors', fn () => Http::json(200, $visitors()->peek(Http::ip())));
$router->add('POST', '/visitors', fn () => Http::json(200, $visitors()->visit(Http::ip(), Http::userAgent(), $now())));

try {
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', Http::routePath());
} catch (ApiError $error) {
    Http::json($error->status, ['error' => $error->getMessage()]);
} catch (Throwable $throwable) {
    error_log((string) $throwable);
    Http::json(500, ['error' => 'Internal server error']);
}
