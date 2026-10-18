<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\Config;
use Yukun\Api\DbIdeaStore;
use Yukun\Api\DbModelStore;
use Yukun\Api\DbVisitorStore;
use Yukun\Api\GoogleAuth;
use Yukun\Api\Http;
use Yukun\Api\Ideas;
use Yukun\Api\Models;
use Yukun\Api\Router;
use Yukun\Api\Visitors;

require __DIR__ . '/src/autoload.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$visitors = fn (): Visitors => new Visitors(new DbVisitorStore(), Config::get('salt'));
$ideas = fn (): Ideas => new Ideas(new DbIdeaStore());
$models = fn (): Models => new Models(new DbModelStore());
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
$router->add('GET', '/models', fn () => Http::json(200, $models()->all()));
$router->add('GET', '/models/{id}/file', function (array $params) use ($models): never {
    if (!ctype_digit($params['id'])) {
        throw new ApiError(404, 'Model not found');
    }
    Http::binary(200, 'model/gltf-binary', $models()->file((int) $params['id']));
});
$router->add('POST', '/models', function () use ($models, $auth, $now): never {
    $auth()->verify(Http::authorization());
    Http::json(201, $models()->add(Http::query('name'), Http::query('link'), Http::rawBody(), $now()));
});
$router->add('DELETE', '/models/{id}', function (array $params) use ($models, $auth): never {
    $auth()->verify(Http::authorization());
    if (!ctype_digit($params['id'])) {
        throw new ApiError(404, 'Model not found');
    }
    $models()->remove((int) $params['id']);
    Http::noContent();
});

try {
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', Http::routePath());
} catch (ApiError $error) {
    Http::json($error->status, ['error' => $error->getMessage()]);
} catch (Throwable $throwable) {
    error_log((string) $throwable);
    Http::json(500, ['error' => 'Internal server error']);
}
