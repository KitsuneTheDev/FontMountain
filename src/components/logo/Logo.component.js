

export class Logo {
    static init(parent) {
        this.#buildLogo(parent);

        return {
            render: (state) => this.#renderLogo(state)
        };
    }

    static #renderLogo(state) {
        const logoContainer = document.querySelector(".container-logo");
        logoContainer.style.fontFamily = state.selectedFont;
    }

    static #buildLogo(parent) {
        if(!parent) {
            console.log(`LOGO COMP: No parent container found with the name: ${parent}`);
        } else {
            const logoContainer = document.createElement('div');
            logoContainer.classList.add('container-logo');

            logoContainer.innerHTML = `
                <div class="logo-name">
                    <p>Font</p>
                    <p>Fountain</p>
                </div>
                <div class="logo-description">
                    Font out your thoughts
                </div>   
            `;

            parent.appendChild(logoContainer);
        }
    }
}