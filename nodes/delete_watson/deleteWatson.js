const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');
const api_origional = 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W';
const instance_origional = 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381';

let json;
let workspaceid;




module.exports = function(RED) {
    function deleteWatson(config) {
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
            this.assistant.listWorkspaces()
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    for (let i = 0; i < object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name == msg.payload.chatbot_name) {
                            console.log(object.result.workspaces[i].name);
                            const params = {
                                workspaceId: object.result.workspaces[i].workspace_id,
                            };
                            this.assistant.deleteWorkspace(params)
                                .then(res => {
                                    console.log(JSON.stringify(res, null, 2));
                                })
                                .catch(err => {
                                    console.log(err)
                                });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });



        });



    }

    RED.nodes.registerType("deleteWatson", deleteWatson);
}