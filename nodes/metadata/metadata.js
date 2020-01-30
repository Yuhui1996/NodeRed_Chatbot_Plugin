const Watson_API = require('../scripts/chatbot_fuctions.js');

const api_origional = 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W';
const instance_origional = 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381';
module.exports = function(RED) {

    // let wa = new Watson_API(n.wa_api_key, n.instance);



    function MetadataNode(node_data) {
        console.log(node_data);
        // console.log(n.instance);
        RED.nodes.createNode(this, node_data);
        var node = this;

        this.on("input", function(msg) {

            msg.payload = {
                name: node_data.chatbotName,
                api_key: node_data.wa,
                instance: node_data.instance,

            }

            console.log(msg);
            this.send(msg);
            //
            //
            //     msg.topic = this.topic;
            //     if (this.payloadType === 'str') {
            //         try {
            //             if (this.payloadType == null) {
            //                 msg.payload = this.payload;
            //             } else if (this.payloadType === 'none') {
            //                 msg.payload = "";
            //             } else {
            //                 msg.payload = RED.util.evaluateNodeProperty(this.payload, this.payloadType, this, msg);
            //             }
            //             this.send(msg);
            //             msg = null;
            //         } catch (err) {
            //             this.error(err, msg);
            //         }
            //     }
        });
    }



    RED.nodes.registerType("metadata", MetadataNode);

    RED.httpAdmin.post("/metadata/:id", RED.auth.needsPermission("inject.write"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch (err) {
                res.sendStatus(500);
                node.error(RED._("inject.failed", {
                    error: err.toString()
                }));
            }
        } else {
            res.sendStatus(404);
        }
    });
}