const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

exports.handler = (event, context, callback)=>{
    const API_URL = process.env.GITHUB_TEST_API;

    const dataThatCame = event.body.id;

    fetch(API_URL)
    .then(res=>res.json())
    .then(data=>{
    	callback(null, {
	        statusCode: 200,
	        body: JSON.stringify({github: data, dataThatCame: dataThatCame})
    	})
    })
}