import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import DescriptionTitle from "./descriptionTitle_inlineTool";
import WordMeaning from "./wordMeaning_inlineTool";
import MarginLeft from "./marginLeft";
import MarginTop from "./marginTop";
import GenerateOutput from "./generateOutput";
import SubmitNote from "./submitNote";

export default class EditorSetup {
  constructor(token) {
    this.token = token;
    this.loadEditor();
  }

  // events
  events() {}

  // methods

  loadEditor() {
    fetch("/_editor.html")
      .then((res) => res.text())
      .then((data) => this.replaceIndexScreen(data));
  }

  replaceIndexScreen(data) {
    const indexScreen = document.getElementById("indexScreen");
    indexScreen.parentElement.removeChild(indexScreen);
    document.body.insertAdjacentHTML("afterbegin", data);

    this.initEditor();
  }

  // Press "tab" to edit...

  initEditor() {
    const editor = new EditorJS({
      autofocus: true,

      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link", "marginTop"],
          shortcut: "CTRL+SHIFT+H",
          spellcheck: true,
          config: {
            placeholder: "Enter a Heading",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },

        list: {
          class: List,
          inlineToolbar: true,
          shortcut: "CTRL+SHIFT+L",
        },

        marker: Marker,
        dt: DescriptionTitle,
        marginLeft: MarginLeft,
        marginTop: MarginTop,
        wordMeaning: WordMeaning,

        quote: Quote,

        table: {
          class: Table,
          shortcut: "CTRL+SHIFT+8",
        },

        image: SimpleImage,
      },
    });

    editor.isReady.then(() => {
      let progress = JSON.parse(localStorage.getItem("progress"));
      if (progress) editor.render(progress);
      editor.focus();
    });

    // rendering the content

    const seeOutputBtn = document.getElementById("seeOutputBtn");
    const outputElement = document.getElementById("output");

    new GenerateOutput(editor, seeOutputBtn, outputElement); // save is also handled in that module

    // submit feature

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const output = document.getElementById("output");
        if (output.innerHTML) {
          new SubmitNote(this.token);
          return;
        } else console.warn("The output is empty. Generate the output first.");
      });
    }
  }
}
