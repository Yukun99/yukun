import rewrite from '@/pages/3d/utils/rewrite';
import { strFromU8 } from 'three/examples/jsm/libs/fflate.module.js';

type Files = Record<string, Uint8Array<ArrayBuffer>>;

const DEFAULT_MODEL = '3D/3dmodel.model';
const SETTINGS = 'Metadata/model_settings.config';
const BUILD = /(<build\b[^>]*>)([\s\S]*?)(<\/build\s*>)/;
const OBJECT = /<object\b[^>]*?(?:\/>|>[\s\S]*?<\/object\s*>)/g;
const COMPONENT = /<(?:[\w-]+:)?component\b[^>]*>/g;
const REFERENCE = /<(?:[\w-]+:)?(?:component|item)\b[^>]*>/g;
const RELATIONSHIP = /<Relationship\b[^>]*>/g;

const strip = (path: string) => path.replace(/^\/+/, '');

const attr = (tag: string, name: string) => {
  const match = new RegExp(`\\s(?:[\\w-]+:)?${name}=(?:"([^"]*)"|'([^']*)')`).exec(tag);
  return match ? (match[1] ?? match[2]) : null;
};

const meta = (block: string, key: string) => {
  const pattern = `<metadata\\s+key=(["'])${key}\\1\\s+value=(?:"([^"]*)"|'([^']*)')`;
  const match = new RegExp(pattern).exec(block);
  return match ? (match[2] ?? match[3]) : null;
};

// whole elements, with their indentation and line break, are handed to edit; '' deletes one
const blocks = (text: string, tag: string, edit: (block: string, open: string) => string) =>
  text.replace(
    new RegExp(`[ \\t]*<${tag}\\b[^>]*?(?:/>|>[\\s\\S]*?</${tag}\\s*>)[ \\t]*(?:\\r?\\n)?`, 'g'),
    (block) => edit(block, /<[^>]*>/.exec(block)?.[0] ?? ''),
  );

const reach = (seeds: Iterable<string>, graph: Map<string, string[]>) => {
  const found = new Set<string>();
  const queue = [...seeds];
  for (let id = queue.pop(); id !== undefined; id = queue.pop()) {
    if (found.has(id)) continue;
    found.add(id);
    queue.push(...(graph.get(id) ?? []));
  }
  return found;
};

const objectGraph = (text: string) =>
  new Map(
    [...text.matchAll(OBJECT)].map(([block]) => [
      attr(/<[^>]*>/.exec(block)?.[0] ?? '', 'id') ?? '',
      [...block.matchAll(COMPONENT)]
        .filter(([tag]) => attr(tag, 'path') === null)
        .map(([tag]) => attr(tag, 'objectid') ?? ''),
    ]),
  );

const rootOf = (files: Files) => {
  const rels = files['_rels/.rels'];
  if (!rels) return DEFAULT_MODEL;
  for (const [tag] of strFromU8(rels).matchAll(RELATIONSHIP)) {
    const target = attr(tag, 'Target');
    if (target && attr(tag, 'Type')?.endsWith('/3dmodel')) return strip(target);
  }
  return DEFAULT_MODEL;
};

const references = (text: string) =>
  [...text.matchAll(REFERENCE)].flatMap(([tag]) => {
    const target = attr(tag, 'path');
    return target ? [strip(target)] : [];
  });

const modelFiles = (files: Files) => {
  const cache = new Map<string, string[]>();
  const refs = (path: string) => {
    let list = cache.get(path);
    if (!list) cache.set(path, (list = references(strFromU8(files[path]))));
    return list;
  };
  return (text: string) => {
    const found = new Set<string>();
    const queue = references(text);
    for (let path = queue.pop(); path !== undefined; path = queue.pop()) {
      if (found.has(path) || !files[path]) continue;
      found.add(path);
      queue.push(...refs(path));
    }
    return found;
  };
};

export const removeItems = (files: Files, removed: number[]) => {
  const rootPath = rootOf(files);
  const rootBytes = files[rootPath];
  if (!removed.length || !rootBytes) return;
  const drop = new Set(removed);
  const text = strFromU8(rootBytes);

  const seen = new Map<string, number>();
  const kept = new Map<string, number>();
  const instance = new Map<string, number | null>();
  const before: string[] = [];
  const after: string[] = [];
  const gone = new Set<string>();
  let index = 0;
  const trimmed = text.replace(BUILD, (_, open: string, body: string, close: string) => {
    const edited = blocks(body, 'item', (block, tag) => {
      const id = attr(tag, 'objectid') ?? '';
      const old = seen.get(id) ?? 0;
      seen.set(id, old + 1);
      const local = attr(tag, 'path') === null;
      if (local) before.push(id);
      if (drop.has(index++)) {
        gone.add(id);
        instance.set(`${id}:${old}`, null);
        return '';
      }
      const now = kept.get(id) ?? 0;
      kept.set(id, now + 1);
      instance.set(`${id}:${old}`, now);
      if (local) after.push(id);
      return block;
    });
    return open + edited + close;
  });
  if (trimmed === text) return;

  const dead = new Set([...gone].filter((id) => !kept.has(id)));
  const graph = objectGraph(trimmed);
  const alive = reach(after, graph);
  const orphans = [...reach(before, graph)].filter((id) => !alive.has(id));
  const next = blocks(trimmed, 'object', (block, open) =>
    orphans.includes(attr(open, 'id') ?? '') ? '' : block,
  );
  files[rootPath] = rewrite(rootBytes, () => next);

  const settings = files[SETTINGS];
  if (settings) {
    files[SETTINGS] = rewrite(settings, (config) => {
      const renumber = (block: string, key: string, from: string, to: number | null | undefined) =>
        to === undefined || to === Number(from)
          ? block
          : to === null
            ? ''
            : block.replace(new RegExp(`(${key}\\s*=?\\s*["'])\\d+(?=["'])`), `$1${to}`);
      let out = blocks(config, 'model_instance', (block) => {
        const id = meta(block, 'object_id');
        const from = meta(block, 'instance_id') ?? '0';
        if (id === null) return block;
        const to = instance.get(`${id}:${Number(from)}`);
        return renumber(block, `instance_id["']\\s+value`, from, to);
      });
      out = blocks(out, 'assemble_item', (block, tag) => {
        const id = attr(tag, 'object_id');
        const from = attr(tag, 'instance_id');
        if (id === null) return block;
        if (from === null) return dead.has(id) ? '' : block;
        return renumber(block, 'instance_id', from, instance.get(`${id}:${Number(from)}`));
      });
      return blocks(out, 'object', (block, open) =>
        dead.has(attr(open, 'id') ?? '') ? '' : block,
      );
    });
  }

  const reachable = modelFiles(files);
  const stale = reachable(text);
  for (const path of reachable(next)) stale.delete(path);
  if (!stale.size) return;
  for (const path of stale) delete files[path];
  const slash = rootPath.lastIndexOf('/');
  const relsPath = `${rootPath.slice(0, slash + 1)}_rels/${rootPath.slice(slash + 1)}.rels`;
  const rels = files[relsPath];
  if (rels) {
    files[relsPath] = rewrite(rels, (xml) =>
      blocks(xml, 'Relationship', (block, open) =>
        stale.has(strip(attr(open, 'Target') ?? '')) ? '' : block,
      ),
    );
  }
};
