import {getScale, getUnit} from '../store/state.js';

import { setAlignment } from '../utils/alignmentUtils.js';
import { applyRotation, applyScaleX } from '../utils/transformUtils.js';
import { getFontProperties } from '../utils/fontUtils.js';

/**
 * Handles the TEXT command by parsing the input line and rendering the text on the previewDiv.
 *
 * @param {string} line - The input line containing the TEXT command.
 * @param {HTMLElement} previewDiv - The div element where the text will be rendered.
 * @param {number} labelWidth - The width of the label for alignment purposes.
 *
 * @param {number} x - The x-coordinate for the text position.
 * @param {number} y - The y-coordinate for the text position.
 * @param {string} font - The font type for the text.
 * @param {number} rotation - The rotation angle for the text.
 * @param {number} xmult - The horizontal scaling factor for the text.
 * @param {number} ymult - The vertical scaling factor for the text.
 * @param {number} [alignment=1] - The alignment of the text (optional, default is 1) (1 = left, 2 = center, 3 = right).
 * @param {string} content - The actual text content to be displayed.
 */
export function handleTextCommand(line, previewDiv, labelWidth) {
  const SCALE = getScale();
  const UNIT = getUnit();

  const regex =
    /TEXT\s+(\d+)\s*,\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s*,\s*"([^"]+)"/i;
  const match = line.match(regex);
  if (match) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    const font = match[3];
    const rotation = parseInt(match[4]);
    const xmult = parseInt(match[5]);
    const ymult = parseInt(match[6]);
    const alignment = match[7] ? parseInt(match[7]) : 1;
    const content = match[8];

    const textDiv = document.createElement("div");
    // Escalar coordenadas
    textDiv.style.position = "absolute";
    textDiv.style.left = x * SCALE + UNIT;
    textDiv.style.top = y * SCALE + UNIT;
    textDiv.style.whiteSpace = "nowrap";
    textDiv.textContent = content;

    const { baseFontSize, fontFamily } = getFontProperties(font);
    const finalFontSize = baseFontSize * ymult;
    textDiv.style.fontSize = finalFontSize * SCALE + UNIT;
    textDiv.style.fontFamily = fontFamily;

    setAlignment(textDiv, alignment, labelWidth, x);
    applyRotation(textDiv, rotation);
    applyScaleX(textDiv, xmult);

    previewDiv.appendChild(textDiv);
  }
}