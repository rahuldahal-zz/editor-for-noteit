export default class DescriptionTitle {
    static get isInline() { return true; }

    static get CSS() {
        return 'helloStyle';
    };

    constructor({ api }) {
        this.api = api;
        this.button = null;

        this.tag = "dt";
        this.iconClasses = {
            base: this.api.styles.inlineToolButton,
            active: this.api.styles.inlineToolButtonActive
        }
    }


    render() {
        this.button = document.createElement("button");
        this.button.type = "button";
        this.button.textContent = "DT";
        this.button.classList.add(this.iconClasses.base);

        return this.button;
    }


    surround(range) {

        if (!range) return;

        let parentElement = range.startContainer.parentElement.localName;


        if (parentElement === this.tag) {
            this.unwrap(range);
            return;
        } else {
            this.wrap(range);
            return;
        }





    }

    wrap(range) {
        const selectedText = range.extractContents();

        const mark = document.createElement(this.tag);
        mark.classList.add(DescriptionTitle.CSS);
        mark.appendChild(selectedText);
        range.insertNode(mark);

        this.api.selection.expandToTag(mark);
    }

    unwrap(range) {
        console.log(range);

        let selectedTag = range.startContainer.parentElement;
        let parentOfSelectedTag = selectedTag.parentElement;
        let textContent = range.startContainer.textContent;

        console.log(textContent);

        // // remove empty term-tag ... see https://github.com/editor-js/marker/blob/master/src/index.js

        parentOfSelectedTag.removeChild(selectedTag);

        // insert extracted content 

        parentOfSelectedTag.insertAdjacentHTML("afterbegin", textContent);
        // sel.removeAllRanges();
        // sel.addRange(range);

    }

    checkState(selection) {
        let termWrapper = this.api.selection.findParentTag(this.tag, DescriptionTitle.CSS);
        this.button.classList.toggle(this.iconClasses.active, !!termWrapper);

    }

    static get sanitize() {
        return {
            dt: {
                class: DescriptionTitle.CSS
            }
        };
    }
}