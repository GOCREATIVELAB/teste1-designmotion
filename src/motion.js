export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const mix = (a, b, amount) => a + (b - a) * amount;
export const remap = (value, inMin, inMax, outMin, outMax) => mix(outMin, outMax, clamp((value - inMin) / (inMax - inMin)));
export const smooth = (value) => value * value * (3 - 2 * value);
export const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value), 3);
export const easeInOut = (value) => {
  const x = clamp(value);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const spring = (time, { stiffness = 150, damping = 18, mass = 1 } = {}) => {
  const t = Math.max(0, time);
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const damped = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(damped * t) + (zeta * omega / damped) * Math.sin(damped * t));
  }
  return 1 - Math.exp(-omega * t) * (1 + omega * t);
};
export const reveal = (t, start, duration = 0.6) => easeOutCubic(clamp((t - start) / duration));
export const fade = (t, start, duration = 0.4) => smooth(clamp((t - start) / duration));
export const stagger = (index, count, spread = 0.08) => index * spread;

