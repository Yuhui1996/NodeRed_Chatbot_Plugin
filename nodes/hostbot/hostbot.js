module.exports = function(RED) {
    function hostbotNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = "http://watsonchatbot.epizy.com/main/main.html?api=" + msg.payload['wa_api_key'] +"&&url=" + msg.payload['instance_url'];
            node.send(msg);
        });
    }
    RED.nodes.registerType("hostbot",hostbotNode);
}


