const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');
let json;
let workspaceid;


/**
 * @class Delete_Watson
 * @classdesc Module to delete watson assistant workspace
 * @param RED
 */
module.exports = function(RED) {
    function deleteWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;


        /**
         * @function delete
         * @memberOf Delete_Watson
         * @description on activation from metadata node
         */
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


            /**
             * @memberOf Delete_Watson
             * @inline API call to delete workspaces.
             */
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