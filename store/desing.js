import { setLoadedDesignIndex, getLoadedDesignIndex } from './state.js';

export function loadDesigns() {
    const designs = JSON.parse(localStorage.getItem("designs")) || [];
    if (designs.length === 0) {
        alert("No hay diseños guardados.");
        return;
    }
  
    const designList = designs
      .map((design, index) => `${index + 1}. ${design.name} (Última modificación: ${design.date})`)
      .join("\n");
    const selectedDesignIndex = prompt(`Seleccione un diseño para cargar:\n${designList}`);
    const selectedDesign = designs[selectedDesignIndex - 1];
  
    if (selectedDesign) {
        document.getElementById("tsplInput").value = selectedDesign.content;
        setLoadedDesignIndex(selectedDesignIndex - 1);
        updatePreview();
    }
}

export function saveDesign() {
    const tsplText = document.getElementById("tsplInput").value;
    let designName;

    if (getLoadedDesignIndex() !== null) {
        const designs = JSON.parse(localStorage.getItem("designs")) || [];
        designName = designs[getLoadedDesignIndex()].name;
        designs[getLoadedDesignIndex()] = {
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
