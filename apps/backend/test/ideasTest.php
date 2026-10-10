<?php

declare(strict_types=1);

use Yukun\Api\ApiError;
use Yukun\Api\Ideas;

$blank = ['title' => '', 'content' => ''];
$grid = fn (int $count): array => ['ideas' => array_fill(0, $count, ['title' => 'a', 'content' => 'b'])];

/** Status of the ApiError thrown by `$run`, or null when nothing was thrown. */
$status = function (callable $run): ?int {
    try {
        $run();
    } catch (ApiError $error) {
        return $error->status;
    }
    return null;
};

$store = new MemoryIdeaStore();
$all = (new Ideas($store))->all()['ideas'];
$check('empty store gives 24 slots', count($all), 24);
$check('empty slots are blank', $all[0], $blank);

$store = new MemoryIdeaStore();
$store->rows = [0 => ['title' => 'first', 'content' => 'one'], 5 => ['title' => 'sixth', 'content' => 'two']];
$all = (new Ideas($store))->all()['ideas'];
$check('stored slots keep 24 slots', count($all), 24);
$check('slot 0 laid out', $all[0], ['title' => 'first', 'content' => 'one']);
$check('slot 5 laid out', $all[5], ['title' => 'sixth', 'content' => 'two']);
$check('gap slot is blank', $all[3], $blank);

$store = new MemoryIdeaStore();
$store->rows = [24 => ['title' => 'late', 'content' => 'x']];
$all = (new Ideas($store))->all()['ideas'];
$check('25 slots pad to 30', count($all), 30);
$check('padding is blank', $all[29], $blank);

$store = new MemoryIdeaStore();
$ideas = new Ideas($store);
$saved = $ideas->replace($grid(24), 1000);
$check('replace returns the grid', $saved, $ideas->all());
$check('replace keeps 24 slots', count($saved['ideas']), 24);
$check('replace stores content', $store->rows[23], ['title' => 'a', 'content' => 'b']);
$check('replace writes once', $store->writes, 1);

$check('grid can grow', count($ideas->replace($grid(30), 1001)['ideas']), 30);
$check('grid can reach the maximum', count($ideas->replace($grid(396), 1002)['ideas']), 396);

$rejects = [
    'non-array body' => 'nope',
    'null body' => null,
    'missing ideas' => ['other' => []],
    'ideas not a list' => ['ideas' => ['a' => $blank]],
    'idea without title' => ['ideas' => array_merge(array_fill(0, 23, $blank), [['content' => 'x']])],
    'idea with non-string content' => ['ideas' => array_merge(array_fill(0, 23, $blank), [['title' => 'x', 'content' => 1]])],
    'idea not an array' => ['ideas' => array_merge(array_fill(0, 23, $blank), ['text'])],
    '18 slots' => $grid(18),
    '26 slots' => $grid(26),
    '402 slots' => $grid(402),
    'title over 50 chars' => ['ideas' => array_merge(array_fill(0, 23, $blank), [['title' => str_repeat('t', 51), 'content' => '']])],
    'content over 5000 chars' => ['ideas' => array_merge(array_fill(0, 23, $blank), [['title' => '', 'content' => str_repeat('c', 5001)]])],
];
foreach ($rejects as $label => $body) {
    $fresh = new MemoryIdeaStore();
    $check("rejects $label", $status(fn () => (new Ideas($fresh))->replace($body, 1)), 400);
    $check("rejects $label without writing", $fresh->writes, 0);
}

$store = new MemoryIdeaStore();
$store->rows = [29 => ['title' => 'x', 'content' => 'y']];
$check('rejects shrinking below stored count', $status(fn () => (new Ideas($store))->replace($grid(24), 1)), 400);

$store = new MemoryIdeaStore();
$edge = ['ideas' => array_merge(array_fill(0, 23, $blank), [['title' => str_repeat('é', 50), 'content' => str_repeat('c', 5000)]])];
$check('accepts limits in characters', count((new Ideas($store))->replace($edge, 1)['ideas']), 24);

$store = new MemoryIdeaStore();
$body = ['ideas' => array_merge([['title' => "  padded \n", 'content' => "  keep \n"]], array_fill(0, 23, $blank))];
$saved = (new Ideas($store))->replace($body, 1)['ideas'][0];
$check('title is trimmed', $saved['title'], 'padded');
$check('content is kept as is', $saved['content'], "  keep \n");
