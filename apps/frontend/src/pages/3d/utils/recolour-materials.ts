import { hex } from '@/pages/3d/utils/colour';

const ATTRIBUTE = /(?<=\s)(displaycolor|color)=("([^"]*)"|'([^']*)')/g;
const GROUP = /<((?:[\w-]+:)?)(basematerials|colorgroup)\b([^>]*?)(?<!\/)>([\s\S]*?)<\/\1\2\s*>/g;
const ENTRY = /<(?:[\w-]+:)?(base|color)\b[^>]*?(?:\/>|>(?:\s*<\/(?:[\w-]+:)?\1\s*>)?)/g;
const TAG = /<(?:[\w-]+:)?(object|triangle)\b([^>]*?)(\/?)>/g;

type Target = { pid: string; idx: number };

export const recolourAttributes = (text: string, mapping: Record<string, string>) =>
  text.replace(ATTRIBUTE, (whole, name: string, quoted: string, double?: string, single?: string) => {
    const mapped = mapping[hex(double ?? single) ?? ''];
    return mapped ? `${name}=${quoted[0]}#${mapped.toUpperCase()}${quoted[0]}` : whole;
  });

const getAttr = (attrs: string, name: string) => {
  const match = new RegExp(`(?<=\\s)${name}=(?:"([^"]*)"|'([^']*)')`).exec(attrs);
  return match ? (match[1] ?? match[2]) : null;
};

const setAttr = (attrs: string, name: string, value: string | null) => {
  const pattern = new RegExp(`(\\s)${name}=(?:"[^"]*"|'[^']*')`);
  if (pattern.test(attrs)) return attrs.replace(pattern, value === null ? '' : `$1${name}="${value}"`);
  return value === null ? attrs : `${attrs} ${name}="${value}"`;
};

const finalColour = (entry: string, mapping: Record<string, string>) => {
  const match = /(?<=\s)(?:displaycolor|color)=(?:"([^"]*)"|'([^']*)')/.exec(entry);
  const value = match ? (match[1] ?? match[2]) : null;
  const key = hex(value);
  if (!key) return null;
  const mapped = mapping[key];
  if (mapped) return mapped.toLowerCase();
  return (value as string).trim().replace(/^#/, '').toLowerCase();
};

export const recolourMaterials = (text: string, mapping: Record<string, string>) => {
  const seen = new Map<string, Target>();
  const remap = new Map<string, Target>();
  const kept: boolean[][] = [];
  let merged = false;
  for (const group of text.matchAll(GROUP)) {
    const pid = getAttr(group[3], 'id') ?? '';
    const flags: boolean[] = [];
    let count = 0;
    let entryNo = 0;
    for (const entry of group[4].matchAll(ENTRY)) {
      const colour = finalColour(entry[0], mapping) ?? `\0${pid}:${entryNo}`;
      const survivor = seen.get(colour);
      if (survivor) {
        remap.set(`${pid}:${entryNo}`, survivor);
        flags.push(false);
        merged = true;
      } else {
        const target = { pid, idx: count++ };
        seen.set(colour, target);
        remap.set(`${pid}:${entryNo}`, target);
        flags.push(true);
      }
      entryNo++;
    }
    kept.push(flags);
  }
  if (!merged) return recolourAttributes(text, mapping);

  let groupNo = 0;
  let next = text.replace(GROUP, (whole, prefix: string, name: string, attrs: string, inner: string) => {
    const flags = kept[groupNo++];
    if (!flags.some(Boolean)) return flags.length ? '' : whole;
    let entryNo = 0;
    const body = inner.replace(ENTRY, (entry) => (flags[entryNo++] ? entry : ''));
    return `<${prefix}${name}${attrs}>${body}</${prefix}${name}>`;
  });

  let objectPid: string | null = null;
  let objectNew: string | null = null;
  next = next.replace(TAG, (whole, kind: string, attrs: string, close: string) => {
    const open = whole.slice(0, whole.indexOf(kind) + kind.length);
    if (kind === 'object') {
      objectPid = getAttr(attrs, 'pid');
      objectNew = objectPid;
      const target = remap.get(`${objectPid}:${getAttr(attrs, 'pindex') ?? 0}`);
      if (!objectPid || !target) return whole;
      objectNew = target.pid;
      let out = setAttr(attrs, 'pid', target.pid);
      out = setAttr(out, 'pindex', String(target.idx));
      return `${open}${out}${close}>`;
    }
    const p1 = getAttr(attrs, 'p1');
    if (p1 === null) return whole;
    const own = getAttr(attrs, 'pid');
    const pid = own ?? objectPid;
    const first = remap.get(`${pid}:${p1}`);
    if (!first) return whole;
    let out = setAttr(attrs, 'p1', String(first.idx));
    for (const name of ['p2', 'p3']) {
      const value = getAttr(attrs, name);
      if (value === null) continue;
      const target = remap.get(`${pid}:${value}`);
      out = setAttr(out, name, target && target.pid === first.pid ? String(target.idx) : null);
    }
    if (own !== null || first.pid !== objectNew) out = setAttr(out, 'pid', first.pid);
    return `${open}${out}${close}>`;
  });
  return recolourAttributes(next, mapping);
};
