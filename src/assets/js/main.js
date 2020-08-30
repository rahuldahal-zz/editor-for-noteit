import FBLogin from "./modules/facebookLogin";
import PreLoader from "./modules/preloader";
import FlashMessage from "./modules/flashMessage";
import EditorSetup from "./modules/editorjs/editorSetup";
import ExternalResources from "./modules/externalResourcesHandler";

// const fullscreen = new PreLoader({
//   element: "#fullscreenLoader",
//   cssClasses: ["preloader", "visible"],
// });

// fullscreen.show();

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
    hasFBCodeExpired();
    return renderFBLoginScript();
  }
  if ((currentTime - new Date(lastLoggedIn)) / 1000 / 60 < 30) {
    return new EditorSetup();
  }

  console.log("lastLoggedIn has expired!");
  localStorage.removeItem("lastLoggedIn");
  hasFBCodeExpired();
  return renderFBLoginScript();
})();

// facebook login

function renderFBLoginScript() {
  const login = new FBLogin();
  login.init(); // gets invoked after facebook redirects to "/" with the access token

  const loginBtn = document.getElementById("loginBtn");
  const preLoader = new PreLoader({
    element: loginBtn,
    cssClasses: ["preloader", "preloader--accent"],
  });
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      console.log("login button is clicked");
      preLoader.show();
      // resolveAfter(3000).then((message) => {
      //   console.log(message);
      //   new EditorSetup();
      // });
      login.login();
    });
  }
}

// if "fbCodeExpired" is set on sessionStorage, warn user to re-login
function hasFBCodeExpired() {
  const fbCodeExpired = sessionStorage.getItem("fbCodeExpired");
  if (fbCodeExpired) {
    new FlashMessage().warning(fbCodeExpired);
    sessionStorage.removeItem("fbCodeExpired");
  }
}

// test when offline, delete this later

function resolveAfter(duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${duration} has passed.`), duration);
  });
}

// external resources

// new ExternalResources();
