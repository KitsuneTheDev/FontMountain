import { FontStore } from "../../stores/FontStore.store.js";

export class FontList {

    static init(parent) {
        this.#buildListTemplate(parent);

        return {
            render: (state) => this.#renderList(state)
        };
    }

    static #renderList(state) {
        const listElements = document.querySelectorAll('.list-body li');
        const selectedElement = document.querySelector(`[data-font-name=${state.selectedFont}]`)
        const currentActiveElement = document.querySelector('li.active');
    
        if(currentActiveElement) {
            currentActiveElement.classList.remove("active");
        }

        if(selectedElement) {
            selectedElement.classList.add("active");
        } else {
            console.log("FONT LIST COMP: No font found: ", state.selectedFont);
        }

        listElements.forEach(element => element.innerText = state.content);
    }

    static #buildListTemplate(parent) {
        if(!parent) {
            console.log('FONT LIST COMP: No parent provided for the font list.');
        } else {
            const newList = document.createElement('ul');
            newList.classList.add("list-body");
        
            const state = FontStore.getInstance().getState();

            state.fontListData.forEach((font, index) => {
                const newListElement = document.createElement('li');
                newListElement.accessKey = index;
                newListElement.classList.add(`list-element-${index}`);
                newListElement.dataset.fontName = font.name;
                newListElement.innerText = state.content;
                newListElement.style.fontFamily = font.name;

                newList.appendChild(newListElement);
                });
            parent.appendChild(newList);
        }
        
        this.#addEventListeners();
    }

    static #addEventListeners() {
        const listElements = document.querySelectorAll('[class*=list-element]');
        listElements.forEach((element) => {
            element.addEventListener('click', (event) => this.#handleElementClick(event));
        })
    }

    static #handleElementClick(event) {
        const selectedElement = event.target.closest('li');
        console.log(selectedElement.dataset.fontName);
        FontStore.getInstance().updateSelectedFont(selectedElement.dataset.fontName);
    }
}