// const Watson_API = require('../scripts/chatbot_fuctions.js');
const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');



const api_origional = 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W';
const instance_origional = 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381';
module.exports = function(RED) {


    function MetadataNode(node_data) {
        console.log(node_data);
        // console.log(n.instance);
        RED.nodes.createNode(this, node_data);
        var node = this;


        var assistant = new AssistantV1({
            version: '2019-02-08',
            authenticator: new IamAuthenticator({
                apikey: node_data.wa,
            }),
            url: node_data.instance
        });
        // var myCount = flow.get("assistant");
        // var old = this.context().flow.get("assistant");
        this.context().flow.set("assistant", assistant);

        this.on("input", function(msg) {
            msg.payload = {
                chatbot_name: node_data.chatbotName,
                wa_api_key: node_data.wa,
                ta_api_key: node_data.ta,
                discovery_api_key: node_data.discovery,
                instance_url: node_data.instance,
            }


            // console.log(msg);
            this.send(msg);
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