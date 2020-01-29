const Watson_API = require('../scripts/chatbot_fuctions.js');
let wa = new Watson_API();

module.exports = function(RED) {


    function createWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {

            const workspace = {
                name: msg.payload,
                description: 'this is the first chatbot created using node.js'

            }
            wa.assistant.createWorkspace(workspace)
                .then(res => {
                    console.log(JSON.stringify(res, null, 2));
                })
                .catch(err => {
                    console.log(err)
                });
            node.send('success');

        });



    }

    RED.nodes.registerType("createWatson", createWatson);
}