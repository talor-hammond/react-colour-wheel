import tinycolor from 'tinycolor2'

export default function produceRgbShades (r, g, b, amount) {
  let shades = []

  const hsl = tinycolor(`rgb(${r}, ${g}, ${b})`).toHsl()

  for (let i = 9; i > 1; i -= 8 / amount) { // Decrements from 9 - 1; i being what luminosity (hsl.l) is multiplied by.
    hsl.l = 0.1 * i
    shades.push(tinycolor(hsl).toRgb())
  }

  return shades
}

export function colourToRgbObj (colour) {
  colour = tinycolor(colour)

  const rgb = colour.toRgb()

  return rgb
}
