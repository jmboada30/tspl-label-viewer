import {getScale, getUnit} from '../store/state.js'

export function handleBarCommand(line, previewDiv) {
  const SCALE = getScale();
  const UNIT = getUnit();
  
  const params = line.substring(3).trim().split(",");
  if (params.length >= 4) {
    const x = parseInt(params[0].trim());
    const y = parseInt(params[1].trim());
    const widthBar = parseInt(params[2].trim());
    const heightBar = parseInt(params[3].trim());

    const barDiv = document.createElement("div");
    barDiv.style.position = "absolute";
    barDiv.style.left = x * SCALE + UNIT;
    barDiv.style.top = y * SCALE + UNIT;
    barDiv.style.width = widthBar * SCALE + UNIT;
    barDiv.style.height = heightBar * SCALE + UNIT;
    barDiv.style.backgroundColor = "black";

    previewDiv.appendChild(barDiv);
  }
}