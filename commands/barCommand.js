import {getScale, getUnit} from '../store/state.js'

/**
 * Handles the bar command by creating a bar (div element) and appending it to the previewDiv.
 *
 * @param {string} line - The command line containing the parameters for the bar.
 * @param {HTMLElement} previewDiv - The div element where the bar will be appended.
 *
 * The command line should have the following format:
 * BAR x,y,width,height
 * 
 * @param {number} x - The x-coordinate for the bar's position.
 * @param {number} y - The y-coordinate for the bar's position.
 * @param {number} widthBar - The width of the bar.
 * @param {number} heightBar - The height of the bar.
 */
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