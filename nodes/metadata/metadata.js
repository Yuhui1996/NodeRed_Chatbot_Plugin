const Watson_API = require('../scripts/chatbot_fuctions.js');


module.exports = function(RED) {

    // let wa = new Watson_API(n.wa_api_key, n.instance);


    function MetadataNode(node_data) {
        console.log(node_data);
        // console.log(n.instance);
        RED.nodes.createNode(this, node_data);
        var node = this;

        let wa_api = new Watson_API()

        this.on("input", function(msg) {

            msg.payload = {
                waapikey: node_data.wa,
                instance: node_data.instance,
                api_object: wa_api

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