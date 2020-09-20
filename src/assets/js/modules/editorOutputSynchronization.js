import GenerateHTML from "./editorjs/generateHTML";

export default class EditorOutputSync {
  constructor(editorAPI) {
    this.editorAPI = editorAPI;
    this.saveProgressBtn = document.getElementById("saveProgressBtn");
    this.editorContainer = document.querySelector(".editorContent__editorjs");
    this.outputContainer = document.querySelector(".editorContent__output");
    this.containerFromTop = this.editorContainer.getBoundingClientRect().top;
    this.previousBlocks = [];

    this.editorScrollContainer = document.querySelector(
      ".editorContent__editorjsWrap .simplebar-content-wrapper"
    );
    this.outputScrollContainer = document.querySelector(
      ".editorContent__outputWrap .simplebar-content-wrapper"
    );

    this.previousBlock;

    this.events();
  }

  events() {
    // user can save the progress in two ways, 1. By clicking the "save" button and 2. By pressing "Ctrl+S", while inside the editor

    this.saveProgressBtn.addEventListener("click", () => {
      this.saveToLocalStorage();
    });

    this.hasPressedCtrl = false;
    this.editorContainer.addEventListener("keyup", (e) => {
      if (e.keyCode == 17) this.hasPressedCtrl = false;
    });

    this.editorContainer.addEventListener("keydown", (e) => {
      if (e.keyCode == 17) this.hasPressedCtrl = true;
      if (this.hasPressedCtrl && e.keyCode == 83) {
        e.preventDefault();
        this.saveToLocalStorage();
      }
    });
  }

  // methods

  saveToLocalStorage() {
    this.editorAPI
      .save()
      .then((data) => {
        window.localStorage.setItem("progress", JSON.stringify(data));
        this.newBlocks = data.blocks;
        this.compareBlocks();
        this.initGiveIdTo();
        new GenerateHTML(this.outputContainer, this.newBlocks);
        this.previousBlocks = this.newBlocks;
      })
      .catch((error) => console.error(error));
  }

  compareBlocks() {
    this.previousBlockTypes = [];
    if (this.previousBlocks.length) {
      this.previousBlockTypes = this.previousBlocks.map((block) => block.type);
    }

    this.newBlockTypes = this.newBlocks.map((block) => block.type);
    this.recentBlocks = []; // may contain "newly added" or "recently deleted" blocks.

    if (this.newBlocks.length > this.previousBlocks.length) {
      this.findOddBlocks(this.newBlockTypes, this.previousBlockTypes);
    } else if (this.newBlocks.length < this.previousBlocks.length) {
      this.findOddBlocks(this.previousBlockTypes, this.newBlockTypes);
    } else {
      console.log("No blocks have been added/removed.");
    }
  }

  findOddBlocks(withGreaterLength, withLowerLength) {
    withGreaterLength.forEach((block, index) => {
      let offBy = this.recentBlocks.length;
      if (block !== withLowerLength[index + offBy]) {
        this.recentBlocks.push(block);
      }
    });
  }

  initGiveIdTo() {
    // making "key: value" pairs from the array, to eliminate repetition of values
    const blocksObj = {};
    this.recentBlocks.forEach((block) => {
      blocksObj[block] ? blocksObj[block]++ : (blocksObj[block] = 1);
    });

    // now, the array of keys(values without repetition)
    const recentBlockTypes = Object.keys(blocksObj);

    recentBlockTypes.forEach((type) => {
      let argumentObject;
      switch (type) {
        case "paragraph":
          argumentObject = {
            name: "paragraph",
            selector: ".ce-paragraph",
          };
          break;
        case "list":
          argumentObject = {
            name: "list",
            selector: ".cdx-list__item",
          };
          break;
        case "header":
          argumentObject = {
            name: "header",
            selector: ".ce-header",
          };
          break;
        case "table":
          argumentObject = {
            name: "table",
            selector: ".tc-table",
          };
          break;
      }
      giveIdTo.call(this, argumentObject);
    });
    this.scrollToClickedBlock();
  }

  scrollToClickedBlock() {
    this.PADDING_WHEN_SCROLLED_TO = 80;

    // using "mousedown" event instead of "click" because it as causing problem while selecting texts.

    this.editorContainer.addEventListener(
      "mousedown",
      (e) => this.triggerScrollOn("output", e.target),
      true
    );
    this.outputContainer.addEventListener(
      "mousedown",
      (e) => this.triggerScrollOn("editorjs", e.target),
      true
    );
  }

  triggerScrollOn(on, target) {
    // if user has not clicked on "see-output", return immediately
    if (!document.querySelector(".editorContent__output").innerHTML) {
      return;
    }

    // else, do

    if (
      this.previousBlock &&
      target.dataset.blockId === this.previousBlock.dataset.blockId
    ) {
      return;
    }

    const blockID = this.getBlockID(target);

    if (!blockID) return; // the this.getBlockID may return null

    // remove "scrolledBlock" class from previous scrolled block
    if (this.previousBlock) {
      this.previousBlock.classList.remove("beatAnimation");
    }

    let scrollContainer;

    console.log(on);

    on === "output"
      ? (scrollContainer = this.outputScrollContainer)
      : (scrollContainer = this.editorScrollContainer);

    const targetElement = (this.previousBlock = document.querySelector(
      `.editorContent__${on} [data-block-id="${blockID}"]`
    ));
    const scrollPosition = targetElement.dataset.scrollForView;
    scrollContainer.scrollTop = scrollPosition - this.PADDING_WHEN_SCROLLED_TO;
    targetElement.classList.add("beatAnimation");
  }

  getBlockID(target) {
    if (!target) return;
    let blockID = target.dataset.blockId;
    if (blockID) return blockID;

    if (
      target.tagName === "DT" &&
      target.classList.contains("descriptionTitle")
    ) {
      return this.getBlockID(target.nextElementSibling);
    } // find "blockID" on DL

    if (target.classList.contains("ce-inline-toolbar__buttons")) {
      return null;
    } // if clicked on "inline-toolbar" ignore the click

    return this.getBlockID(target.parentElement);
  }
}

export function giveIdTo({ name, selector }) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (element.innerHTML) {
      let toScrollForView =
        element.getBoundingClientRect().top - this.containerFromTop;
      element.setAttribute("data-block-id", `${name}${index}`);
      element.setAttribute("data-scroll-for-view", toScrollForView);
    }
  });
}
