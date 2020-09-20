import EditorSetup from "./editorjs/editorSetup";
import PreLoader from "./preloader";
import FlashMessage from "./flashMessage";
const flash = new FlashMessage();

const fullscreenLoader = new PreLoader({
  element: ".fullscreenLoader",
  cssClasses: ["preloader", "visible"],
});
const fade = new PreLoader({
  element: ".fade",
  cssClasses: ["visible"],
});

export default class FBLogin {
  constructor() {}

  init() {
    if (window.location.search) {
      // pre-loaders
      fade.show();
      fullscreenLoader.show();

      // send request to lambda /login
      fetch("/login", {
        method: "post",
        contentType: "application/json",
        body: JSON.stringify({
          code: window.location.search,
        }),
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          else throw new Error(res.status);
        })
        .then((user) => this.sendRequestToNoteIT(user))
        .catch((error) => {
          console.log(error);
          window.sessionStorage.setItem(
            "fbCodeExpired",
            "Click the 'Login' button to re-login."
          );
          return window.location.replace("/"); // because the codeFromFBRedirect may have expired.
        });
    }
  }
  sendRequestToNoteIT(user) {
    console.log("sending request to NoteIT...");
    fetch("/createContributor", {
      method: "post",
      contentType: "application/json",
      body: JSON.stringify(user),
    }).then((res) => this.handleResponse(res.status));
  }

  handleResponse(status) {
    switch (status) {
      case 202:
        window.localStorage.setItem(
          "lastLoggedIn",
          new Date().toLocaleString()
        );
        new EditorSetup();
        fullscreenLoader.hide();
        fade.hide();
        break;
    }
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
