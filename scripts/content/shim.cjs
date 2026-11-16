// Lets plain Node (tsx) import lesson data modules that reach react-native / expo / async-storage.
const Module = require('module');
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '../..');
const stubDir = path.join(__dirname, '.stubs');
fs.mkdirSync(stubDir, { recursive: true });
const write = (name, body) => { const file = path.join(stubDir, name); fs.writeFileSync(file, body); return file; };
const rn = write('react-native.cjs', "module.exports = { Platform: { OS: 'node', select: v => v.default ?? v.native }, StyleSheet: { create: s => s }, Dimensions: { get: () => ({ width: 390, height: 844 }) }, I18nManager: {} };");
const empty = write('empty.cjs', 'module.exports = new Proxy({}, { get: () => () => undefined });');
const storage = write('storage.cjs', 'const s = { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} }; module.exports = Object.assign(s, { default: s, __esModule: true });');
global.__DEV__ = false;
const original = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request === 'react-native') return rn;
  if (request === '@react-native-async-storage/async-storage') return storage;
  if (/^expo(-|$)|^@expo\//.test(request)) return empty;
  if (/(^|\/)supabase$/.test(request) && !request.includes('node_modules')) return empty;
  if (request.startsWith('@/')) request = path.join(root, request.slice(2));
  return original.call(this, request, parent, ...rest);
};
