module.exports = function(RED) {
    function EntityNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.name = n.name;
        this.value = n.value;
        this.values = n.values || ["test"];
        console.log("values: " + this.values)
        node.on('input', function(msg) {
            assistant.createEntity(
                {
                    workspaceId: 'fc400c02-18f5-46d5-b5a0-46d605b32898',
                    entity: this.name,
                    values: [
                    {
                        value: this.value
                    }
                    ]
                }
            )
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

    RED.nodes.registerType("entity",EntityNode);

    const AssistantV1 = require('ibm-watson/assistant/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const assistant = new AssistantV1({
        version: '2019-02-28',
        authenticator: new IamAuthenticator({
            apikey: 'NmIp0EQCOGVRA4dAoni9NosPWYsgG3b9c-xJgD3Iu4qq',
        }),
        url: 'https://gateway-lon.watsonplatform.net/assistant/api',
    });
}