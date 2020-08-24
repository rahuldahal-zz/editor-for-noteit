import EditorSetup from "./editorjs/editorSetup";
import FlashMessage from "./flashMessage";
const flash = new FlashMessage();

export default class FBLogin {
  constructor() {}

  init() {
    if (window.location.hash) {
      fetch("/login", {
        method: "post",
        contentType: "application/json",
        body: JSON.stringify({
          token: window.location.hash,
        }),
      })
        .then((res) => res.json())
        .then((user) => this.sendRequestToNoteIT(user));
    }
  }
  sendRequestToNoteIT(user) {
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
            new EditorSetup(data.success);
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
      .catch((error) => console.error(error));
  }

  redirectToFacebook(url) {
    console.log(url);
    window.location.replace(url);
  }
}
