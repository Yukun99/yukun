import { applyColour, collectColours } from '@/pages/3d/utils/colours';
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

const red = new MeshStandardMaterial({ color: '#ff0000' });
const blue = new MeshStandardMaterial({ color: '#0000ff' });
const otherRed = new MeshStandardMaterial({ color: '#ff0000' });

const plate = () => {
  const group = new Group();
  group.add(new Mesh(new BufferGeometry(), [red, blue]));
  group.add(new Mesh(new BufferGeometry(), red));
  group.add(new Mesh(new BufferGeometry(), otherRed));
  return group;
};

describe('collectColours', () => {
  it('should group distinct materials by hex in insertion order', () => {
    const colours = collectColours([plate()]);
    expect([...colours.keys()]).toEqual(['ff0000', '0000ff']);
    expect(colours.get('ff0000')?.map(({ material }) => material)).toEqual([red, otherRed]);
    expect(colours.get('0000ff')?.map(({ material }) => material)).toEqual([blue]);
  });

  it('should return nothing for no plates', () => {
    expect(collectColours([]).size).toBe(0);
  });
});

describe('applyColour', () => {
  it('should set colour and opacity then restore the exact original', () => {
    const material = new MeshStandardMaterial({ color: '#ff0000' });
    const original = material.color.clone();
    const [entries] = collectColours([new Mesh(new BufferGeometry(), material)]).values();
    const version = material.version;

    applyColour(entries, { r: 0, g: 255, b: 0, a: 128 });
    expect(material.color.getHexString()).toBe('00ff00');
    expect(material.opacity).toBeCloseTo(128 / 255);
    expect(material.transparent).toBe(true);
    expect(material.version).toBe(version + 1);

    applyColour(entries, { r: 0, g: 0, b: 255, a: 200 });
    expect(material.version).toBe(version + 1);

    applyColour(entries, { r: 0, g: 0, b: 255, a: 255 });
    expect(material.transparent).toBe(false);

    applyColour(entries, null);
    expect(material.color.equals(original)).toBe(true);
    expect(material.opacity).toBe(1);
    expect(material.transparent).toBe(false);
  });
});
