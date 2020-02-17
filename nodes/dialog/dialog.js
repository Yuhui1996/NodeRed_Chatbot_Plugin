const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;



module.exports = function(RED) {
    function createDialog(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        this.name = n.name;
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

            console.log(msg);
            // const params = {
            //     workspaceId: msg.payload.workspaceId,
            //     intent: n.name,
            //     description: n.description,
            //     examples: [{
            //             text: n.example1
            //         },
            //         {
            //             text: n.example2
            //         }
            //     ]
            // };
            // this.assistant.createIntent(params)
            //     .then(res => {
            //         console.log(JSON.stringify(res, null, 2));
            //         node.send(msg);
            //     })
            //     .catch(err => {
            //         node.error("Error", err);
            //         console.log(err);
            //     });
            console.log(this.name);
        });
    }

    RED.nodes.registerType("dialog", createDialog);



}