import {getScale, getUnit} from '../store/state.js'

import { setAlignment } from '../utils/alignmentUtils.js';
import { applyRotation, applyScaleX } from '../utils/transformUtils.js';
import { getFontProperties } from '../utils/fontUtils.js';

export function handleBlockCommand(line, previewDiv, labelWidth) {
   const SCALE = getScale();
    const UNIT = getUnit();

    const regex = /BLOCK\s+(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?(?:\s*,\s*(\d+))?(?:\s*,\s*(\d+))?\s*,\s*"([^"]+)"/i;
    const match = line.match(regex);
  
    if (match) {
      const x = parseInt(match[1]);
      const y = parseInt(match[2]);
      const width = parseInt(match[3]);
      const height = parseInt(match[4]);
      const font = match[5];
      const rotation = parseInt(match[6]);
      const xmult = parseInt(match[7]);
      const ymult = parseInt(match[8]);
      const space = match[9] ? parseInt(match[9]) : 0;
      const alignment = match[10] ? parseInt(match[10]) : 1;
      const fit = match[11] ? parseInt(match[11]) : 0;
      const content = match[12];
  
      const blockDiv = document.createElement("div");
      blockDiv.style.position = "absolute";
      blockDiv.style.left = x * SCALE + UNIT;
      blockDiv.style.top = y * SCALE + UNIT;
      blockDiv.style.width = width * SCALE + UNIT;
      blockDiv.style.height = height * SCALE + UNIT;
      blockDiv.style.overflow = "hidden"; // Evita desbordamiento del texto
  
      const { baseFontSize, fontFamily } = getFontProperties(font);
      const finalFontSize = baseFontSize * ymult;
      blockDiv.style.fontSize = finalFontSize * SCALE + UNIT;
      blockDiv.style.fontFamily = fontFamily;
  
      // Aplicar alineación y ajuste de texto
      setAlignment(blockDiv, alignment, labelWidth, x);
  
      // Si fit está activado, permitir saltos de línea
      blockDiv.style.whiteSpace = fit ? "normal" : "nowrap";
      blockDiv.style.wordBreak = fit ? "break-word" : "normal";
  
      // Aplicar rotación y escala
      applyRotation(blockDiv, rotation);
      applyScaleX(blockDiv, xmult);
  
      // Añadir contenido al bloque
      blockDiv.textContent = content;
  
      // Agregar el bloque al área de previsualización
      previewDiv.appendChild(blockDiv);
    }
  }