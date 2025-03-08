import {getScale, getUnit} from '../store/state.js';

/**
 * Handles the barcode command by parsing the input line and rendering a barcode preview.
 *
 * @param {string} line - The input line containing the barcode command.
 * @param {HTMLElement} previewDiv - The div element where the barcode preview will be appended.
 * 
 * @param {number} x - The x-coordinate for the barcode position.
 * @param {number} y - The y-coordinate for the barcode position.
 * @param {string} codeType - The type of the barcode.
 * @param {number} heightBarcode - The height of the barcode.
 * @param {number} humanReadable - Indicates if the barcode should be human-readable.
 * @param {number} rotation - The rotation angle of the barcode.
 * @param {number} narrow - The narrow bar width of the barcode.
 * @param {number} wide - The wide bar width of the barcode.
 * @param {number} [alignment] - The alignment of the human-readable text (optional).
 * @param {string} content - The content of the barcode.
 */
export function handleBarcodeCommand(line, previewDiv) {
  const SCALE = getScale();
  const UNIT = getUnit();  
  
  const barcodeRegex =
      /BARCODE\s+(\d+)\s*,\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s*,\s*"([^"]+)"\s*/i;
    const match = line.match(barcodeRegex);
    if (match) {
      const x = parseInt(match[1]);
      const y = parseInt(match[2]);
      const codeType = match[3];
      const heightBarcode = parseInt(match[4]);
      const humanReadable = parseInt(match[5]);
      const rotation = parseInt(match[6]);
      const narrow = parseInt(match[7]);
      const wide = parseInt(match[8]);
  
      let alignment, content;
      if (match[9] !== undefined && match[10] !== undefined) {
        alignment = parseInt(match[9]);
        content = match[10];
      } else {
        alignment = humanReadable;
        content = match[10];
      }
  
      const barcodeContainer = document.createElement("div");
      barcodeContainer.style.position = "absolute";
      barcodeContainer.style.left = x * SCALE + UNIT;
      barcodeContainer.style.top = y * SCALE + UNIT;
  
      // Se utiliza una fórmula simple: (narrow+wide)* (longitud del contenido)* factor base (8 dots)
      let barcodeWidth = (narrow + wide) * content.length * 6;
      // Aplicamos la escala
      barcodeWidth = barcodeWidth * SCALE;
  
      const barcodeBar = document.createElement("div");
      barcodeBar.style.width = barcodeWidth + UNIT;
      barcodeBar.style.height = heightBarcode * SCALE + UNIT;
      barcodeBar.style.backgroundColor = "black";
      barcodeContainer.appendChild(barcodeBar);
  
      if (humanReadable !== 0) {
        const textDiv = document.createElement("div");
        textDiv.textContent = content;
        textDiv.style.width = barcodeWidth + UNIT;
        textDiv.style.fontSize = 30 * SCALE + UNIT; // tamaño fijo para previsualizar
        textDiv.style.fontFamily = "monospace";
        if (alignment === 2) {
          textDiv.style.textAlign = "center";
        } else if (alignment === 3) {
          textDiv.style.textAlign = "right";
        } else {
          textDiv.style.textAlign = "left";
        }
        textDiv.style.marginTop = 2 * SCALE + UNIT;
        barcodeContainer.appendChild(textDiv);
      }
  
      if (rotation !== 0) {
        barcodeContainer.style.transform = `rotate(${rotation}deg)`;
        barcodeContainer.style.transformOrigin = "left";
      }
  
      previewDiv.appendChild(barcodeContainer);
    }
  }