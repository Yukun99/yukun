import { parseXml } from '@/pages/3d/utils/xml';

describe('parseXml', () => {
  it('should read nested elements and both quote styles', () => {
    const root = parseXml(`<node x="1"><item y='two' z="3"/><list><leaf/></list></node>`);
    expect(root.name).toBe('node');
    expect(root.attrs).toEqual({ x: '1' });
    expect(root.children.map((child) => child.name)).toEqual(['item', 'list']);
    expect(root.children[0].attrs).toEqual({ y: 'two', z: '3' });
    expect(root.children[1].children[0].name).toBe('leaf');
  });

  it('should drop namespace prefixes from names', () => {
    const root = parseXml('<m:model><m:item p:path="/a"/></m:model>');
    expect(root.name).toBe('model');
    expect(root.children[0].name).toBe('item');
    expect(root.children[0].attrs.path).toBe('/a');
  });

  it('should decode entities in attribute values', () => {
    const root = parseXml('<node v="&amp;&quot;&#65;&#x41;&lt;&gt;&apos;"/>');
    expect(root.attrs.v).toBe('&"AA<>\'');
  });

  it('should skip the prolog and comments', () => {
    const root = parseXml('<?xml version="1.0"?>\n<!-- hi -->\n<node><!-- <item/> --><leaf/></node>\n');
    expect(root.children.map((child) => child.name)).toEqual(['leaf']);
  });

  it('should allow a byte order mark and > inside attribute values', () => {
    const root = parseXml('﻿<node v="1 > 0"><!-- a -- b --><item/></node>');
    expect(root.attrs.v).toBe('1 > 0');
    expect(root.children.map((child) => child.name)).toEqual(['item']);
  });

  it('should read tags that span lines', () => {
    const root = parseXml('<node\n  x="1"\n  y = "2"\n/>');
    expect(root.attrs).toEqual({ x: '1', y: '2' });
  });

  it.each([
    ['a mismatched end tag', '<node><item></node></item>'],
    ['an unclosed tag', '<node><item></item>'],
    ['a missing root', '<!-- nothing -->'],
    ['a second root', '<node/><item/>'],
    ['a bad attribute', '<node x=1/>'],
    ['an out of range character reference', '<node v="&#x110000;"/>'],
  ])('should throw on %s', (_label, text) => {
    expect(() => parseXml(text)).toThrow('Invalid XML');
  });
});
