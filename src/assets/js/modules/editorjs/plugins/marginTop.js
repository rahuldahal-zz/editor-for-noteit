export default class MarginTop {
  static get isInline() {
    return true;
  }

  static get CSS() {
    return "mt2rem";
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;
    this.buttonIcon =
      '<svg height="12px" viewBox="0 -10 490.66667 490" width="14px" style="transform: rotate(90deg);" xmlns="http://www.w3.org/2000/svg"><path d="m469.332031 43h-426.664062c-11.777344 0-21.335938-9.558594-21.335938-21.332031 0-11.777344 9.558594-21.335938 21.335938-21.335938h426.664062c11.777344 0 21.335938 9.558594 21.335938 21.335938 0 11.773437-9.558594 21.332031-21.335938 21.332031zm0 0"/><path d="m469.332031 149.667969h-213.332031c-11.777344 0-21.332031-9.558594-21.332031-21.335938 0-11.773437 9.554687-21.332031 21.332031-21.332031h213.332031c11.777344 0 21.335938 9.558594 21.335938 21.332031 0 11.777344-9.558594 21.335938-21.335938 21.335938zm0 0"/><path d="m469.332031 256.332031h-213.332031c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h213.332031c11.777344 0 21.335938 9.554687 21.335938 21.332031s-9.558594 21.332031-21.335938 21.332031zm0 0"/><path d="m469.332031 363h-213.332031c-11.777344 0-21.332031-9.558594-21.332031-21.332031 0-11.777344 9.554687-21.335938 21.332031-21.335938h213.332031c11.777344 0 21.335938 9.558594 21.335938 21.335938 0 11.773437-9.558594 21.332031-21.335938 21.332031zm0 0"/><path d="m469.332031 469.667969h-426.664062c-11.777344 0-21.335938-9.558594-21.335938-21.335938 0-11.773437 9.558594-21.332031 21.335938-21.332031h426.664062c11.777344 0 21.335938 9.558594 21.335938 21.332031 0 11.777344-9.558594 21.335938-21.335938 21.335938zm0 0"/><path d="m186.902344 223.265625-74.667969-69.332031c-4.671875-4.332032-11.457031-5.441406-17.300781-2.945313-5.824219 2.539063-9.601563 8.300781-9.601563 14.679688v48h-64c-11.796875 0-21.332031 9.554687-21.332031 21.332031s9.535156 21.332031 21.332031 21.332031h64v48c0 6.359375 3.777344 12.117188 9.601563 14.679688 2.070312.875 4.222656 1.320312 6.398437 1.320312 3.96875 0 7.875-1.46875 10.902344-4.265625l74.667969-69.332031c3.242187-3.050781 5.097656-7.296875 5.097656-11.734375s-1.855469-8.703125-5.097656-11.734375zm0 0"/></svg>';

    this.tag = "span";
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.innerHTML = this.buttonIcon;
    this.button.classList.add(this.iconClasses.base);

    return this.button;
  }

  surround(range) {
    if (!range) return;

    let parentElement = range.startContainer.parentElement;

    if (parentElement.classList.contains("mt2rem")) {
      this.unwrap(range);
      this.button.classList.add(this.iconClasses.active);
      return;
    } else {
      this.wrap(range, parentElement);
      return;
    }
  }

  wrap(range, parentElement) {
    const selectedText = range.extractContents();

    const mark =
      parentElement.localName === this.tag
        ? parentElement
        : parentElement.children[0].tagName.toLowerCase() === this.tag
        ? parentElement.children[0]
        : document.createElement(this.tag);

    mark.classList.add("mt2rem");
    mark.appendChild(selectedText);

    if (mark !== parentElement && mark !== parentElement.children[0]) {
      range.insertNode(mark);
    }

    this.api.selection.expandToTag(mark);
  }

  unwrap(range) {
    console.log(range);

    let selectedTag = range.startContainer.parentElement;
    if (selectedTag.classList.length === 1) {
      let parentOfSelectedTag = selectedTag.parentElement;
      let textContent = range.extractContents();

      // // remove empty term-tag ... see https://github.com/editor-js/marker/blob/master/src/index.js

      parentOfSelectedTag.removeChild(selectedTag);

      // insert extracted content

      range.insertNode(textContent);
    } else {
      selectedTag.classList.remove("mt2rem");
    }
  }

  checkState(selection) {
    let termWrapper = this.api.selection.findParentTag(this.tag, "mt2rem");
    this.button.classList.toggle(this.iconClasses.active, !!termWrapper);
  }

  /**
   * @returns an element object with a class, the same element that was used to "wrap", <span>, <dt>, etc.
   */

  static get sanitize() {
    return {
      span: {
        class: "mt2rem",
      },
    };
  }
}
