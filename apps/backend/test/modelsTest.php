<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\Models;

/** A GLB whose header length is `$total` (the real length when null). */
$glb = function (?int $total = null, int $version = 2, string $magic = 'glTF', int $pad = 0): string {
    $json = '{"asset":{"version":"2.0"}}';
    $json .= str_repeat(' ', (4 - strlen($json) % 4) % 4);
    $body = pack('V', strlen($json) + $pad) . 'JSON' . $json . str_repeat(' ', $pad);
    return $magic . pack('V', $version) . pack('V', $total ?? 12 + strlen($body)) . $body;
};

/** Status of the ApiError thrown by `$run`, or null when nothing was thrown. */
$status = function (callable $run): ?int {
    try {
        $run();
    } catch (ApiError $error) {
        return $error->status;
    }
    return null;
};

$store = new MemoryModelStore();
$check('empty list', (new Models($store))->all(), ['models' => []]);

$store = new MemoryModelStore();
$store->rows = [
    2 => ['name' => 'second', 'link' => '', 'data' => 'abcd', 'createdAt' => 20],
    1 => ['name' => 'first', 'link' => 'https://makerworld.com/x', 'data' => 'ab', 'createdAt' => 10],
];
$models = new Models($store);
$check('list is ordered and has no bytes', $models->all(), ['models' => [
    ['id' => 1, 'name' => 'first', 'link' => 'https://makerworld.com/x', 'size' => 2, 'createdAt' => 10],
    ['id' => 2, 'name' => 'second', 'link' => '', 'size' => 4, 'createdAt' => 20],
]]);
$check('file returns the bytes', $models->file(2), 'abcd');
$check('missing file is 404', $status(fn () => $models->file(9)), 404);

$store = new MemoryModelStore();
$models = new Models($store);
$data = $glb();
$added = $models->add('  Benchy  ', 'https://makerworld.com/en/models/1', $data, 1234);
$check('valid upload returns metadata', $added, [
    'id' => 1,
    'name' => 'Benchy',
    'link' => 'https://makerworld.com/en/models/1',
    'size' => strlen($data),
    'createdAt' => 1234,
]);
$check('valid upload writes once', $store->writes, 1);
$check('valid upload stores the bytes', $store->rows[1]['data'], $data);

$check('50 multibyte characters are accepted', $models->add(str_repeat('é', 50), null, $data, 1)['name'], str_repeat('é', 50));
$check('null link is stored empty', $store->rows[2]['link'], '');
$check('empty link is stored empty', $models->add('a', '', $data, 1)['link'], '');

$store = new MemoryModelStore();
$models = new Models($store);
$big = $glb();
$big = $glb(Models::MAX_SIZE + 1, 2, 'glTF', Models::MAX_SIZE + 1 - strlen($big));
$rejects = [
    'empty name' => ['', '', $glb()],
    'null name' => [null, '', $glb()],
    'whitespace-only name' => ['   ', '', $glb()],
    'name over 50 characters' => [str_repeat('a', 51), '', $glb()],
    'link with wrong prefix' => ['a', 'https://example.com/x', $glb()],
    'link with whitespace' => ['a', 'https://makerworld.com/a b', $glb()],
    'link with newline' => ['a', "https://makerworld.com/a\nb", $glb()],
    'link over 500 characters' => ['a', Models::LINK_PREFIX . str_repeat('a', 500), $glb()],
    'empty data' => ['a', '', ''],
    'wrong magic' => ['a', '', $glb(null, 2, 'glTX')],
    'wrong version' => ['a', '', $glb(null, 1)],
    'length mismatch' => ['a', '', $glb(1000)],
    'short data' => ['a', '', 'glTF'],
    'data over the maximum' => ['a', '', $big],
];
foreach ($rejects as $label => [$name, $link, $data]) {
    $check("$label is 400", $status(fn () => $models->add($name, $link, $data, 1)), 400);
}
$check('rejections write nothing', $store->writes, 0);
$check('oversize test data is really oversize', strlen($big), Models::MAX_SIZE + 1);

$store = new MemoryModelStore();
$store->rows = [3 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1]];
$models = new Models($store);
$models->remove(3);
$check('remove deletes the row', $store->rows, []);
$check('removing again is 404', $status(fn () => $models->remove(3)), 404);
$check('removing an unknown id is 404', $status(fn () => $models->remove(9)), 404);
