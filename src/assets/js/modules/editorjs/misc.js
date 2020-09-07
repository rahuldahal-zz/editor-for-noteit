export default class Miscellaneous {
  constructor() {
    this.editorScrollContainer = document.querySelector("#editorjsWrap ");
    this.outputScrollContainer = document.querySelector(
      "#outputWrap .simplebar-content-wrapper"
    );
  }

  // methods
  giveIDToEditableItems() {
    const paragraphs = document.querySelectorAll(".ce-paragraph");
    const listItems = document.querySelectorAll(".cdx-list__item");
    const headers = document.querySelectorAll(".ce-header");
    const tables = document.querySelectorAll(".tc-table");

    const editableItems = [...paragraphs, ...listItems, ...headers, ...tables];
    editableItems.forEach((item, index) => {
      item.setAttribute("data-block-id", `block${index}`);
    });
  }
}
