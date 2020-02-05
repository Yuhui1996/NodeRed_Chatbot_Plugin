const Watson_API = require('../scripts/chatbot_fuctions.js');
let assistant = new Watson_API().assistant;


module.exports = function(RED) {
    function EntityNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.name = n.name;
        this.value = n.value;
        this.values = n.values || ["test"];
        node.on('input', function(msg) {
            console.log("msg: " + msg);
            assistant.createEntity(
                {
                    workspaceId: msg,
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
}