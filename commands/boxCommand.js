import { getScale, getUnit} from '../store/state.js'

export function handleBoxCommand(line, previewDiv) {
    const SCALE = getScale();
    const UNIT = getUnit();

    const regex = /BOX\s+(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?/i;
    const match = line.match(regex);

    if (match) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        const x_end = parseInt(match[3]);
        const y_end = parseInt(match[4]);
        const lineThickness = parseInt(match[5]);
        const radius = match[6] ? parseInt(match[6]) : 0;

        const boxDiv = document.createElement("div");
        boxDiv.style.position = "absolute";
        boxDiv.style.left = x * SCALE + UNIT;
        boxDiv.style.top = y * SCALE + UNIT;
        boxDiv.style.width = (x_end - x) * SCALE + UNIT;
        boxDiv.style.height = (y_end - y) * SCALE + UNIT;
        boxDiv.style.border = `${lineThickness * SCALE}${UNIT} solid black`;
        boxDiv.style.borderRadius = radius * SCALE + UNIT;

        previewDiv.appendChild(boxDiv);
    }
}

