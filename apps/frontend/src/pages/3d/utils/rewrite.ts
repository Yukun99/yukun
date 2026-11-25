import { strFromU8, strToU8 } from 'three/examples/jsm/libs/fflate.module.js';

const rewrite = (bytes: Uint8Array<ArrayBuffer>, edit: (text: string) => string) => {
  const text = strFromU8(bytes);
  const next = edit(text);
  return next === text ? bytes : new Uint8Array(strToU8(next));
};

export default rewrite;
