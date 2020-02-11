const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;
let json;

module.exports = function(RED) {



    function createWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {

            try {
                this.assistant = this.context().flow.get("assistant");
            } catch (e) {
                console.log("context not found");
            } finally {
                if (this.assistant == null || this.assistant == undefined) {
                    this.assistant = new AssistantV1({
                        version: '2019-02-08',
                        authenticator: new IamAuthenticator({
                            apikey: msg.payload.wa_api_key,
                        }),
                        url: msg.payload.instance_url
                    });
                }
            }
            const workspace = {
                name: msg.payload.chatbot_name,
                description: 'this is the first chatbot created using node.js'
            }




            this.assistant.listWorkspaces()
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    for (let i = 0; i < object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name ==msg.payload.chatbot_name) {//if the workspce exist
                            console.log(object.result.workspaces[i].name);
                            const workspace_to_delete = {
                                workspaceId: object.result.workspaces[i].workspace_id,
                            };
                            this.assistant.deleteWorkspace(workspace_to_delete)
                                .then(res => {
                                    console.log("delete success");
                                })
                                .catch(err =>{
                                    console.log(err);
                                });
                        }

                    }
                    this.assistant.createWorkspace(workspace)
                        .then(res => {
                            json = JSON.stringify(res, null, 2);
                            let object = JSON.parse(json);
                            workspaceid = object.result.workspace_id;
                            msg.payload.workspaceId = workspaceid;
                            node.send(msg); //send workspace id to next

                        })
                        .catch(err =>{
                            console.log(err);
                        });

                })
                .catch(err => {
                    console.log(err);
                });



        });
    }


    RED.nodes.registerType("createWatson", createWatson);



}
