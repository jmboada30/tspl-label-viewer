let SCALE = 0.5; // Reducir tamaño para previsualización
const UNIT = "px";
let currentLabelWidth = 400; // se actualizará con SIZE
let loadedDesignIndex = null; // Índice del diseño cargado

document.getElementById("saveDesignBtn").addEventListener("click", saveDesign);
document
  .getElementById("loadDesignsLink")
  .addEventListener("click", loadDesigns);

document.getElementById("previewBtn").addEventListener("click", updatePreview);
document.getElementById("scaleSelect").addEventListener("change", (event) => {
  SCALE = parseFloat(event.target.value);
});

function updatePreview() {
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
    }
  });
}

function handleTextCommand(line, previewDiv, labelWidth) {
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

function getFontProperties(font) {
  switch (font) {
    case "0":
      return { baseFontSize: 24, fontFamily: '"Impact", sans-serif' };
    case "1":
      return { baseFontSize: 12, fontFamily: "monospace" };
    case "2":
      return { baseFontSize: 20, fontFamily: "monospace" };
    case "3":
      return { baseFontSize: 24, fontFamily: "monospace" };
    default:
      return { baseFontSize: 14, fontFamily: "sans-serif" };
  }
}

function setAlignment(textDiv, alignment, labelWidth, x) {
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

function applyRotation(textDiv, rotation) {
  if (rotation !== 0) {
    textDiv.style.transform = `rotate(${rotation}deg)`;
    textDiv.style.transformOrigin = "left";
    textDiv.style.left = textDiv.style.left.replace("px", "") - 10 + UNIT;
  }
}

function applyScaleX(textDiv, xmult) {
  if (xmult !== 1) {
    textDiv.style.transform += ` scaleX(${((xmult / 100) * 10) + 1})`;
  }
}

function handleBarCommand(line, previewDiv) {
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

function handleBarcodeCommand(line, previewDiv) {
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

function saveDesign() {
  const tsplText = document.getElementById("tsplInput").value;
  let designName;

  if (loadedDesignIndex !== null) {
    const designs = JSON.parse(localStorage.getItem("designs")) || [];
    designName = designs[loadedDesignIndex].name;
    designs[loadedDesignIndex] = {
      name: designName,
      date: new Date().toLocaleString(),
      content: tsplText,
    };
    localStorage.setItem("designs", JSON.stringify(designs));
    alert(`Diseño "${designName}" actualizado exitosamente.`);
  } else {
    designName = prompt("Ingrese el nombre del diseño:");
    if (!designName) return;

    const designs = JSON.parse(localStorage.getItem("designs")) || [];
    const newDesign = {
      name: designName,
      date: new Date().toLocaleString(),
      content: tsplText,
    };

    designs.push(newDesign);
    localStorage.setItem("designs", JSON.stringify(designs));
    alert("Diseño guardado exitosamente.");
  }
}

function loadDesigns() {
  const designs = JSON.parse(localStorage.getItem("designs")) || [];
  if (designs.length === 0) {
    alert("No hay diseños guardados.");
    return;
  }

  const designList = designs
    .map(
      (design, index) =>
        `${index + 1}. ${design.name} (Última modificación: ${design.date})`
    )
    .join("\n");
  const selectedDesignIndex = prompt(
    `Seleccione un diseño para cargar:\n${designList}`
  );
  const selectedDesign = designs[selectedDesignIndex - 1];

  if (selectedDesign) {
    document.getElementById("tsplInput").value = selectedDesign.content;
    loadedDesignIndex = selectedDesignIndex - 1;
    updatePreview();
  }
}

function loadInit() {
  document.getElementById("tsplInput").value = `SIZE 100mm, 75mm

TEXT 50,16,"3",0,1,1,"Empresa SSL"
TEXT 620,16,"3",0,1,1,"01/03/2025"
TEXT 50,40,"3",0,1,1,"Ciudad Pais"
TEXT 50,64,"3",0,1,1,"paginaweb.com"
BAR 50,96,700,3

BARCODE 120,220,"128",120,2,0,4,2,"00001000004"

BAR 50,450,700,3
TEXT 50,490,"3",0,1,2,"Desc Corta"
BAR 400,450,3,120
TEXT 430,475,"3",0,1,3,"00001"`;

  updatePreview();
}

loadInit();
