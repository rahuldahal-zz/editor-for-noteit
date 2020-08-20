const fetch = require("node-fetch");

exports.handler = (event, context, callback)=>{
    const API_URL = "https://api.github.com/users/rahuldahal/repos?type=owner&sort=updated";

    let dataThatCame = "nothing";

    if(event.body){
    	dataThatCame = JSON.parse(event.body).id;
    }

    fetch(API_URL)
    .then(res=>res.json())
    .then(data=>{
    	callback(null, {
	        statusCode: 200,
	        body: JSON.stringify({github: data, dataThatCame: dataThatCame})
    	})
    })
}