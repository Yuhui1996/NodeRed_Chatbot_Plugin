const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');
const api_origional = 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W';
const instance_origional = 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381';

let workspaceid;
let json;
module.exports = function(RED) {



    function createWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        try {
            this.assistant = this.context().flow.get("assistant");
        } catch (e) {
            console.log("context not found");
        } finally {
            if (this.assistant == null || this.assistant == undefined) {
                this.assistant = new AssistantV1({
                    version: '2019-02-08',
                    authenticator: new IamAuthenticator({
                        apikey: api_origional,
                    }),
                    url: instance_origional
                });
            }
        }



        node.on('input', function(msg) {
            const workspace = {
                name: msg.payload.chatbot_name,
                description: 'this is the first chatbot created using node.js'
            }
            this.assistant.createWorkspace(workspace)
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    let object = JSON.parse(json);
                    workspaceid = object.result.workspace_id;
                    node.send(workspaceid); //send workspace id to next
                })
                .catch(err => {
                    console.log(err)
                });
        });
    }

    RED.nodes.registerType("createWatson", createWatson);



}