import { fontListData } from "../data/fontList.data.js";

const baseFolderPath = '/assets/fonts/';

function loadFonts() {
    const fontStyleElement = document.createElement('style');
    let css = '';

    console.log("Downloading fonts...");
    fontListData.forEach(font => {
        const fontPath = `${baseFolderPath}${font.path}`;

        css += `
            @font-face {
                font-family: ${font.name};
                src: url("${fontPath}");
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
        `;
    });

    fontStyleElement.textContent = css;

    document.head.appendChild(fontStyleElement);
    console.log(`${fontListData.length} fonts loaded successfully.`);
};

export { loadFonts };