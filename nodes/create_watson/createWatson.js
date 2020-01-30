const Watson_API = require('../scripts/chatbot_fuctions.js');


module.exports = function(RED) {


    function createWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        console.log(config);
        node.on('input', function(msg) {
            // let wa = new Watson_API(msg.payload.api_key, msg.payload.instance);
            console.log(wa);
            //
            //     const workspace = {
            //         name: msg.payload.chatbotName,
            //         description: 'this is the first chatbot created using node.js'
            //
            //     }
            //
            //     this.wa.assistant.createWorkspace(workspace)
            //         .then(res => {
            //             console.log(JSON.stringify(res, null, 2));
            //         })
            //         .catch(err => {
            //             console.log(err)
            //         });
            //     node.send('success');
            //
        });



    }

    RED.nodes.registerType("createWatson", createWatson);
}