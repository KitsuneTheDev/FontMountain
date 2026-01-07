export const buildMainLayout = () => {
        const mainLayoutBody = `
        <div class="container-main-layout">
            <header class="container-header">
                <div class="header-logo">
                </div>
                <div class="header-history">
                </div>
            </header>
            <main class="container-main">
                <div class="container-preview-main">
                </div>
                <div class="container-list-main">
                </div>
            </main>
        </div>
        `;

        const parent = document.querySelector("#App");
        parent.innerHTML = mainLayoutBody;
}