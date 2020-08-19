import FBLogin from "./modules/facebookLogin";
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
    new FBLogin(FB.login); // passing the login() into the constructor
  });
}

// external resources

// new ExternalResources();
