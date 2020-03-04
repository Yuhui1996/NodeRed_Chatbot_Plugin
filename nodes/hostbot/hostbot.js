module.exports = function(RED) {
    function hostbotNode(config) {

        RED.nodes.createNode(this,config);
        var node = this;
        var open = require('open');//added to dependencies
        node.on('input', function(msg) {

            var connect = require('connect');
            var varsInHtml = 'passApi = "' + msg.payload['wa_api_key'] +'";\npassUrl = "' + msg.payload['instance_url'] + '";\n'
            var serveStatic = require('serve-static');
            connect().use(serveStatic(__dirname)).listen(8080, function(){
                console.log('Server running on 8080...');
            });
            //url = "http://watsonchatbot.epizy.com/main/main.html?api=" + msg.payload['wa_api_key'] +"&&url=" + msg.payload['instance_url'];
            var fs = require("fs");
            var path = require('path');
            var filePath = path.join(__dirname, "main.html");
            

            fs.readFile(filePath, function(err, buf) {
                var htmlString = buf.toString();
                //var varsInHtml = "passApi = " + msg.payload['wa_api_key'] +";\npassUrl = " + msg.payload['instance_url'] + ";\n"
                var newHtmlString = htmlString.replace("//arguments_for_WA_should_be_inserted_here", varsInHtml);

                file = require('fs');
                filePath = path.join(__dirname, "index.html");
                file.writeFile(filePath, newHtmlString, function (err) {
                  if (err) return console.log(err);
                  console.log('hostbot: html ready');
                });
            });

            //url = "http://localhost:8080/main.html?api=" + msg.payload['wa_api_key'] +"&&url=" + msg.payload['instance_url'];
            url = "http://localhost:8080/index.html"
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
