import { type Object3D, Scene } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// one glTF scene per plate; an array of Scene objects is exported as separate scenes
export const toGlb = (plates: Object3D[]): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const scenes = plates.map((plate) => new Scene().add(plate));
    new GLTFExporter().parse(
      scenes,
      (result) => (result instanceof ArrayBuffer ? resolve(result) : reject(new Error('Not binary'))),
      reject,
      { binary: true },
    );
  });
