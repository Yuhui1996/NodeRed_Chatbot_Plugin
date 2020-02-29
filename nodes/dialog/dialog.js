const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;
const promise_queue = require('../scripts/queue.js');

module.exports = function (RED) {


    function getReferenceValue(sendType, sendValue, relationType, relationValue) {
        let result;
        if (sendType == "#") {
            result = sendType + sendValue;
        } else {
            switch (relationType) {
                case "any": {
                    result = sendType + sendValue;
                    break;
                }
                case "is": {
                    result = sendType + sendValue + " : " + relationValue;
                    break;
                }
                case "is_not": {
                    result = sendType + sendValue + " != " + relationValue;
                    break;
                }
                case "greater": {
                    result = sendType + sendValue + " > " + relationValue;
                    break;
                }
                case "less": {
                    result = sendType + sendValue + " < " + relationValue;
                    break;
                }
            }
        }

        return result;

    }

    function createDialog(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        this.name = n.name;
        this.intentName = n.intentName;
        this.intentDescription = n.intentDescription;
        node.on('input', function (msg) {

            try {
                this.assistant = this.context().flow.get("assistant");
            } catch (e) {
                console.log("context not found");
            } finally {
                if (this.assistant == null || this.assistant == undefined) {
                    this.assistant = new AssistantV1({
                        version: '2019-02-08',
                        authenticator: new IamAuthenticator({
                            apikey: msg.payload.wa_api_key,
                        }),
                        url: msg.payload.instance_url
                    });
                }
            }


            try {

                if (this.context().flow.get("ids") != undefined) {
                    this.id = this.context().flow.get("ids");
                } else {
                    this.id = 1;
                    this.context().flow.set("ids", this.id);
                }
                let nextID = this.id + 1;
                this.context().flow.set("ids", nextID);
            } catch (e) {
                this.id = 1;
                this.context().flow.set("ids", this.id);
            }


            console.log(this.id);

            this.id = this.id + Math.random().toString(36).substr(2, 10);
            //for creating dialog node

            
            let params = {
                workspaceId: msg.payload.workspaceId,
                parent: msg.payload.nodeID,
                dialogNode: this.id, //needs to be unique
                conditions: getReferenceValue(n.dialog_type, n.dialog_value, n.condition, n.conditionChoices),
                title: n.name
            };


            let top = this;
            // top.assistant.createDialogNode(params)
            //

            promise_queue.addToQueue(() => top.assistant.createDialogNode(params))
                .then(res => {

                    json = JSON.stringify(res, null, 2);
                    let object = JSON.parse(json);
                    let nodeID = top.id;
                    msg.payload.nodeID = nodeID;
                    node.send(msg);


                })
                .catch(err => {
                    console.log(err)
                    //    "THIS IS ERROR OF" + this.id + "__________________________-\n\n" +
                });
        });
    }

    RED.nodes.registerType("dialog", createDialog);
}