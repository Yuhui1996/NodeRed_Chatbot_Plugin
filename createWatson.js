
const AssistantV1 = require('ibm-watson/assistant/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const assistant = new AssistantV1({
    version: '2019-02-08',
    authenticator: new IamAuthenticator({
        apikey: 'mHBe7hP3EvS--SAOe8fBSDRhTp78W__ZOL7iqfjMzUvf',
    }),
    url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/4cc1d037-5230-4352-b3e4-dd74ede3951c',
});

module.exports = function (RED) {


    function createWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {

            const workspace = {
                name: msg.payload,
                description: 'this is the first chatbot created using node.js'

            }
            assistant.createWorkspace(workspace)
                .then(res => {
                    console.log(JSON.stringify(res, null, 2));
                })
                .catch(err => {
                    console.log(err)
                });
            node.send('success');

        });



    }

    RED.nodes.registerType("createWatson", createWatson);
}