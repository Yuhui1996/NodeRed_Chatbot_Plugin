module.exports = function(RED) {
    function hostbotNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var open = require('open');//added to dependencies
        node.on('input', function(msg) {
            url = "http://watsonchatbot.epizy.com/main/main.html?api=" + msg.payload['wa_api_key'] +"&&url=" + msg.payload['instance_url'];
            if (typeof msg.payload['workspaceId'] !== "undefined"){//TODO: need to confirm this ===> [workspaceId]
            	url += "&&workspace=" + msg.payload['workspaceId'];
            }
            msg.payload = url;
            console.log("The link to your chatbot is, " + url + "     (please make sure to select the correct instance before chatting)")
            open(url);
            node.send(msg);
        });
    }
    RED.nodes.registerType("hostbot",hostbotNode);
}


