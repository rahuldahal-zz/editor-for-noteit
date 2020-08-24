import FBLogin from "./modules/facebookLogin";
window.FB = undefined; // defining FB manually, just to get access to it on network failure.
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

// facebook login

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    console.log("login button is clicked");
    if (!FB) {
      console.log("Hey");
      return new FlashMessage().error(
        "The browser cannot connect to the internet, check your connection."
      );
    }
    new PreLoader(loginBtn).show();
    // resolveAfter(3000).then((message) => {
    //   console.log(message);
    //   new EditorSetup("someTokenValue");
    // });
    new FBLogin(FB.login); // passing the login() into the constructor
  });
}

// test when offline, delete this later

// function resolveAfter(duration) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve(`${duration} has passed.`), duration);
//   });
// }

// external resources

// new ExternalResources();
