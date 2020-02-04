let json;
let workspaceid;




module.exports = function(RED) {
    function deleteWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.assistant = this.context().flow.get("assistant")
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