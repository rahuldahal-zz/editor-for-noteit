const fetch = require("node-fetch");
const queryString = require("query-string");
const dotenv = require("dotenv");
dotenv.config();

exports.handler = (event, context, callback) => {
  if (event.httpMethod !== "POST") {
    return callback(null, {
      statusCode: 400,
    });
  }

  const client_id = process.env.FB_CLIENT_ID;
  const client_secret = process.env.FB_CLIENT_SECRET;
  const redirect_uri = process.env.FB_REDIRECT_URI;
  const state = process.env.FB_CSRF_TOKEN;

  let body = JSON.parse(event.body);

  if (body && body.code) {
    exchangeCodeForToken();
  } else {
    sendOAuthURL();
  }

  function exchangeCodeForToken() {
    let codeFromFB = queryString.parse(body.code);
    fetch(
      `https://graph.facebook.com/v8.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${codeFromFB.code}`
    )
      .then((res) => {
        if (res.ok) {
          console.log("I expire after use...");
          return res.json();
        }
        return new Error("generic error message here...");
      })
      .then((accessToken) => getUserDetails(accessToken))
      .catch((error) =>
        callback(null, {
          statusCode: 400,
          body: error,
        })
      );
  }

  function getUserDetails({ access_token }) {
    fetch(
      `https://graph.facebook.com/me/?access_token=${access_token}&fields=id,email,first_name,last_name,name,picture`
    )
      .then((res) => {
        return res.json();
      })
      .then((user) => {
        console.log(user.name);
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        });
      })
      .catch((error) => console.log(error));
  }

  function sendOAuthURL() {
    const query = queryString.stringify({
      client_id,
      redirect_uri,
      state,
      response_type: "code",
    });

    const loginURL = `https://facebook.com/v7.0/dialog/oauth?${query}`;

    return callback(null, {
      statusCode: 200,
      body: loginURL,
    });
  }
};
