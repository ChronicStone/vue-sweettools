export function computeHslColor(color: string, opacity: number) {
  // Convert the color to an RGBA value
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const rgbaColor = window.getComputedStyle(temp).color;

  // Extract the red, green, blue, and alpha values
  const rgbaRegex = /^rgba?\((\d+), (\d+), (\d+)(, (\d+(?:\.\d+)?))?\)$/;
  const match = rgbaRegex.exec(rgbaColor);
  if (!match) {
    throw new Error(`Invalid color: ${color}`);
  }
  const red = parseInt(match[1], 10);
  const green = parseInt(match[2], 10);
  const blue = parseInt(match[3], 10);
  const alpha = match[5] ? parseFloat(match[5]) : 1;

  // Convert the RGB values to HSL values
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  const l = (cmax + cmin) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (delta !== 0) {
    if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  // Simulate the opacity using HSL
  const hslaColor = `hsla(${h}, ${s * 100}%, ${l * 100}%, ${alpha * opacity})`;

  // Clean up and return the HSLA color
  document.body.removeChild(temp);
  return hslaColor;
}
