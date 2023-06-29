
exports.handler =  async(event, context) => {

    const data = require('../../data/questions.json')
    const response = JSON.stringify(data)


    return {
        statusCode:200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
            "Content-Type": "application/json"
        },


        body:response,
    }
}