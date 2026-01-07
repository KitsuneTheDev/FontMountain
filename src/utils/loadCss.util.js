

function loadCss(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = href;

        link.onload = () => resolve();

        link.onerror = () => {
            reject(new Error(`Cannot load the css with path: ${href}`));
        }

        document.head.appendChild(link);
    })
}

function loadCssBundle(hrefs) {
    if(hrefs.length === 0) {
        return Promise.resolve();
    }

    const loadingPromises = hrefs.map((href) => loadCss(href));

    return Promise.all(loadingPromises);
}

export { loadCssBundle };