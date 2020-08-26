const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

exports.handler = (event, context, callback) => {
  if (event.httpMethod !== "POST") {
    return callback(null, {
      statusCode: 400,
    });
  }

  console.log("the incoming body data is: ", event.body);
  const responseFromFacebook = event.body;

  const API_URL = process.env.API_CREATE_CONTRIBUTOR_URL;

  // the "callback" is used to send response back to the client.

  function sendToClient({ status, data }) {
    return callback(null, {
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
      if (
        statusFromNoteIT === 202 ||
        statusFromNoteIT === 201 ||
        statusFromNoteIT === 200
      ) {
        return res.json();
      } else {
        throw new Error(`The server responded with ${statusFromNoteIT}`);
      }
    })
    .then((data) => {
      console.log(data);
      if (statusFromNoteIT === 202) {
        return callback(null, {
          statusCode: statusFromNoteIT,
          headers: {
            "Set-Cookie": `token=${data.success}; httpOnly=true; max-age=1800; sameSite=strict`,
          },
        });
      } else {
        sendToClient({
          status: statusFromNoteIT,
          data: data,
        });
      }
    })
    .catch((error) =>
      sendToClient({
        status: statusFromNoteIT,
        data: error,
      })
    );
};
