const Watson_API = require('../scripts/chatbot_fuctions.js');
let wa = new Watson_API();
let workspaceid;

module.exports = function(RED) {
    function createIntent(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
			console.log(msg.payload);
			const params = {
				workspaceId: msg,
				intent: config.name,
				description: config.description,
				examples: [
						{
						  text: config.example1
						},
						{
						  text: config.example2
						}
					]
			};
			wa.assistant.createIntent(params)
			  .then(res => {
				console.log(JSON.stringify(res, null, 2));
				node.send(msg.payload);
			  })
			  .catch(err => {
				node.error("Error",err);
				console.log(err);
			  });
        });
    }

    RED.nodes.registerType("createIntent", createIntent);
}