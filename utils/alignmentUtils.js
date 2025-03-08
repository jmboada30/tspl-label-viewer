import {getScale, getUnit} from '../store/state.js'

export function setAlignment(textDiv, alignment, labelWidth, x) {
  const SCALE = getScale();
  const UNIT = getUnit();

  // Calcular el ancho disponible (en dots) y luego aplicar escala
  const availableWidth = (labelWidth - x) * SCALE;
  if (alignment === 2) {
    textDiv.style.textAlign = "center";
    textDiv.style.width = availableWidth + UNIT;
  } else if (alignment === 3) {
    textDiv.style.textAlign = "right";
    textDiv.style.width = availableWidth + UNIT;
  } else {
    textDiv.style.textAlign = "left";
  }
}
