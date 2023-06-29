
exports.handler =  async(event, context) => {

    const questions = require('../../data/questions.json')
    const response = JSON.stringify(questions)

    return {
        statusCode:200,
        headers:{
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json; charset=utf-8'
        },

        body:response,
    }
}