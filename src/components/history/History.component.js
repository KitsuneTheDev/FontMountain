import { FontStore } from "../../stores/FontStore.store";

export class History{

    static #historyParent = null;

    static init(state, parent) {
        this.#buildHistoryTemplate(state, parent);

        return {
            render: (state) => this.#renderHistory(state)
        }
    }

    static #buildHistoryTemplate(state, parent) {
        const historyContainer = document.createElement('div');
        historyContainer.classList.add('container-history');
        this.#historyParent = historyContainer;

        if(!parent) {
            console.log("HISTORY COMP: Display container is not ready.");
            return;
        }
        parent.appendChild(historyContainer);
        console.log("state --->", state);
        this.#renderHistory(state);
    }

    static #renderHistory(state) {
        if(state.history.length === 0) {
            console.log('HISTORY COMP: No history found to render.');
            return;
        }
        this.#historyParent.innerHTML = '';
        state.history.forEach((font) => {
            const historyFontElement = document.createElement('div');
            historyFontElement.classList.add('history-element');
            historyFontElement.dataset.fontName = font;
            historyFontElement.textContent = font;

            if(historyFontElement.dataset.fontName === state.selectedFont) {
                historyFontElement.classList.add('active');
            }

            this.#historyParent.appendChild(historyFontElement);
        });

        this.#addEventListeners();
    }

    static #addEventListeners() {
        const allHistoryElements = document.querySelectorAll('.history-element');
        console.log('historyElement --->', allHistoryElements);
        allHistoryElements.forEach((element) => {
            element.addEventListener('click', (event) => this.#handleHistoryClick(event));
        })
    }

    static #handleHistoryClick(event) {
        const historyElement = event.target.closest('.history-element');
        console.log('historyElement --->', historyElement);
        FontStore.getInstance().updateSelectedFont(historyElement.dataset.fontName);

        const allListElements = document.querySelectorAll('[class*="list-element"');
        allListElements.forEach((element) => {
            if (element.dataset.fontName === historyElement.dataset.fontName) {
                element.classList.add('active');
                return;
            }
        })
    }
}