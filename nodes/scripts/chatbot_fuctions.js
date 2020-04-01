const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');


/**
 * @class Watson_API
 * @description Class representing a function to create the Chatbot key and retain it
 * @Deprecated Now implementing into the main class
 */
class Watson_API {
    assistant = new AssistantV1({
        version: '2019-02-08',
        authenticator: new IamAuthenticator({

            apikey: 'NmIp0EQCOGVRA4dAoni9NosPWYsgG3b9c-xJgD3Iu4qq', //change this api key to your to modify your own workspace
        }),
        url: 'https://gateway-lon.watsonplatform.net/assistant/api',

    });


    /**
     * @memberOf Watson_API
     * @deprecated
     * @function Fetch old assistant
     * @returns {AssistantV1 | AssistantV1}
     */
    get assistant() {
        return this.assistant;
    }

}


module.exports = Watson_API;