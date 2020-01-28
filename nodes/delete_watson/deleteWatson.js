const Watson_API = require('../scripts/chatbot_fuctions.js');
let wa = new Watson_API();
let json;
let workspaceid;




module.exports = function(RED) {
    function deleteWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            wa.assistant.listWorkspaces()
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    for (let i = 0; i < object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name == msg.payload) {
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