#!/usr/bin/env node
/**
 * Runs the Pre-A1 audit through esbuild so it needs no extra tooling and no cache directory.
 * `npm run validate:pre-a1`
 */
import { build } from 'esbuild';
import path from 'node:path';
import { createRequire } from 'node:module';

const out = path.resolve('node_modules/.cache/pre-a1-audit.cjs');
await build({
  entryPoints: ['scripts/content/auditPreA1.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: out,
  logLevel: 'silent',
  alias: { '@': path.resolve('.') },
  external: ['react-native', '@react-native-async-storage/async-storage', 'expo-*', '@expo/*'],
  loader: { '.json': 'json' },
});
createRequire(import.meta.url)(out);
