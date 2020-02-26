const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;


module.exports = function (RED) {
    function createDialog(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        this.name = n.name;
        this.intentName = n.intentName;
        this.intentDescription = n.intentDescription;
        node.on('input', function (msg) {
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

            //for creating dialog node
            let params = {
                workspaceId: msg.payload.workspaceId,
                parent: msg.payload.nodeID,
                dialogNode: n.name.toLowerCase(), //needs to be unique
                conditions: n.dialog_type + n.dialog_value,
                title: n.name
            }

            this.assistant.createDialogNode(params)
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    let object = JSON.parse(json);
                    let nodeID = n.name.toLowerCase();
                    msg.payload.nodeID = nodeID;

                    node.send(msg);
                })
                .catch(err => {
                    console.log(err)
                });
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
        });
    }

    RED.nodes.registerType("dialog", createDialog);


}