<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\Config;
use Yukun\Api\DbIdeaStore;
use Yukun\Api\DbVisitorStore;
use Yukun\Api\GoogleAuth;
use Yukun\Api\Http;
use Yukun\Api\Ideas;
use Yukun\Api\Router;
use Yukun\Api\Visitors;

require __DIR__ . '/src/autoload.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$visitors = fn (): Visitors => new Visitors(new DbVisitorStore(), Config::get('salt'));
$ideas = fn (): Ideas => new Ideas(new DbIdeaStore());
$auth = fn (): GoogleAuth => new GoogleAuth(Config::get('googleClientId'), Config::get('editorEmail'));
$now = fn (): int => (int) floor(microtime(true) * 1000);

$router = new Router();
$router->add('GET', '/visitors', fn () => Http::json(200, $visitors()->peek(Http::ip())));
$router->add('POST', '/visitors', fn () => Http::json(200, $visitors()->visit(Http::ip(), Http::userAgent(), $now())));
$router->add('GET', '/ideas', fn () => Http::json(200, $ideas()->all()));
$router->add('PUT', '/ideas', function () use ($ideas, $auth, $now): never {
    $auth()->verify(Http::authorization());
    Http::json(200, $ideas()->replace(Http::jsonBody(), $now()));
});

try {
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', Http::routePath());
} catch (ApiError $error) {
    Http::json($error->status, ['error' => $error->getMessage()]);
} catch (Throwable $throwable) {
    error_log((string) $throwable);
    Http::json(500, ['error' => 'Internal server error']);
}
