module.exports = function(RED) {
    function hostbotNode(config) {

        RED.nodes.createNode(this, config);
        var node = this;
        var open = require('open'); //added to dependencies
        node.on('input', function(msg) {

            var connect = require('connect');
            var public_url;
            var varsInHtml = 'passApi = "' + msg.payload['wa_api_key'] + '";\npassUrl = "' + msg.payload['instance_url'] + '";\n' + 'discoveryUrlValue = "' + msg.payload['discoveryUrl'] + '";\n' + 'discoveryApiValue = "' + msg.payload['discovery_api_key'] + '";\n';
            if (typeof msg.payload.workspaceId !== "undefined") { //TODO: need to confirm this ===> [workspaceId]
                varsInHtml += 'passWorkspace = "' + msg.payload.workspaceId + '";\n';

            }

            var serveStatic = require('serve-static');

            var detect = require('detect-port');


            var portfix = 8080; //Math.floor(1000 + Math.random() * 9000);



            detect(portfix, (err, _port) => {
                if (err) {
                    console.log(err);
                }

                if (portfix == _port) {
                    console.log(`port: ${portfix} was not occupied`);
                    connect().use(serveStatic(__dirname)).listen(portfix, function() {
                        console.log('Server running on 8080...');
                        const ngrok = require('ngrok');
                        (async function() {
                            public_url = await ngrok.connect(portfix);
                            console.log(public_url);
                            console.log('connected to ngrok');


                            var fs = require("fs");
                            var path = require('path');
                            var filePath = path.join(__dirname, "main.html");


                            fs.readFile(filePath, function(err, buf) {
                                var htmlString = buf.toString();
                                var newHtmlString = htmlString.replace("//arguments_for_WA_should_be_inserted_here", varsInHtml).replace("http://localhost:8080", public_url);

                                file = require('fs');
                                filePath = path.join(__dirname, "index.html");
                                file.writeFile(filePath, newHtmlString, function(err) {
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
                                iframe_snip = htmlString.replace("<!--the_url_of_the_chatbot-->", public_url);
                                msg.payload = "<!--append this code to your website-->\n\n" + iframe_snip;
                                node.send(msg);
                            });

                            console.log("The link to your chatbot is, " + url + "     (please make sure to select the correct instance before chatting)")
                            console.log('widget insert:  passed as payload');
                            files = require('fs');
                            filePath = path.join(__dirname, "publicurl.txt");
                            files.writeFile(filePath, public_url, function(err) {
                                if (err) return console.log(err);
                                console.log('url saved');
                            });
                        });
                    });
                } else {
                    var readurl = require('fs');
                    var public_url;
                    var path = require('path');
                    var filePath = path.join(__dirname, "publicurl.txt");
                    readurl.readFile(filePath, function(err, buf) {
                        public_url = buf.toString();


                    });
                    console.log(`port: ${portfix} was occupied, try port: ${_port}`);
                    var fs = require("fs");
                    var path = require('path');
                    var filePath = path.join(__dirname, "main.html");


                    fs.readFile(filePath, function(err, buf) {
                        var htmlString = buf.toString();
                        var newHtmlString = htmlString.replace("//arguments_for_WA_should_be_inserted_here", varsInHtml).replace("http://localhost:8080", public_url);

                        file = require('fs');
                        filePath = path.join(__dirname, "index.html");
                        file.writeFile(filePath, newHtmlString, function(err) {
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
                        iframe_snip = htmlString.replace("<!--the_url_of_the_chatbot-->", public_url);
                        msg.payload = "<!--append this code to your website-->\n\n" + iframe_snip;
                        node.send(msg);
                    });

                    console.log("The link to your chatbot is, " + url + "     (please make sure to select the correct instance before chatting)")
                    console.log('widget insert:  passed as payload');

                }
              
              
                    open(public_url);



            });




            //url = "http://watsonchatbot.epizy.com/main/main.html?api=" + msg.payload['wa_api_key'] +"&&url=" + msg.payload['instance_url'];

        });
    }
    RED.nodes.registerType("hostbot", hostbotNode);
}