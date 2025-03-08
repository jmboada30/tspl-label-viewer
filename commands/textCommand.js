import {getScale, getUnit} from '../store/state.js';

import { setAlignment } from '../utils/alignmentUtils.js';
import { applyRotation, applyScaleX } from '../utils/transformUtils.js';
import { getFontProperties } from '../utils/fontUtils.js';

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