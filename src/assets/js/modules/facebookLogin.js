import EditorSetup from "./editorjs/editorSetup";

export default class FBLogin {
  constructor(loginFunctionProvidedByFB) {
    loginFunctionProvidedByFB((response) =>
      this.statusChangeCallback(response)
    );
  }

  // events
  events() {}

  // methods

  statusChangeCallback(response) {
    if (response.status === "connected") {
      let statusFromNoteIT;
      this.testAPI()
        .then((response) => {
          // use this API via the lambda function
          fetch("/createContributor", {
            method: "post",

            //make sure to serialize your JSON body
            body: JSON.stringify(response),
          })
            .then((res) => {
              statusFromNoteIT = res.status;
              if (res.ok) {
                console.log(res);
                return res.text(); // the lambda sends JSON string.
              } else {
                throw new Error(`The server responded with ${res.status}`);
              }
            })
            .then((data) =>
              this.handleAuthentication(true, {
                status: statusFromNoteIT,
                data: JSON.parse(data),
              })
            )
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

  handleAuthentication(isLoggedIn, { status, data }) {
    if (!isLoggedIn) {
      return console.log("You are not authenticated");
    }

    console.log(status, data);
    if (status === 202) {
      console.log(data.success); // already exists and is approved
      new EditorSetup(data.success);
    } else if (status === 201) {
      console.log(data); // Created but not approved yet.
    } else if (status === 200) {
      console.log(data); // already exists but not approved.
    } else {
      throw new Error("bogus status code is received!!");
    }
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
