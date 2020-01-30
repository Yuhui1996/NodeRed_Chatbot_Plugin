const Watson_API = require('../scripts/chatbot_fuctions.js');

let json;
let workspaceid;




module.exports = function(RED) {
    function deleteWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {

            wa = new Watson_API(msg.payload.api_key, msg.payload.instance);

            wa.assistant.listWorkspaces()
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    console.log("This is the assisntant" + wa);
                    for (let i = 0; i < object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name == msg.payload.chatbotName) {
                            console.log(object.result.workspaces[i].name);
                            const params = {
                                workspaceId: object.result.workspaces[i].workspace_id,
                            };
                            wa.assistant.deleteWorkspace(params)
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