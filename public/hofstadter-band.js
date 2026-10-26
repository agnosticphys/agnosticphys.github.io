import { HH_MODEL } from './hofstadter/metadata.js';
export { HH_MODEL };

const response = await fetch(new URL('./hofstadter/field.bin', import.meta.url));
if (!response.ok) throw new Error('Unable to load the Harper–Hofstadter band data.');
const buffer = await response.arrayBuffer();
const n = HH_MODEL.N, count = n * n;
if (buffer.byteLength !== count * 8) throw new Error('Unexpected Hofstadter data size.');
const view = new DataView(buffer);
const energy = new Float32Array(count), curvature = new Float32Array(count);
for (let i = 0; i < count; i++) {
  energy[i] = view.getFloat32(i * 4, true);
  curvature[i] = view.getFloat32((i + count) * 4, true);
}
const TAU = Math.PI * 2;
const periodic = x => ((x % TAU) + TAU) % TAU / TAU * n;

// The two visible torus angles are u=q*kx and v=ky. Curvature values are
// Omega_(kx,ky), computed in the uniform-phase, orbital-position Bloch basis.
export function bandData(u, v) {
  const x = periodic(u), y = periodic(v);
  const i = Math.floor(x), j = Math.floor(y), a = x - i, b = y - j;
  const i1 = (i + 1) % n, j1 = (j + 1) % n;
  const sample = data => (1-a)*((1-b)*data[i*n+j]+b*data[i*n+j1]) + a*((1-b)*data[i1*n+j]+b*data[i1*n+j1]);
  return { energy: sample(energy), curvature: sample(curvature) };
}

export function bandPoint(u, v) {
  const { curvature } = bandData(u, v);
  // Height is a visual normal displacement of the same curvature field as color.
  // The radius stays below the major radius, preserving an open torus hole.
  const radius = .46 + .40 * curvatureStrength(curvature) ** 1.2;
  return {
    x: (1.35 + radius * Math.cos(v)) * Math.cos(u),
    y: (1.35 + radius * Math.cos(v)) * Math.sin(u),
    z: radius * Math.sin(v),
  };
}

const palette = [
  [0, [142, 192, 172]],
  [.25, [221, 224, 198]],
  [.50, [237, 200, 158]],
  [.75, [219, 139, 111]],
  [1, [166, 70, 76]],
];
const maximum = Math.max(Math.abs(HH_MODEL.curvatureMin), Math.abs(HH_MODEL.curvatureMax));
export function curvatureStrength(value) {
  return Math.min(1, Math.asinh(Math.abs(value) / HH_MODEL.displayScale) / Math.asinh(maximum / HH_MODEL.displayScale));
}
export function curvatureColor(value) {
  // Color and height share the same monotone curvature-magnitude mapping.
  const t = curvatureStrength(value);
  const upper = palette.findIndex(([stop]) => stop >= t);
  if (upper <= 0) return palette[0][1];
  const [lo, a] = palette[upper-1], [hi, b] = palette[upper];
  const f = (t-lo)/(hi-lo);
  return a.map((component, i) => component + f*(b[i]-component));
}
