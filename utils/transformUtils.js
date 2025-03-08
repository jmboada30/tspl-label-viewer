export function applyRotation(textDiv, rotation) {
  if (rotation !== 0) {
    textDiv.style.transform = `rotate(${rotation}deg)`;
    textDiv.style.transformOrigin = "left";
    textDiv.style.left = textDiv.style.left.replace("px", "") - 10 + UNIT;
  }
}
  
export function applyScaleX(textDiv, xmult) {
  if (xmult !== 1) {
    textDiv.style.transform += ` scaleX(${((xmult / 100) * 10) + 1})`;
  }
}