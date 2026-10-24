export type XmlNode = { name: string; attrs: Record<string, string>; children: XmlNode[] };

const TAG =
  /<(?:!--[\s\S]*?-->|\?[\s\S]*?\?>|!\[CDATA\[[\s\S]*?]]>|!DOCTYPE[^>]*>|\/([^\s>]+)\s*>|([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>)/y;
const ATTR = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const ENTITY = /&(?:#x([0-9a-f]+)|#(\d+)|(lt|gt|amp|quot|apos));/gi;
const NAMED: Record<string, string> = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };

const local = (name: string) => name.slice(name.indexOf(':') + 1);

const codePoint = (code: number) => {
  if (code > 0x10ffff) throw new Error('Invalid XML');
  return String.fromCodePoint(code);
};

const decode = (value: string) =>
  value.includes('&')
    ? value.replace(ENTITY, (_, hexCode, decimal, named) =>
        named
          ? NAMED[named.toLowerCase()]
          : codePoint(parseInt(hexCode ?? decimal, hexCode ? 16 : 10)),
      )
    : value;

export const parseXml = (text: string): XmlNode => {
  const stack: XmlNode[] = [];
  let root: XmlNode | null = null;
  let pos = 0;
  while (true) {
    const lt = text.indexOf('<', pos);
    if (lt < 0) break;
    TAG.lastIndex = lt;
    const match = TAG.exec(text);
    if (!match) throw new Error('Invalid XML');
    pos = TAG.lastIndex;
    const [, closing, name, attrText, selfClosing] = match;
    if (closing !== undefined) {
      if (stack.pop()?.name !== local(closing)) throw new Error('Invalid XML');
    } else if (name !== undefined) {
      if (!stack.length && root) throw new Error('Invalid XML');
      const attrs: Record<string, string> = {};
      for (const [, key, double, single] of attrText.matchAll(ATTR)) {
        attrs[local(key)] = decode(double ?? single);
      }
      const node: XmlNode = { name: local(name), attrs, children: [] };
      if (stack.length) stack[stack.length - 1].children.push(node);
      else root = node;
      if (!selfClosing) stack.push(node);
    }
  }
  if (!root || stack.length) throw new Error('Invalid XML');
  return root;
};
