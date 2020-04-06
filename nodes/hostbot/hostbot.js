module.exports = function(RED) {
    function hostbotNode(config) {

        RED.nodes.createNode(this,config);
        var node = this;
        var open = require('open');//added to dependencies
        node.on('input', function(msg) {

            var connect = require('connect');


            var varsInHtml = 'passApi = "' + msg.payload['wa_api_key'] +'";\npassUrl = "' + msg.payload['instance_url'] + '";\n'+'discoveryUrlValue = "' + msg.payload['discoveryUrl'] + '";\n'+'discoveryApiValue = "' + msg.payload['discovery_api_key'] + '";\n';
            if (typeof msg.payload.workspaceId !== "undefined"){//TODO: need to confirm this ===> [workspaceId]
                varsInHtml += 'passWorkspace = "' + msg.payload.workspaceId +'";\n';
            }

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
                var newHtmlString = htmlString.replace("//arguments_for_WA_should_be_inserted_here", varsInHtml);

                file = require('fs');
                filePath = path.join(__dirname, "index.html");
                file.writeFile(filePath, newHtmlString, function (err) {
                  if (err) return console.log(err);
                  console.log('hostbot: html ready');
                });
            });

            filePath = path.join(__dirname, "chatbot_iframe_web_insert.txt");

            //url = "http://localhost:8080/main.html?api=" + msg.payload['wa_api_key'] +"&&url=" + msg.payload['instance_url'];
            url = "http://localhost:8080/index.html"
            

            var iframe_snip = '';

            fs.readFile(filePath, function(err, buf) {
                var htmlString = buf.toString();
                iframe_snip = htmlString.replace("<!--the_url_of_the_chatbot-->", url);
                msg.payload = "<!--append this code to your website-->\n\n"+iframe_snip;
                node.send(msg);
            });

            console.log("The link to your chatbot is, " + url + "     (please make sure to select the correct instance before chatting)")
            console.log('widget insert:  passed as payload');
            open(url);
        });
    }
    RED.nodes.registerType("hostbot",hostbotNode);
}
