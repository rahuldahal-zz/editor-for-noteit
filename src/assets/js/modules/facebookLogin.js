export default class FBLogin {
  constructor(loginMethod) {
    loginMethod((response) => this.statusChangeCallback(response));
  }

  // events
  events() {}

  // methods

  statusChangeCallback(response) {
    if (response.status === "connected") {
      this.testAPI()
        .then((response) => {
          console.log(JSON.stringify(response));
          fetch("https://mynoteit.herokuapp.com/api/contributors/create", {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(response),
          })
            .then((res) => {
              console.log(res);
              if (res.okay) {
                return res.json();
              } else {
                throw new Error(`The server responded with ${res.status}`);
              }
            })
            .then((data) => this.handleAuthentication(true, data))
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    } else this.handleAuthentication(false);
  }

  checkLoginState() {
    console.log("login button fires this function");
    FB.getLoginStatus(function (response) {
      this.statusChangeCallback(response);
    });
  }

  handleAuthentication(isLoggedIn, data) {
    if (isLoggedIn) {
      console.log("Authenticated. Now, use [data] to proceed to /editor page");
    } else console.log("You are not authenticated");
  }

  testAPI() {
    return new Promise((resolve, reject) => {
      // code
      FB.api("/me?fields=id,name,first_name,last_name,picture", function (
        user
      ) {
        if (user && !user.error) {
          console.log(user);
          return resolve(user);
        } else {
          reject(user.error);
        }
      });
    });
  }
}
