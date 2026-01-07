import { FontStore } from '../../stores/FontStore.store.js';

export class Preview {

    static #maxChar = 28;
    static #displayParent = null;
    static #charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    static init(state, parent) {
        this.#buildPreviewTemplate(state, parent);
        this.#addEventListeners();

        return {
            render: (state) => this.#renderContent(state.content, state.selectedFont)
        };
    }

    static #buildPreviewTemplate(state, parent) {
        if(!parent) {
            console.log('PREVIEW COMP: No parent provided for the preview.');
            return;
        } else {
            // Creating main container
            const previewContainer = document.createElement('div');
            previewContainer.classList.add('container-preview');
            previewContainer.id = 'containerPreview';
            
            // Creating hidden text area
            const inputTextArea = document.createElement('textarea');
            inputTextArea.classList.add('textarea-user-input');
            inputTextArea.id = 'textareaUserInput';
            inputTextArea.maxLength = this.#maxChar;
            inputTextArea.value = state?.content.slice(0, this.#maxChar);
            
            // inputTextArea.style.position = 'absolute';
            inputTextArea.style.opacity = '0';
            inputTextArea.style.pointerEvents = 'none';
            
            // Apppending to main container
            previewContainer.appendChild(inputTextArea);

            // Creating spans' container for letter
            const displayContainer = document.createElement('div');
            displayContainer.classList.add('preview-display-container');
            displayContainer.id = 'displayContainer';

            // Saving container
            this.#displayParent = displayContainer;

            // Rendering content for the first time
            this.#renderContent(state.content, state.selectedFont);

            // Appending to main container
            previewContainer.appendChild(displayContainer);

            // Appending to recieved page parent
            parent.appendChild(previewContainer);
        }
    }

    static #renderContent(content, selectedFont) {
        if(!content) {
            console.log("PREVIEW COMP: Content not provided.");
            content = "";
        }
        const parent = this.#displayParent;
        if(!parent) {
            console.log("PREVIEW COMP: Display container is not ready.");
            return;
        }
        parent.innerHTML = '';
        const displayContent = content.slice(0, this.#maxChar).padEnd(this.#maxChar, ' ');
        const fragment = document.createDocumentFragment();
        parent.style.fontFamily = selectedFont;

        [...displayContent].forEach((letter, index) => {
            const span = document.createElement('span');
            span.classList.add('letter-span-element');
            span.innerText = letter === ' ' ? '\u00A0' : letter;
            span.dataset.index = index;
            span.dataset.letter = letter;

            // Appending to fragment
            fragment.appendChild(span);
        });

        // Appending to parent
        parent.appendChild(fragment);
    }

    static #addEventListeners() {
        const displayContainer = document.querySelector('#displayContainer');
        const hiddenInput = document.querySelector('#textareaUserInput');
        
        if(!displayContainer || !hiddenInput) {
            console.log("PREVIEW COMP [addEventListener]: displayContainer or hiddenInput cannot found.");
            return;
        }

        displayContainer.addEventListener('click', (event) => this.#handleDisplayClick(event));

        // Type event
        hiddenInput.addEventListener('input', (event) => this.#handleHiddenInput(event));

        // Iterating highlight!
        hiddenInput.addEventListener('keydown', (event) => this.#handleHiddenKeydown(event));

        // Scroll type
        displayContainer.addEventListener('wheel', (event) => this.#handleDisplayScroll(event));
    }

    // Highlight render
    static #updateHighlight(cursorPosition) {
        const allSpans = document.querySelectorAll('.letter-span-element');

        if(allSpans.length === 0) {
            return;
        } else {
            allSpans.forEach((element) => element.classList.remove('active'));
            const targetIndex = cursorPosition === 0 ? 0 : cursorPosition - 1;

            const selected = document.querySelector(`[data-index="${targetIndex}"]`);
            if(selected) {
                selected.classList.add('active');
            }
        }
    }

    static #handleDisplayClick(event) {
        const letterSpan = event.target.closest('.letter-span-element');
        const hiddenInput = document.querySelector('#textareaUserInput');
        let cursorPosition;

        if(letterSpan) {
            const spanIndex = parseInt(letterSpan.dataset.index);
            cursorPosition = spanIndex + 1;

            if(letterSpan.dataset.letter === ' ') {
                cursorPosition = hiddenInput.value.length;
            }
        } else {
            cursorPosition = hiddenInput.value.length;
        }

        hiddenInput.focus();
        // Highlight!
        this.#updateHighlight(cursorPosition);

        hiddenInput.setSelectionRange(cursorPosition, cursorPosition);
    }

    static #handleHiddenInput(event) {
        const newContent = event.target.value;

        setTimeout(() => {
            const cursorPosition = event.target.selectionStart;
            this.#updateHighlight(cursorPosition);
        }, 0);

        FontStore.getInstance().updateContent(newContent);
    }

    static #handleHiddenKeydown(event) {
        if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            setTimeout(() => {
                const cursorPosition = event.target.selectionStart;
                this.#updateHighlight(cursorPosition);
            }, 0);
        }
    }

    static #handleDisplayScroll(event) {
        const letterSpan = event.target.closest('.letter-span-element');

        if(!letterSpan) {
            console.log("PREVIEW COMP[handleDisplayScroll]: No letter found on cursor.");
            return;
        } 

        // Any case of the page overflowing along Y-axis (I don't think that'll ever happen)
        event.preventDefault();

        const hiddenInput = document.querySelector('#textareaUserInput');
        const currentIndex = parseInt(letterSpan.dataset.index);

        const direction = event.deltaY < 0 ? -1 : 1;

        // Finding current letter's index
        let currentContent = hiddenInput.value.padEnd(this.#maxChar, ' ');
        let currentLetter = currentContent[currentIndex];
        const setLength = this.#charset.length;
        let charIndexInset = this.#charset.indexOf(currentLetter);

        // Makin circular
        charIndexInset = (charIndexInset + direction + setLength) % setLength;

        const newChar = this.#charset[charIndexInset];

        const newContentArray = currentContent.split('');
        newContentArray[currentIndex] = newChar;

        let newContent = newContentArray.join('').trimEnd();

        hiddenInput.value = newContent;

        FontStore.getInstance().updateContent(newContent);
    }
}