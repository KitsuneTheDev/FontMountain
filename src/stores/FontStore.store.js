

/** 
 * @typedef {Object} state
 * @property {string} selectedFont
 * @property {string[]} history
 * @property {Object[]} fontListData
 * @property {string} content
 * 
 * @typedef {Object[]} fontListData
 * @property {string} name
 * @property {string} path
*/

export class FontStore {

    static instance = null; // Holds the only instance for Singleton 

    constructor(initialState) {
        if(FontStore.instance) {
            return FontStore.instance;
        } else {
            this.state = initialState;
            this.listeners = {};
            FontStore.instance = this;
        }
    }

    static getInstance(initialState = {}) {
        if(!FontStore.instance) {
            FontStore.instance = new FontStore(initialState);
        } else {
            return FontStore.instance;
        }
    }

    // PUSH THE  FUNCTION INTO LISTENERS SO WE CAN RUN LATER AFTER EVERY UPDATE
    subscribe(eventType, listenerFunction) {
        // Look if the key exist
        // IF IT IS NOT: create a key and an empty array then push the function into array
        // IF IT IS: push the function into the array represented by that key
        this.listeners[eventType] = this.listeners[eventType] || []
        this.listeners[eventType].push(listenerFunction);
        console.log(`FONT STORE: Welcome aboard, ${listenerFunction}`);
        listenerFunction(this.state);
    }

    publish(eventType) {
        if(!this.listeners[eventType]) {
            console.log(`FONT STORE: No subscribed listener for the event type ${eventType}`);
        } else {
            this.listeners[eventType].forEach((listener) => listener(this.state));
        }
    }

    updateSelectedFont(fontName) {
        if(!fontName) {
            console.log('FONT STORE: Invalid font name!', fontName);
            return;
        } else {
            const newHistory = [fontName, ...this.state.history];
            const newHistoryFiltered = [...new Set(newHistory)].slice(0, 10);

            const newState = {
                selectedFont: fontName,
                history: newHistoryFiltered,
            }
            this.state = {...this.state, ...newState};
            this.publish('selectedFontChange');
        }
    }

    updateContent(content) {
        if(!content) {
            this.state = {...this.state, content: ""};
            this.publish('contentChange');
        } else {
            this.state = {...this.state, content: content}
            this.publish('contentChange');
        }
    }

    getState() {
        return this.state;
    }
}