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

  let body = JSON.parse(event.body);

  if (body && body.token) {
    let tokenFromFB = queryString.parse(body.token);
    return fetch(
      `https://graph.facebook.com/me?access_token=${tokenFromFB.access_token}&fields=id,name,first_name,last_name,picture`
    )
      .then((res) => res.json())
      .then((user) => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        });
      });
  }

  const client_id = process.env.FB_CLIENT_ID;
  const redirect_uri = process.env.FB_REDIRECT_URI;
  const state = process.env.FB_CSRF_TOKEN;

  const query = queryString.stringify({
    client_id,
    redirect_uri,
    state,
    response_type: "token",
  });

  const loginURL = `https://facebook.com/v7.0/dialog/oauth?${query}`;

  callback(null, {
    statusCode: 200,
    body: loginURL,
  });
};
