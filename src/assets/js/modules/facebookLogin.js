import EditorSetup from "./editorjs/editorSetup";
import FlashMessage from "./flashMessage";
const flash = new FlashMessage();

export default class FBLogin {
  constructor() {}

  init() {
    if (window.location.search) {
      fetch("/login", {
        method: "post",
        contentType: "application/json",
        body: JSON.stringify({
          code: window.location.search,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw new Error(res.status);
        })
        .then((user) => this.sendRequestToNoteIT(user))
        .catch((error) => {
          console.log(error);
          return window.location.replace("/"); // because the codeFromFBRedirect may have expired.
        });
    }
  }
  sendRequestToNoteIT(user) {
    console.log("sending request to NoteIT...");
    let statusFromNoteIT;
    fetch("/createContributor", {
      method: "post",
      contentType: "application/json",
      body: JSON.stringify(user),
    })
      .then((res) => {
        statusFromNoteIT = res.status;
        return res.text();
      })
      .then((data) => {
        switch (statusFromNoteIT) {
          case 202:
            window.localStorage.setItem(
              "lastLoggedIn",
              new Date().toLocaleString()
            );
            new EditorSetup(data.success);
            break;
        }
      });
  }

  // fresh login

  login() {
    fetch("/login", {
      method: "post",
      body: JSON.stringify(null),
    })
      .then((res) => res.text())
      .then((url) => this.redirectToFacebook(url))
      .catch((error) => {
        console.error(error);
        flash.error(error);
      });
  }

  redirectToFacebook(url) {
    console.log(url);
    window.location.replace(url);
  }
}
