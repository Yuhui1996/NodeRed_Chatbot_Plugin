const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;
let json;


var global_data = require('../scripts/global_data.js');



module.exports = function (RED) {


    //Unused slow function that has been replaced by used on creation
    function send_pre_data(current_assistant, msg) {
        for (let next_intent in global_data.data.intents) {

            console.log(global_data.data.intents[next_intent].examples);
            let params = {
                workspaceId: msg.payload.workspaceId,
                intent: next_intent,
                description: global_data.data.intents[next_intent].desc,
                examples: global_data.data.intents[next_intent].examples
            };

            current_assistant.createIntent(params)
                .then(res => {
                    console.log("Created Intent");
                })
                .catch(err => {
                    console.log(err);
                });
        }


        for (let next_entity in global_data.data.entities) {

            console.log(global_data.data.entities[next_entity]);

            let params = {
                workspaceId: msg.payload.workspaceId,
                entity: next_entity,
                values:  global_data.data.entities[next_entity]
            };

            current_assistant.createEntity(params)
                .then(res => {
                    console.log("Created Entity");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    //Format intents for sending to Watson
    function createIntents() {
        let intents = [];
        for (let next_intent in global_data.data.intents) {
            let intent = {
                intent: next_intent,
                description: global_data.data.intents[next_intent].desc,
                examples: global_data.data.intents[next_intent].examples
            };

           intents.push(intent);
        }
        return intents;
    }

    //Format entities for sending to Watson
    function createEntities() {
        let entities = [];
        for (let next_entity in global_data.data.entities) {

            let entity = {
                entity: next_entity,
                description: global_data.data.entities[next_entity].description,
                fuzzy_match: global_data.data.entities[next_entity].fuzzy_match,
                values:  global_data.data.entities[next_entity].values
            };

            entities.push(entity)
        }
        return entities;
    }

    function createWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;

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


            const workspace = {
                name: msg.payload.chatbot_name,
                description: 'this is the first chatbot created using node.js',
                intents: createIntents(),
                entities: createEntities()
            }


            this.assistant.listWorkspaces()
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    for (let i = 0; i < object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name == msg.payload.chatbot_name) {//if the workspce exist
                            console.log(object.result.workspaces[i].name);
                            const workspace_to_delete = {
                                workspaceId: object.result.workspaces[i].workspace_id,
                            };
                            this.assistant.deleteWorkspace(workspace_to_delete)
                                .then(res => {
                                    console.log("delete success");
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }

                    }
                    this.assistant.createWorkspace(workspace)
                        .then(res => {
                            json = JSON.stringify(res, null, 2);
                            let object = JSON.parse(json);
                            workspaceid = object.result.workspace_id;
                            msg.payload.workspaceId = workspaceid;

                            // send_pre_data(this.assistant, msg);


                            node.send(msg); //send workspace id to next

                        })
                        .catch(err => {
                            console.log(err);
                        });

                })
                .catch(err => {
                    console.log(err);
                });


        });
    }


    RED.nodes.registerType("createWatson", createWatson);


    RED.httpAdmin.get("/global_data", RED.auth.needsPermission('global_data.read'), function (req, res) {
        //send all data to node
        res.json(global_data.data);
    });

    RED.httpAdmin.post('/global_data', RED.auth.needsPermission("global_data.write"), function (req, res) {
        console.log(req.body);
        let new_data = req.body;
        ///Handle creation on new intent or entity from node
        if (new_data.control == "add" || new_data.control == "update"){
            if (new_data.type == "intent") {
                global_data.add_intent(new_data);
            } else if (new_data.type = "entity") {
                global_data.add_entity(new_data);
            } else {
                res.sendStatus(500);
                node.error(RED._("inject.failed", {
                    error: err.toString()
                }));
            }
        }else{
            if (new_data.type == "intent") {
                global_data.remove_intent(new_data);
            } else if (new_data.type = "entity") {
                global_data.remove_entity(new_data);
            } else {
                res.sendStatus(500);
                node.error(RED._("inject.failed", {
                    error: err.toString()
                }));
            }
        }

    });


}
