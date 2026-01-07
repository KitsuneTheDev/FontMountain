

import { buildMainLayout } from "./builders/main.builder.js";
import { loadCssBundle } from "./utils/loadCss.util.js";
import { loadFonts } from "./utils/loadFonts.util.js";
import { fontListData } from "./data/fontList.data.js";
import { FontStore } from "./stores/FontStore.store.js";
import { FontList } from "./components/list/FontList.component.js";
import { Logo } from "./components/logo/Logo.component.js";
import { Preview } from "./components/preview/Preview.component.js";
import { History } from "./components/history/History.component.js";

const app = document.getElementById("App");
app.innerHTML = "<p>“The purpose of abstracting is not to be vague, but to create a new semantic level in which one can be absolutely precise.” ― Edsger W. Dijkstra</p>"

const cssFiles = [
    "/main.css",
    "/components/list/FontList.component.css",
    "/components/logo/Logo.component.css",
    "/components/preview/Preview.component.css",
    "/components/history/History.component.css",
    "/builders/main.builder.css",
];

// Initialize function - STARTER
const initialize = () => {
    // Loading fonts
    loadFonts();
    // Installing main layout
    buildMainLayout();
    // Creating Store
    const initialState = {
        selectedFont: fontListData[0].name,
        history: [],
        content: "The One Piece is Real!",
        fontListData: fontListData,
    }
    // Starting store
    const store = FontStore.getInstance(initialState);
    // Preview Container
    const previewContainer = document.querySelector(".container-preview-main");
    // List Container
    const listContainer = document.querySelector(".container-list-main");
    // Logo Container
    const logoContainer = document.querySelector(".header-logo");
    // History Container
    const historyContainer = document.querySelector(".header-history");

    // Creating interfaces
    const previewInterFace = Preview.init(FontStore.getInstance().getState(), previewContainer);
    const listInterFace = FontList.init(listContainer);
    const logoInterFace = Logo.init(logoContainer);
    const historyInterFace = History.init(FontStore.getInstance().getState(), historyContainer)
    
    // Subscribe
    FontStore.getInstance().subscribe('contentChange', previewInterFace.render);
    FontStore.getInstance().subscribe('selectedFontChange', previewInterFace.render);
    FontStore.getInstance().subscribe('selectedFontChange', listInterFace.render);
    FontStore.getInstance().subscribe('contentChange', listInterFace.render);
    FontStore.getInstance().subscribe('selectedFontChange', logoInterFace.render);
    FontStore.getInstance().subscribe('selectedFontChange', historyInterFace.render);
}

// Installing main css file
loadCssBundle(cssFiles).then(() => {
    initialize();
}).catch((error) => {
    console.error(error);
});