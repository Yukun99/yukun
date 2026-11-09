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

/** A minimal PNG header with the given size; the chunk CRC is not checked by the server. */
$png = function (int $width = 256, int $height = 256, string $signature = "\x89PNG\r\n\x1a\n", string $chunk = 'IHDR'): string {
    return $signature . pack('N', 13) . $chunk . pack('NN', $width, $height) . "\x08\x06\x00\x00\x00" . pack('N', 0);
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
    2 => ['name' => 'second', 'link' => '', 'data' => 'abcd', 'createdAt' => 20, 'thumbnail' => 'png'],
    1 => ['name' => 'first', 'link' => 'https://makerworld.com/x', 'data' => 'ab', 'createdAt' => 10],
];
$models = new Models($store);
$check('list is ordered and has no bytes', $models->all(), ['models' => [
    ['id' => 1, 'name' => 'first', 'link' => 'https://makerworld.com/x', 'size' => 2, 'createdAt' => 10, 'updatedAt' => 10, 'thumbnail' => false, 'source' => false],
    ['id' => 2, 'name' => 'second', 'link' => '', 'size' => 4, 'createdAt' => 20, 'updatedAt' => 20, 'thumbnail' => true, 'source' => false],
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
    'updatedAt' => 1234,
    'thumbnail' => false,
    'source' => false,
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

$store = new MemoryModelStore();
$store->rows = [
    1 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1],
    2 => ['name' => 'b', 'link' => '', 'data' => 'y', 'createdAt' => 2],
];
$models = new Models($store);
$image = $png();
$models->addThumbnail(1, $image);
$check('thumbnail is stored', $store->rows[1]['thumbnail'], $image);
$check('thumbnail is returned', $models->thumbnail(1), $image);
$check('list flags the thumbnail', array_column($models->all()['models'], 'thumbnail'), [true, false]);
$check('thumbnail of an unknown id is 404', $status(fn () => $models->thumbnail(9)), 404);
$check('thumbnail of a model without one is 404', $status(fn () => $models->thumbnail(2)), 404);
$check('the maximum size is accepted', $status(fn () => $models->addThumbnail(2, $png(Models::MAX_THUMBNAIL_PX, 1))), null);

$store = new MemoryModelStore();
$store->rows = [1 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1]];
$models = new Models($store);
$thumbnailRejects = [
    'empty thumbnail' => '',
    'thumbnail over 1 MiB' => $png() . str_repeat('a', Models::MAX_THUMBNAIL),
    'thumbnail with a wrong signature' => $png(256, 256, "\x89PNX\r\n\x1a\n"),
    'thumbnail without IHDR' => $png(256, 256, "\x89PNG\r\n\x1a\n", 'IDAT'),
    'truncated thumbnail' => "\x89PNG\r\n\x1a\n",
    'thumbnail 1025 pixels wide' => $png(Models::MAX_THUMBNAIL_PX + 1, 10),
    'thumbnail 0 pixels high' => $png(10, 0),
];
foreach ($thumbnailRejects as $label => $bytes) {
    $check("$label is 400", $status(fn () => $models->addThumbnail(1, $bytes)), 400);
}
$check('thumbnail rejections write nothing', $store->writes, 0);
$models->addThumbnail(1, $png());
$check('second thumbnail is 409', $status(fn () => $models->addThumbnail(1, $png())), 409);
$check('thumbnail for an unknown id is 404', $status(fn () => $models->addThumbnail(9, $png())), 404);
$check('conflicting thumbnail changes nothing', $store->writes, 1);

$store = new MemoryModelStore();
$store->rows = [
    1 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1],
    2 => ['name' => 'b', 'link' => '', 'data' => 'y', 'createdAt' => 2],
];
$models = new Models($store);
$archive = "PK\x03\x04" . str_repeat('a', 20);
$models->addSource(1, $archive);
$check('source is stored', $store->rows[1]['source'], $archive);
$check('source is returned', $models->source(1), $archive);
$check('list flags the source', array_column($models->all()['models'], 'source'), [true, false]);
$check('source of an unknown id is 404', $status(fn () => $models->source(9)), 404);
$check('source of a model without one is 404', $status(fn () => $models->source(2)), 404);
$check('the maximum source size is accepted', $status(fn () => $models->addSource(2, "PK\x03\x04" . str_repeat('a', Models::MAX_SOURCE - 4))), null);

$store = new MemoryModelStore();
$store->rows = [1 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1]];
$models = new Models($store);
$sourceRejects = [
    'empty source' => '',
    'source over 16 MiB' => "PK\x03\x04" . str_repeat('a', Models::MAX_SOURCE),
    'source with a wrong signature' => "PK\x03\x05" . str_repeat('a', 20),
    'source that is not a zip' => 'glTF' . str_repeat('a', 20),
];
foreach ($sourceRejects as $label => $bytes) {
    $check("$label is 400", $status(fn () => $models->addSource(1, $bytes)), 400);
}
$check('source rejections write nothing', $store->writes, 0);
$models->addSource(1, $archive);
$check('second source is 409', $status(fn () => $models->addSource(1, $archive)), 409);
$check('source for an unknown id is 404', $status(fn () => $models->addSource(9, $archive)), 404);
$check('conflicting source changes nothing', $store->writes, 1);

$store = new MemoryModelStore();
$store->rows = [
    1 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1],
    2 => ['name' => 'b', 'link' => '', 'data' => 'y', 'createdAt' => 2],
];
$models = new Models($store);
$updated = $models->update(1, ['name' => '  New  ', 'link' => 'https://makerworld.com/en/models/2'], 500);
$check('update returns the metadata', $updated, [
    'id' => 1,
    'name' => 'New',
    'link' => 'https://makerworld.com/en/models/2',
    'size' => 1,
    'createdAt' => 1,
    'updatedAt' => 500,
    'thumbnail' => false,
    'source' => false,
]);
$check('update stores name and link', [$store->rows[1]['name'], $store->rows[1]['link']], ['New', 'https://makerworld.com/en/models/2']);
$check('update bumps updatedAt', $store->rows[1]['updatedAt'], 500);
$check('update leaves other models alone', $store->rows[2]['name'], 'b');
$check('update with an empty link clears it', $models->update(1, ['name' => 'New', 'link' => ''], 600)['link'], '');
$check('update with a missing link clears it', $models->update(1, ['name' => 'New'], 700)['link'], '');

$store->writes = 0;
$updateRejects = [
    'non-array body' => null,
    'string body' => 'name',
    'empty name' => ['name' => ''],
    'missing name' => ['link' => ''],
    'name over 50 characters' => ['name' => str_repeat('a', 51)],
    'link with wrong prefix' => ['name' => 'a', 'link' => 'https://example.com/x'],
    'link with whitespace' => ['name' => 'a', 'link' => 'https://makerworld.com/a b'],
    'non-string name' => ['name' => 5],
    'non-string link' => ['name' => 'a', 'link' => ['x']],
];
foreach ($updateRejects as $label => $body) {
    $check("update with $label is 400", $status(fn () => $models->update(1, $body, 800)), 400);
}
$check('update rejections write nothing', $store->writes, 0);
$check('update of an unknown id is 404', $status(fn () => $models->update(9, ['name' => 'a'], 800)), 404);

$store = new MemoryModelStore();
$store->rows = [1 => ['name' => 'a', 'link' => '', 'data' => 'x', 'createdAt' => 1, 'thumbnail' => 'png', 'source' => 'zip']];
$models = new Models($store);
$data = $glb();
$replaced = $models->replaceFile(1, $data, 900);
$check('replaceFile returns the metadata', $replaced, [
    'id' => 1,
    'name' => 'a',
    'link' => '',
    'size' => strlen($data),
    'createdAt' => 1,
    'updatedAt' => 900,
    'thumbnail' => false,
    'source' => false,
]);
$check('replaceFile stores the new bytes', $store->rows[1]['data'], $data);
$check('replaceFile clears the thumbnail and source', [isset($store->rows[1]['thumbnail']), isset($store->rows[1]['source'])], [false, false]);
$check('replaceFile bumps updatedAt', $store->rows[1]['updatedAt'], 900);
$check('replaceFile writes once', $store->writes, 1);
$store->writes = 0;
$check('replaceFile rejects a non-GLB with 400', $status(fn () => $models->replaceFile(1, 'not a glb', 1000)), 400);
$check('replaceFile rejects an empty file with 400', $status(fn () => $models->replaceFile(1, '', 1000)), 400);
$check('replaceFile rejections write nothing', $store->writes, 0);
$check('replaceFile of an unknown id is 404', $status(fn () => $models->replaceFile(9, $data, 1000)), 404);
$models->addThumbnail(1, $png());
$models->addSource(1, "PK\x03\x04" . str_repeat('a', 20));
$check('thumbnail and source can be set again after a replace', $models->all()['models'][0]['thumbnail'] && $models->all()['models'][0]['source'], true);
