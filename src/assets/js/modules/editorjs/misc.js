export default class Miscellaneous {
  constructor() {
    this.editorContainer = document.querySelector("#editorjsWrap ");
    this.outputContainer = document.querySelector("#outputWrap ");
    this.editorScrollContainer = document.querySelector(
      "#editorjsWrap .simplebar-content-wrapper"
    );
    this.outputScrollContainer = document.querySelector(
      "#outputWrap .simplebar-content-wrapper"
    );
    this.scrollToClickedBlock();
  }

  // methods
  giveIDToEditableItems() {
    const paragraphs = document.querySelectorAll(".ce-paragraph");
    const listItems = document.querySelectorAll(".cdx-list__item");
    const headers = document.querySelectorAll(".ce-header");
    const tables = document.querySelectorAll(".tc-table");

    const editableItems = [...paragraphs, ...listItems, ...headers, ...tables];
    const containerFromTop = this.editorContainer.getBoundingClientRect().top;
    editableItems.forEach((item, index) => {
      let toScrollForView = item.getBoundingClientRect().top - containerFromTop;
      item.setAttribute("data-block-id", `block${index}`);
      item.setAttribute("data-scroll-for-view", toScrollForView);
    });
  }

  scrollToClickedBlock() {
    this.PADDING_WHEN_SCROLLED_TO = 80;
    this.editorContainer.addEventListener(
      "click",
      (e) => this.triggerScrollOn("output", e.target),
      true
    );
    this.outputContainer.addEventListener(
      "click",
      (e) => this.triggerScrollOn("editorjs", e.target),
      true
    );
  }

  triggerScrollOn(on, target) {
    const blockID = this.getBlockID(target);

    // remove "scrolledBlock" class from previous scrolled block
    if (this.previousBlock) {
      this.previousBlock.classList.remove("beatAnimation");
    }

    let scrollContainer;

    on === "output"
      ? (scrollContainer = this.outputScrollContainer)
      : (scrollContainer = this.editorScrollContainer);

    const targetElement = (this.previousBlock = document.querySelector(
      `#${on} [data-block-id="${blockID}"]`
    ));
    const scrollPosition = targetElement.dataset.scrollForView;
    scrollContainer.scrollTop = scrollPosition - this.PADDING_WHEN_SCROLLED_TO;
    targetElement.classList.add("beatAnimation");
  }

  getBlockID(target) {
    let blockID = target.dataset.blockId;
    if (blockID) return blockID;
    return this.getBlockID(target.parentElement);
  }
}
