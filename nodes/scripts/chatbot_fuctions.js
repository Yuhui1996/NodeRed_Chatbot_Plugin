const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');



class Watson_API {
    assistant = new AssistantV1({
        version: '2019-02-08',
        authenticator: new IamAuthenticator({
            apikey: 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W', //change this api key to your to modify your own workspace
        }),
        url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381',
    });
    constructor() {

    }



    get assistant() {
        return this.assistant;
    }

}


module.exports = Watson_API;


// // const AssistantV1 = require('ibm-watson/assistant/v1');
//
// const {
//     IamAuthenticator
// } = require('ibm-watson/auth');
//
//
// // 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W'
// // 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381'
// class Watson_API {
//     constructor(apikey, apiurl) {
//         assistant = new AssistantV1({
//             version: '2019-02-08',
//             authenticator: new IamAuthenticator({
//                 apikey: apikey, //change this api key to your to modify your own workspace
//             }),
//             url: apiurl,
//         });
//     }
//
//
//
//     get assistant() {
//         return this.assistant;
//     }
//
// }
//
//
// module.exports = Watson_API;