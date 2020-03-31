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
        console.log("start dialog");
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

            /**
             * returns an output object that includes
             * the responses the user has created
             * in a format that matches the Watson API call requirements 
             */
            function getResponses(){
                var output = {
                    generic: []
                }
                var responses = n.dialog_response;
                for(var i =0; i < responses.length; i++){
                    if(responses[i].response_type === "image"){
                        var image = responses[i].image;
                        var response = {};
                        response.response_type = "image";

                        //if(responses[i].url != undefined){
                        response.source = image.source;
                        //console.log("source:" + image.source);
                        //}
                        if(image.title != undefined){
                            response.title = image.title;
                        }
                        if(image.description != undefined){
                            response.description = image.description;
                        }
                        output.generic.push(response);
                    } else if(responses[i].response_type === "option"){
                        var option = responses[i].option;
                        var response = {};

                        response.response_type = "option";
                        response.title = option.title;
                        if(option.description != undefined){
                            response.description = option.description;
                        }

                        response.options = [];
                        for(var i = 0; i < option.list.length; i++){
                            response.options.push({
                                label: option.list[i].label,
                                value: {
                                    input: {
                                      text: option.list[i].value  
                                    },
                                    intents: option.list[i].intents,
                                    entities: []
                                }
                            });
                        }

                        console.log(response);
                        output.generic.push(response);
                    } else if (responses[i].response_type === "text"){
                        output.generic.push({
                            values: [
                                {
                                    text: responses[i].responseContent
                                }
                            ],
                            response_type: "text"
                        })
                    }
                }
                return output;
            }

            let params = {
                workspaceId: msg.payload.workspaceId,
                parent: msg.payload.nodeID,
                dialogNode: this.id, //needs to be unique
                conditions: getReferenceValue(n.dialog_type, n.dialog_value, n.condition, n.conditionChoices),
                title: n.name,
                output: getResponses()
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
                    node.status({fill:"green",shape:"ring",text:"Complete"});
                    node.send(msg);


                })
                .catch(err => {
                    console.log(err)
                    this.status({fill:"red",shape:"ring",text:"failed"});
                    //    "THIS IS ERROR OF" + this.id + "__________________________-\n\n" +
                });

        });
    }

    RED.nodes.registerType("dialog", createDialog);
}