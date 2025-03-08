const STATE_KEY = "appState";

let appState = JSON.parse(localStorage.getItem(STATE_KEY)) || {
    scale: 0.5,
    unit: "px",
    currentLabelWidth: 400,
    loadedDesignIndex: null,
};

export function saveAppState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(appState));
}

// Scale
export function getScale() {
    return appState.scale;
}

export function setScale(value) {
    appState.scale = value;
    saveAppState();
}

// Unit
export function getUnit() {
    return appState.unit;
}

export function setUnit(value) {
    appState.unit = value;
    saveAppState();
}

// Label Width
export function getCurrentLabelWidth() {
    return appState.currentLabelWidth;
}

export function setCurrentLabelWidth(value) {
    appState.currentLabelWidth = value;
    saveAppState();
}

// Design Index
export function getLoadedDesignIndex() {
    return appState.loadedDesignIndex;
}

export function setLoadedDesignIndex(value) {
    appState.loadedDesignIndex = value;
    saveAppState();
}
