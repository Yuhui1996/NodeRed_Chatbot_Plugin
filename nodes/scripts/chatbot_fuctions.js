const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');



class Watson_API {
    assistant = new AssistantV1({
        version: '2019-02-08',
        authenticator: new IamAuthenticator({
            apikey: '1U3GTvddnyKkL5u9v0rceQaoyrP90GJTNX-rNbHbpe50', //change this api key to your to modify your own workspace
        }),
        url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/c5381a07-e2d8-499d-a664-69bed2ae64e9',
    });


    get assistant() {
        return this.assistant;
    }

}


module.exports = Watson_API;