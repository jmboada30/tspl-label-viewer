import { handleBarcodeCommand } from './commands/barCodeCommand.js';
import { handleBarCommand } from './commands/barCommand.js';
import { handleBlockCommand } from './commands/blockCommand.js';
import { handleTextCommand } from './commands/textCommand.js'
import { handleBoxCommand } from './commands/boxCommand.js';
import { getScale, getUnit, setScale, getCurrentLabelWidth,  } from './store/state.js';
import { loadDesigns, saveDesign } from './store/desing.js'

document.getElementById("saveDesignBtn").addEventListener("click", saveDesign);
document
  .getElementById("loadDesignsLink")
  .addEventListener("click", loadDesigns);

document.getElementById("previewBtn").addEventListener("click", updatePreview);
document.getElementById("scaleSelect").addEventListener("change", (event) => {
  setScale(parseFloat(event.target.value));
});

function updatePreview() {

  const SCALE = getScale();
  const UNIT = getUnit();
  let currentLabelWidth = getCurrentLabelWidth();

  const tsplText = document.getElementById("tsplInput").value;
  const lines = tsplText.split("\n");

  // Valores por defecto (en dots, sin escalar)
  let labelWidth = 400;
  let labelHeight = 300;

  const previewDiv = document.getElementById("labelPreview");
  previewDiv.innerHTML = "";
  previewDiv.style.position = "relative";
  previewDiv.style.backgroundColor = "#fff";

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;
    const upperLine = line.toUpperCase();

    if (upperLine.startsWith("SIZE")) {
      // Ejemplo: SIZE 4,1 o SIZE 50 mm,25 mm
      const params = line.substring(4).trim().split(",");
      if (params.length >= 2) {
        let w = params[0].trim();
        let h = params[1].trim();
        if (w.toLowerCase().includes("mm")) {
          labelWidth = parseFloat(w) * 8;
        } else {
          labelWidth = parseFloat(w) * 203;
        }
        if (h.toLowerCase().includes("mm")) {
          labelHeight = parseFloat(h) * 8;
        } else {
          labelHeight = parseFloat(h) * 203;
        }
        currentLabelWidth = labelWidth; // Guardamos el ancho original para cálculos de alineación
        previewDiv.style.width = labelWidth * SCALE + UNIT;
        previewDiv.style.height = labelHeight * SCALE + UNIT;
      }
    } else if (upperLine.startsWith("CLS")) {
      previewDiv.innerHTML = "";
    } else if (upperLine.startsWith("TEXT")) {
      handleTextCommand(line, previewDiv, currentLabelWidth);
    } else if (upperLine.startsWith("BARCODE")) {
      handleBarcodeCommand(line, previewDiv);
    } else if (upperLine.startsWith("BAR")) {
      handleBarCommand(line, previewDiv);
    }else if (upperLine.startsWith("BLOCK")) {
      handleBlockCommand(line, previewDiv);
    }else if (upperLine.startsWith("BOX")) {
      handleBoxCommand(line, previewDiv);
    }
  });
}

function loadInit() {
  document.getElementById("tsplInput").value = `SIZE 100mm, 75mm
TEXT 50,16,"3",0,1,1,"Empresa SSL"
TEXT 620,16,"3",0,1,1,"01/03/2025"
TEXT 50,40,"3",0,1,1,"Ciudad Pais"
TEXT 50,64,"3",0,1,1,"paginaweb.com"
BAR 50,96,700,3

BLOCK 50,120,700,100,"3",0,1,1,0,2,1,"We stand behind our products with one of the most comprehensive support programs in the Auto-ID industry."

BARCODE 120,220,"128",120,2,0,4,2,"00001000004"

BAR 50,450,700,3
TEXT 50,490,"3",0,1,2,"Desc Corta"
BAR 400,450,3,120
TEXT 430,475,"3",0,1,3,"00001"`;

  updatePreview();
}

loadInit();
