const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

exports.handler = (event, context, callback) => {
  console.log("the incoming body data is: ", event.body);
  const responseFromFacebook = event.body;

  const API_URL = process.env.API_CREATE_CONTRIBUTOR_URL;

  // the "callback" is used to send response back to the client.

  function sendToClient({ status, data }) {
    callback(null, {
      statusCode: status,
      body: JSON.stringify(data),
    });
  }

  let statusFromNoteIT;

  fetch(API_URL, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: responseFromFacebook,
  })
    .then((res) => {
      console.log(res);
      statusFromNoteIT = res.status;
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`The server responded with ${res.status}`);
      }
    })
    .then((data) =>
      sendToClient({
        status: statusFromNoteIT,
        data: data,
      })
    )
    .catch((error) =>
      sendToClient({
        status: statusFromNoteIT,
        data: error,
      })
    );
};
