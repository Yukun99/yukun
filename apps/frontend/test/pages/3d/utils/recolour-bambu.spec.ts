import { FILAMENT_KEYS } from '@/pages/3d/utils/filament-keys';
import { recolourBambu, recolourLayers, recolourModelSettings } from '@/pages/3d/utils/recolour-bambu';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';

const el = (name: string, attrs: string, inner?: string) =>
  inner === undefined ? `<${name} ${attrs}/>` : `<${name} ${attrs}>${inner}</${name}>`;

const benchy = () =>
  unzipSync(
    new Uint8Array(readFileSync(resolve(__dirname, '../../../../src/assets/catalog/benchy-colour.3mf'))),
  );

const synthetic = () => ({
  filament_colour: ['#111111', '#222222', '#111111'],
  filament_multi_colour: ['#111111', '#222222', '#111111'],
  extruder_colour: ['#000000', '#000000'],
  filament_type: ['a', 'b', 'c'],
  filament_flow_ratio: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'],
  filament_cooling: ['1', '2', '3'],
  nozzle_temperature: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'],
  retraction_speed: ['a', 'b', 'c'],
  volumetric_speed_coefficients: Array.from({ length: 12 }, (_, i) => `v${i}`),
  flush_volumes_matrix: Array.from({ length: 18 }, (_, i) => `${Math.floor(i / 9)}:${Math.floor((i % 9) / 3)}${i % 3}`),
  flush_volumes_vector: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'],
  filament_self_index: ['1', '1', '2', '2', '3', '3'],
  unrelated_list: ['x', 'y', 'z'],
  different_settings_to_system: ['print', 'f1', 'f2', 'f3', 'printer'],
  inherits_group: ['p', 'g1', 'g2', 'g3', 'm'],
  support_filament: '3',
  wall_filament: '0',
});

describe('recolourBambu', () => {
  it('should leave arrays alone when nothing merges', () => {
    const project = { filament_colour: ['#111111', '#222222'], filament_type: ['a', 'b'] };
    const result = recolourBambu(structuredClone(project), {});
    expect(result.merged).toBe(false);
    expect(result.changed).toBe(false);
    expect(result.project).toEqual(project);
  });

  it('should compact every per filament array and renumber references', () => {
    const { project, keep, merged, index } = recolourBambu(synthetic(), {});
    expect(merged).toBe(true);
    expect(keep).toEqual([0, 1]);
    expect(project).toMatchObject({
      filament_colour: ['#111111', '#222222'],
      filament_multi_colour: ['#111111', '#222222'],
      extruder_colour: ['#000000', '#000000'],
      filament_type: ['a', 'b'],
      filament_flow_ratio: ['a1', 'a2', 'b1', 'b2'],
      filament_cooling: ['1', '2'],
      nozzle_temperature: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3'],
      retraction_speed: ['a', 'b', 'c'],
      volumetric_speed_coefficients: ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'],
      flush_volumes_vector: ['a1', 'a2', 'b1', 'b2'],
      filament_self_index: ['1', '1', '2', '2'],
      unrelated_list: ['x', 'y', 'z'],
      support_filament: '1',
      wall_filament: '0',
    });
    expect([index(0), index(1), index(2), index(3), index(9)]).toEqual([0, 1, 2, 1, 9]);
  });

  it('should keep matching rows and columns of every flush matrix block', () => {
    const { project } = recolourBambu(synthetic(), {});
    expect(project.flush_volumes_matrix).toEqual(['0:00', '0:01', '0:10', '0:11', '1:00', '1:01', '1:10', '1:11']);
  });

  it('should keep the process and printer entries of the preset lists in place', () => {
    const { project } = recolourBambu(synthetic(), {});
    expect(project.different_settings_to_system).toEqual(['print', 'f1', 'f2', 'printer']);
    expect(project.inherits_group).toEqual(['p', 'g1', 'g2', 'm']);
  });

  it('should merge colours that the mapping makes equal', () => {
    const { keep, project } = recolourBambu(synthetic(), { '222222': '111111ff' });
    expect(keep).toEqual([0]);
    expect(project.filament_colour).toEqual(['#111111']);
    expect(project.flush_volumes_matrix).toEqual(['0:00', '1:00']);
  });

  it('should shrink exactly the per filament arrays of a real file', () => {
    const project = JSON.parse(strFromU8(benchy()['Metadata/project_settings.config']));
    const before = Object.fromEntries(
      Object.entries(project).map(([key, value]) => [key, Array.isArray(value) ? value.length : -1]),
    );
    const { project: next, merged } = recolourBambu(structuredClone(project), { c12e1f: 'ff6a13' });
    expect(merged).toBe(true);
    expect(next.flush_volumes_matrix).toHaveLength(2 * 36);
    expect(next.filament_colour).toHaveLength(6);
    for (const key of ['printer_extruder_variant', 'print_extruder_id', 'retraction_length', 'outer_wall_speed', 'nozzle_volume']) {
      expect(next[key]).toEqual(project[key]);
    }
    expect(next.filament_settings_id).toHaveLength(6);
    expect(next.filament_self_index).toEqual(['1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4', '5', '5', '5', '6', '6', '6']);
    expect(next.nozzle_temperature).toHaveLength(18);
    expect(next.flush_volumes_vector).toHaveLength(12);
    expect(next.different_settings_to_system).toHaveLength(8);
    expect(next.inherits_group).toHaveLength(8);
    for (const [key, length] of Object.entries(before)) {
      const value = (next as Record<string, unknown>)[key];
      const length7 = length > 0 && length % 7 === 0 && length / 7 <= 4;
      const preset = key === 'different_settings_to_system' || key === 'inherits_group';
      const shrinks =
        key === 'flush_volumes_matrix'
        || preset
        || (length7 && (FILAMENT_KEYS.has(key) || key.startsWith('filament_')));
      if (length < 0) expect(Array.isArray(value)).toBe(false);
      else if (shrinks) {
        const expected = key === 'flush_volumes_matrix' ? 72 : preset ? 8 : (length / 7) * 6;
        expect((value as unknown[]).length).toBe(expected);
      }
      else expect((value as unknown[]).length).toBe(length);
    }
  });
});

describe('recolourModelSettings', () => {
  const index = (state: number) => (state === 7 ? 6 : state === 2 ? 1 : state);
  const text =
    '<?xml version="1.0" encoding="UTF-8"?><config><object id="1"><metadata key="extruder" value="2"/>'
    + '<part id="1"><metadata key=\'extruder\' value=\'7\'/><metadata key="name" value="7"/></part></object>'
    + '<plate><metadata key="filament_maps" value="1 2 1"/></plate></config>';

  it('should remap extruders and drop merged filament map entries', () => {
    expect(recolourModelSettings(text, index, [0, 1])).toBe(
      text
        .replace('key="extruder" value="2"', 'key="extruder" value="1"')
        .replace("value='7'", "value='6'")
        .replace('value="1 2 1"', 'value="1 2"'),
    );
  });

  it('should keep a value that holds the other quote', () => {
    const quoted = el('metadata', `key="name" value="it's"`) + el('metadata', 'key="extruder" value="7"');
    expect(recolourModelSettings(quoted, index, [0])).toBe(quoted.replace('"7"', '"6"'));
  });

  it('should keep the real file byte for byte when nothing moves', () => {
    const real = strFromU8(benchy()['Metadata/model_settings.config']);
    expect(recolourModelSettings(real, (state) => state, [0, 1, 2, 3, 4, 5, 6])).toBe(real);
  });

  it('should drop the right entries of the real file filament map', () => {
    const real = strFromU8(benchy()['Metadata/model_settings.config']);
    expect(recolourModelSettings(real, (state) => state, [0, 1, 2, 3, 4, 6])).toContain(
      'key="filament_maps" value="1 1 1 1 1 1"',
    );
  });
});

describe('recolourLayers', () => {
  it('should renumber layer range extruders and per layer filament changes', () => {
    const index = (state: number) => (state === 3 ? 1 : state);
    const ranges = el(
      'range',
      'min_z="0" max_z="2"',
      el('option', 'opt_key="extruder"', '3') + el('option', 'opt_key="layer_height"', '3'),
    );
    expect(recolourLayers(ranges, index)).toBe(ranges.replace('extruder">3', 'extruder">1'));
    const layers = '<layer top_z="1" type="2" extruder="3" color="#FF0000"/><plate_info id="3"/>';
    expect(recolourLayers(layers, index)).toBe(layers.replace('extruder="3"', 'extruder="1"'));
  });
});
