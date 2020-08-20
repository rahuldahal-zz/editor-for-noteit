exports.handler = (event, context, callback)=>{
    const message = {
        favNum = 9
    };

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(message)
    })
}