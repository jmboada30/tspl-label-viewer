document.getElementById("previewBtn").addEventListener("click", updatePreview);
const UNIT = "px";

function updatePreview() {
  const tsplText = document.getElementById("tsplInput").value;
  const lines = tsplText.split("\n");

  let labelWidth = 400;

  const previewDiv = document.getElementById("labelPreview");
  previewDiv.innerHTML = "";
  previewDiv.style.position = "relative";
  previewDiv.style.backgroundColor = "#fff";

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;
    const upperLine = line.toUpperCase();

    if (upperLine.startsWith("SIZE")) {
      handleSizeCommand(line, previewDiv);
    } else if (upperLine.startsWith("CLS")) {
      previewDiv.innerHTML = "";
    } else if (upperLine.startsWith("TEXT")) {
      handleTextCommand(line, previewDiv, labelWidth);
    } else if (upperLine.startsWith("BARCODE")) {
      handleBarcodeCommand(line, previewDiv);
    } else if (upperLine.startsWith("BAR")) {
      handleBarCommand(line, previewDiv);
    }
  });
}

function handleSizeCommand(line, previewDiv) {
  const params = line.substring(4).trim().split(",");
  if (params.length >= 2) {
    let w = params[0].trim();
    let h = params[1].trim();
    let labelWidth, labelHeight;
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
    previewDiv.style.width = labelWidth + UNIT;
    previewDiv.style.height = labelHeight + UNIT;
  }
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
    textDiv.style.position = "absolute";
    textDiv.style.left = x + UNIT;
    textDiv.style.top = y + UNIT;
    textDiv.style.whiteSpace = "nowrap";
    textDiv.textContent = content;

    const { baseFontSize, fontFamily } = getFontProperties(font);
    const finalFontSize = baseFontSize * ymult;
    textDiv.style.fontSize = finalFontSize + UNIT;
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
  if (alignment === 2) {
    textDiv.style.textAlign = "center";
    textDiv.style.width = labelWidth - x + UNIT;
  } else if (alignment === 3) {
    textDiv.style.textAlign = "right";
    textDiv.style.width = labelWidth - x + UNIT;
  } else {
    textDiv.style.textAlign = "left";
  }
}

function applyRotation(textDiv, rotation) {
  if (rotation !== 0) {
    textDiv.style.transform = `rotate(${rotation}deg)`;
    textDiv.style.transformOrigin = "left top";
  }
}

function applyScaleX(textDiv, xmult) {
  if (xmult !== 1) {
    textDiv.style.transform += ` scaleX(${xmult})`;
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
    barDiv.style.left = x + UNIT;
    barDiv.style.top = y + UNIT;
    barDiv.style.width = widthBar + UNIT;
    barDiv.style.height = heightBar + UNIT;
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
    barcodeContainer.style.left = x + UNIT;
    barcodeContainer.style.top = y + UNIT;

    const barcodeWidth = (narrow + wide) * content.length * 8;

    const barcodeBar = document.createElement("div");
    barcodeBar.style.width = barcodeWidth + UNIT;
    barcodeBar.style.height = heightBarcode + UNIT;
    barcodeBar.style.backgroundColor = "black";
    barcodeContainer.appendChild(barcodeBar);

    if (humanReadable !== 0) {
      const textDiv = document.createElement("div");
      textDiv.textContent = content;
      textDiv.style.width = barcodeWidth + UNIT;
      textDiv.style.fontSize = "24px";
      textDiv.style.fontFamily = "monospace";
      if (alignment === 2) {
        textDiv.style.textAlign = "center";
      } else if (alignment === 3) {
        textDiv.style.textAlign = "right";
      } else {
        textDiv.style.textAlign = "left";
      }
      textDiv.style.marginTop = "2" + UNIT;
      barcodeContainer.appendChild(textDiv);
    }

    if (rotation !== 0) {
      barcodeContainer.style.transform = `rotate(${rotation}deg)`;
      barcodeContainer.style.transformOrigin = "left top";
    }

    previewDiv.appendChild(barcodeContainer);
  }
}
