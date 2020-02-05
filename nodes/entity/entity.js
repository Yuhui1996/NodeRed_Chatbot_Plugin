const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');


module.exports = function(RED) {
    function EntityNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        this.name = n.name;
        this.value = n.value;
        this.values = n.values || ["test"];
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

            console.log("msg: " + msg);
            this.assistant.createEntity({
                    workspaceId: msg,
                    entity: this.name,
                    values: [{
                        value: this.value
                    }]
                })
                .then(res => {
                    console.log("name: " + this.name)
                    console.log(JSON.stringify(res, null, 2));
                })
                .catch(err => {
                    console.log(err)
                });
            msg.payload = "Entity created";
            node.send(msg);
        });
    }

    RED.nodes.registerType("entity", EntityNode);
}