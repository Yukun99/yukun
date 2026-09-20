<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\Router;

$calls = [];
$router = new Router();
$router->add('GET', '/visitors', function () use (&$calls): void {
    $calls[] = 'get';
});
$router->add('POST', '/visitors', function () use (&$calls): void {
    $calls[] = 'post';
});
$router->add('GET', '/things/{id}', function (array $params) use (&$calls): void {
    $calls[] = 'thing:' . $params['id'];
});

$status = function (string $method, string $path) use ($router): int {
    try {
        $router->dispatch($method, $path);
        return 200;
    } catch (ApiError $error) {
        return $error->status;
    }
};

$check('GET route matches', $status('GET', '/visitors'), 200);
$check('POST route matches', $status('POST', '/visitors'), 200);
$check('named segment is passed', $status('GET', '/things/abc'), 200);
$check('handlers ran in order', $calls, ['get', 'post', 'thing:abc']);
$check('wrong method is 405', $status('DELETE', '/visitors'), 405);
$check('unknown path is 404', $status('GET', '/nope'), 404);
$check('prefix is not a match', $status('GET', '/visitors/extra'), 404);
