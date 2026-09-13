export const createWorklet = (fn: any) => fn;
export const runOnJS = (fn: any) => fn;
export const runOnUI = (fn: any) => fn;
export const isWorklet = () => false;
export const isShareable = () => true;
export const worklet = (fn: any) => fn;
export const createShareable = (v: any) => v;
export const createSerializable = (v: any) => v;
export const makeMutable = (v: any) => ({ value: v });
export const shareableMapping = new WeakMap();
export const serializableMappingCache = new WeakMap();
export const NativeWorklets = {
  loadUnpackersWithCode: () => {},
  installUnpackers: () => {},
};

export default {
  createWorklet,
  runOnJS,
  runOnUI,
  isWorklet,
  isShareable,
  worklet,
  createShareable,
  createSerializable,
  makeMutable,
  shareableMapping,
  serializableMappingCache,
  NativeWorklets,
};
