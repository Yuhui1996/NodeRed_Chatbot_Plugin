const Watson_API = require('../scripts/chatbot_fuctions.js');
let wa = new Watson_API();
let workspaceid;
let json;
module.exports = function(RED) {


        function createWatson(config) {
            RED.nodes.createNode(this, config);
            var node = this;
            node.on('input', function(msg) {
                const workspace = {
                    name: msg.payload.chatbot_name,
                    description: 'this is the first chatbot created using node.js'
                }
                wa.assistant.createWorkspace(workspace)
                    .then(res => {
                        json = JSON.stringify(res, null, 2);
                        let object = JSON.parse(json);
                        workspaceid = object.result.workspace_id;
                        node.send(workspaceid); //send workspace id to next
                    })
                    .catch(err => {
                        console.log(err)
                    });
            });
        }

        RED.nodes.registerType("createWatson",