import type { Rgba } from '@/pages/3d/utils/colour';
import { type Color, type Material, Mesh, type Object3D, SRGBColorSpace } from 'three';

type Coloured = Material & { color: Color };
export type ColourEntry = {
  material: Coloured;
  color: Color;
  opacity: number;
  transparent: boolean;
};

const hasColour = (material: Material): material is Coloured => 'color' in material;

export const collectColours = (plates: Object3D[]) => {
  const colours = new Map<string, ColourEntry[]>();
  const seen = new Set<Material>();
  for (const plate of plates) {
    plate.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      for (const material of [child.material].flat()) {
        if (seen.has(material) || !hasColour(material)) continue;
        seen.add(material);
        const key = material.color.getHexString();
        const entry = {
          material,
          color: material.color.clone(),
          opacity: material.opacity,
          transparent: material.transparent,
        };
        colours.set(key, [...(colours.get(key) ?? []), entry]);
      }
    });
  }
  return colours;
};

export const applyColour = (entries: ColourEntry[], rgba: Rgba | null) => {
  for (const { material, color, opacity, transparent } of entries) {
    if (rgba) {
      material.color.setRGB(rgba.r / 255, rgba.g / 255, rgba.b / 255, SRGBColorSpace);
      material.opacity = rgba.a / 255;
    } else {
      material.color.copy(color);
      material.opacity = opacity;
    }
    const next = rgba ? rgba.a < 255 : transparent;
    if (material.transparent !== next) {
      material.transparent = next;
      material.needsUpdate = true;
    }
  }
};
