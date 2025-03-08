export function getFontProperties(font) {
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