export default class WordMeaning {
  static get isInline() {
    return true;
  }

  static get CSS() {
    return "difficultWord";
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;

    this.tag = "span";
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.textContent = "WM";
    this.button.classList.add(this.iconClasses.base);

    return this.button;
  }

  renderActions() {
    this.meaningElement = document.createElement("input");
    this.meaningElement.type = "text";
    this.meaningElement.placeholder = "Type the meaning here...";
    this.meaningElement.classList.add("inlineTool__input");
    this.meaningElement.hidden = true;

    return this.meaningElement;
  }

  showActions(range) {
    this.meaningElement.hidden = false;
    this.meaningElement.addEventListener("blur", () =>
      this.wrap(range, this.meaningElement.value)
    );
  }

  surround(range) {
    if (!range) return;

    let parentElement = range.startContainer.parentElement;

    console.log(parentElement, range);

    if (parentElement.classList.contains("difficultWord")) {
      this.unwrap(range);
      return;
    } else {
      this.showActions(range);
      return;
    }
  }

  wrap(range, meaning) {
    const selectedText = range.extractContents();

    const mark = document.createElement(this.tag);
    mark.classList.add(WordMeaning.CSS);
    mark.appendChild(selectedText);
    mark.dataset.meaning = meaning;
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
  }

  unwrap(range) {
    console.log(range);

    let selectedTag = range.startContainer.parentElement;
    let parentOfSelectedTag = selectedTag.parentElement;
    let textContent = range.extractContents();

    console.log(textContent);

    // // remove empty term-tag ... see https://github.com/editor-js/marker/blob/master/src/index.js

    parentOfSelectedTag.removeChild(selectedTag);

    // insert extracted content on that exact range.

    range.insertNode(textContent);
  }

  checkState(selection) {
    let termWrapper = this.api.selection.findParentTag(
      this.tag,
      WordMeaning.CSS
    );
    this.button.classList.toggle(this.iconClasses.active, !!termWrapper);
  }

  static get sanitize() {
    return {
      span: true,
    };
  }
}

// WordMeaning.DataSet();
