const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;

module.exports = function(RED) {
    function createIntent(config) {
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

            console.log(msg);
			for (var i=0;i<config.data.length;i++) {
				example = config.data[i];
				console.log(example);
			}
            const params = {
                workspaceId: msg.payload.workspaceId,
                intent: config.name,
                description: config.description,
                examples: [{
                        text: config.example1
                    },
                    {
                        text: config.example2
                    }
                ]
            };
            this.assistant.createIntent(params)
                .then(res => {
                    console.log(JSON.stringify(res, null, 2));
                    node.send(msg);
                })
                .catch(err => {
                    node.error("Error", err);
                    console.log(err);
                });
        });
    }

    RED.nodes.registerType("createIntent", createIntent);
}