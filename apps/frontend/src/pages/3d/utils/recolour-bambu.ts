import { hex } from '@/pages/3d/utils/colour';
import { FILAMENT_KEYS } from '@/pages/3d/utils/filament-keys';

const COLOUR_KEYS = ['filament_colour', 'filament_multi_colour'];
const REFERENCE_KEYS = [
  'support_filament',
  'support_interface_filament',
  'wall_filament',
  'sparse_infill_filament',
  'solid_infill_filament',
];
// one entry for the process preset, one per filament, one for the printer preset
const PRESET_KEYS = ['different_settings_to_system', 'inherits_group'];
const MAX_BLOCK = 4;

export type BambuResult = {
  project: Record<string, unknown>;
  index: (state: number) => number;
  keep: number[];
  merged: boolean;
  changed: boolean;
};

const blocks = <T>(values: T[], size: number, keep: number[]) =>
  keep.flatMap((i) => values.slice(i * size, i * size + size));

const matrix = (values: unknown[], filaments: number, extruders: number, keep: number[]) => {
  const out: unknown[] = [];
  for (let e = 0; e < extruders; e++) {
    for (const row of keep) {
      for (const column of keep) out.push(values[e * filaments * filaments + row * filaments + column]);
    }
  }
  return out;
};

export const recolourBambu = (
  project: Record<string, unknown>,
  mapping: Record<string, string>,
): BambuResult => {
  const colours = project.filament_colour as unknown[];
  const total = colours.length;
  const extruders = Array.isArray(project.extruder_colour) ? project.extruder_colour.length || 1 : 1;
  let changed = false;
  const token = (value: string) => {
    const mapped = mapping[hex(value) ?? ''];
    if (!mapped) return value;
    changed = true;
    return `#${mapped.slice(0, 6).toUpperCase()}`;
  };
  for (const key of COLOUR_KEYS) {
    const values = project[key];
    if (!Array.isArray(values)) continue;
    project[key] = values.map((value: unknown) =>
      typeof value === 'string' ? value.split(' ').map(token).join(' ') : value,
    );
  }

  const survivors = new Map<string, number>();
  const target = (project.filament_colour as unknown[]).map((colour, i) => {
    const key = hex(colour) ?? `#${i}`;
    if (!survivors.has(key)) survivors.set(key, i);
    return survivors.get(key) as number;
  });
  const keep = [...new Set(target)];
  const position = new Map(keep.map((old, i) => [old, i]));
  const index = (state: number) =>
    state < 1 || state > total ? state : (position.get(target[state - 1]) as number) + 1;
  const merged = keep.length < total;
  if (!merged) return { project, index, keep, merged, changed };

  const self = project.filament_self_index;
  const owners = Array.isArray(self) ? self.map((value) => Number(value) - 1) : null;
  const kept = new Set(keep);
  for (const [key, value] of Object.entries(project)) {
    if (!Array.isArray(value)) continue;
    if (key === 'flush_volumes_matrix') {
      if (value.length === extruders * total * total) project[key] = matrix(value, total, extruders, keep);
    } else if (PRESET_KEYS.includes(key)) {
      if (value.length === total + 2) {
        project[key] = [value[0], ...keep.map((i) => value[i + 1]), value[total + 1]];
      }
    } else if (FILAMENT_KEYS.has(key) || key.startsWith('filament_')) {
      const size = value.length / total;
      if (!Number.isInteger(size) || size < 1 || size > MAX_BLOCK) continue;
      project[key] = owners?.length === value.length
        ? value.filter((_, i) => kept.has(owners[i]))
        : blocks(value, size, keep);
    }
  }
  if (owners && Array.isArray(project.filament_self_index)) {
    project.filament_self_index = project.filament_self_index.map((value) => String(index(Number(value))));
  }
  for (const key of REFERENCE_KEYS) {
    const value = project[key];
    if (typeof value === 'string' && /^\d+$/.test(value)) project[key] = String(index(Number(value)));
  }
  return { project, index, keep, merged, changed: true };
};

const METADATA = /(<metadata\s+key=(["'])(\w+)\2\s+value=)(?:"([^"]*)"|'([^']*)')/g;
const RANGE_OPTION = /(<option\s+opt_key=(["'])(\w+)\2\s*>)(\d+)(?=<\/option>)/g;
const LAYER_EXTRUDER = /(<layer\b[^>]*?\sextruder=["'])(\d+)(?=["'])/g;

export const recolourLayers = (text: string, index: (state: number) => number) =>
  text
    .replace(RANGE_OPTION, (whole, head: string, _q, key: string, value: string) =>
      key === 'extruder' || REFERENCE_KEYS.includes(key) ? `${head}${index(Number(value))}` : whole,
    )
    .replace(LAYER_EXTRUDER, (_, head: string, value: string) => `${head}${index(Number(value))}`);

export const recolourModelSettings = (
  text: string,
  index: (state: number) => number,
  keep: number[],
) =>
  text.replace(METADATA, (whole, head: string, _q, key: string, double?: string, single?: string) => {
    const value = double ?? (single as string);
    const quote = double === undefined ? "'" : '"';
    if (key === 'extruder' || REFERENCE_KEYS.includes(key)) {
      return /^\d+$/.test(value) ? `${head}${quote}${index(Number(value))}${quote}` : whole;
    }
    if (key === 'filament_maps') {
      const tokens = value.trim().split(/\s+/);
      return `${head}${quote}${keep.map((i) => tokens[i]).filter((t) => t !== undefined).join(' ')}${quote}`;
    }
    return whole;
  });
