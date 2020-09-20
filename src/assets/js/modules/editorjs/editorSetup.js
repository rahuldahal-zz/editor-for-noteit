import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import DescriptionTitle from "./plugins/descriptionTitle_inlineTool";
import WordMeaning from "./plugins/wordMeaning_inlineTool";
import MarginLeft from "./plugins/marginLeft";
import MarginTop from "./plugins/marginTop";
import SubmitNote from "./submitNote";
import FlashMessage from "../flashMessage";
import EditorOutputSync from "../editorOutputSynchronization";

export default class EditorSetup {
  constructor() {
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
    const indexScreen = document.querySelector(".indexScreen");
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
      if (progress) {
        editor
          .render(progress)
          .then(() => {
            editor.focus();
            // editor and output synchronization
            new EditorOutputSync(editor);
          })
          .catch((error) =>
            console.log("error while retrieving 'progress' from storage.")
          );
      } else {
        // editor and output synchronization
        new EditorOutputSync(editor);
      }
    });

    // submit feature

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const output = document.querySelector(".editorContent__output");
        if (output.innerHTML) {
          new SubmitNote();
          return;
        } else {
          console.warn("The output is empty. Generate the output first.");
          new FlashMessage().warning(
            "You've not saved your progress. Click on the editor and press <kbd>Ctrl+S</kbd> to save."
          );
        }
      });
    }
  }
}
