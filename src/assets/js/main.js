import FBLogin from "./modules/facebookLogin";
import PreLoader from "./modules/preloader";
import FlashMessage from "./modules/flashMessage";
import EditorSetup from "./modules/editorjs/editorSetup";
import ExternalResources from "./modules/externalResourcesHandler";

// styles

import "extended-normalize.css";
import "../css/style.scss";

// simple-bar custom scroll-bar

import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

// if there is a pseudo-session in localStorage, simply load the editor.

(function checkSession() {
  console.log("i run immediately!!");
  const currentTime = new Date();
  const lastLoggedIn = localStorage.getItem("lastLoggedIn");

  if (!lastLoggedIn) {
    console.log("lastLoggedIn is not present");
    return renderFBLoginScript();
  }
  if ((currentTime - new Date(lastLoggedIn)) / 1000 / 60 < 30) {
    return new EditorSetup();
  }

  console.log("lastLoggedIn has expired!");
  return renderFBLoginScript();
})();

// facebook login

function renderFBLoginScript() {
  const login = new FBLogin();
  login.init(); // gets invoked after facebook redirects to "/" with the access token

  const loginBtn = document.getElementById("loginBtn");
  const preLoader = new PreLoader(loginBtn);
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      console.log("login button is clicked");
      preLoader.show();
      // resolveAfter(3000).then((message) => {
      //   console.log(message);
      //   new EditorSetup("someTokenValue");
      // });
      login.login();
    });
  }
}

// test when offline, delete this later

// function resolveAfter(duration) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve(`${duration} has passed.`), duration);
//   });
// }

// external resources

// new ExternalResources();
