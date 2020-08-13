import FBLogin from "./modules/facebookLogin";
import ExternalResources from "./modules/externalResourcesHandler";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import DescriptionTitle from "./modules/editorjs/descriptionTitle_inlineTool";
import WordMeaning from "./modules/editorjs/wordMeaning_inlineTool";
import MarginLeft from "./modules/editorjs/marginLeft";
import MarginTop from "./modules/editorjs/marginTop";
import GenerateOutput from "./modules/editorjs/generateOutput";

// styles

import "extended-normalize.css";
import "../css/style.scss";

// simple-bar custom scroll-bar

import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

// facebook login starts
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    console.log("login button is clicked");
    new FBLogin(FB.login); // passing the login() into the constructor
  });
}
// facebook login ends

// Press "tab" to edit...

if (document.getElementById("editorjs")) {
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

  console.log(editor);

  editor.isReady.then(() => savedDataHandler());

  function savedDataHandler() {
    // get the saved data and populate it into editorjs container

    let savedData = window.localStorage.getItem("progress");
    if (savedData) {
      editor.render(JSON.parse(savedData));
    }
  }

  // rendering the content

  const seeOutputBtn = document.getElementById("seeOutputBtn");
  const outputElement = document.getElementById("output");

  new GenerateOutput(editor, seeOutputBtn, outputElement); // save function is also handled in this module
}

// external resources

// new ExternalResources();
