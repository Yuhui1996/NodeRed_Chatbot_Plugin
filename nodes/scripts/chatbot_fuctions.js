const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');



class Watson_API {
    assistant = new AssistantV1({
        version: '2019-02-08',
        authenticator: new IamAuthenticator({
            apikey: 'iaPZHdbsoWlThg8IWVFXM1m3IWuIbJ-vyPa9DstoRT5G', //change this api key to your to modify your own workspace
        }),
        url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/0ccb889d-9dc1-4098-93e7-2be9f027d0d6',
    });


    get assistant() {
        return this.assistant;
    }

}


module.exports = Watson_API;