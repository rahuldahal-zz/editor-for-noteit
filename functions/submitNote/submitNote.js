const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

function extractCookie(cookieString, name) {
  const pattern = `${name}=[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$`;
  const regexExtract = cookieString.match(new RegExp(pattern));
  return regexExtract.toString().split(`${name}=`)[1];
}

exports.handler = (event, context, callback) => {
  if (event.httpMethod !== "POST") {
    return callback(null, {
      statusCode: 400,
    });
  }

  console.log("cookie from browser is", event.headers.cookie);

  let dataFromClient = JSON.parse(event.body);
  dataFromClient.token = extractCookie(event.headers.cookie, "token");

  console.log(dataFromClient);

  const API_URL = process.env.API_SUBMIT_NOTE_URL;

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
    body: JSON.stringify(dataFromClient),
  })
    .then((res) => {
      console.log(res);
      statusFromNoteIT = res.status;
      if (res.ok) {
        return res.json();
      }
      throw new Error(`The server responded with ${statusFromNoteIT}`);
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
