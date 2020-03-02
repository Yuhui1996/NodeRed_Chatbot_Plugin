const AssistantV1 = require('ibm-watson/assistant/v1');

const fs  = require("fs");
const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;
let json;





module.exports = function (RED) {



    function writeData(){

        try {
            let data = JSON.stringify(this.global_data.data, null, 2);

            fs.writeFile('global_data.json', data, (err) => {
                console.log('Data written to file');
            });
        }catch (e) {
            console.log("Failed to save data");
        }
    }

    function readData(){
        try{
            let  jsonData = JSON.parse(fs.readFileSync('global_data.json', 'utf8'));
            return jsonData;
        }catch (e) {
            console.log("failed to load data");
            return undefined;
        }

    }

    function startData() {
        if (this.global_data.data == undefined ){
            let old_data = readData();
            if (old_data != undefined){
                this.global_data.data = old_data;
            }else{
                this.global_data.data = {
                    entities: {},
                    intents: {}
                }
            }
        }
    }


    this.global_data = require('../scripts/global_data.js');
    let global_top = this;



    //Unused slow function that has been replaced by used on creation
    function send_pre_data(current_assistant, msg) {



        for (let next_intent in this.global_data.data.intents) {

            console.log(next_intent);
            console.log(this.global_data.data.intents[next_intent].examples);
            let params = {
                workspaceId: msg.payload.workspaceId,
                intent: next_intent,
                description: this.global_data.data.intents[next_intent].desc,
                examples: this.global_data.data.intents[next_intent].examples
            };

            current_assistant.createIntent(params)
                .then(res => {
                    console.log("Created Intent");
                })
                .catch(err => {
                    console.log(err);
                });
        }


        for (let next_entity in this.global_data.data.entities) {

            console.log(this.global_data.data.entities[next_entity]);

            let params = {
                workspaceId: msg.payload.workspaceId,
                entity: next_entity,
                values:  this.global_data.data.entities[next_entity]
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


    function test_data() {
        this.global_data.data = {
            entities: {
                "Test_Entity": {
                    values: [{
                        value: "Menu",
                        synonyms: ["Veg", "Normal", "Special_Menu"]
                    }],
                    description: "Hello",
                    fuzzy_match: true
                }
            },
            intents: {
                "Test_Intent": {
                    description: "",
                    examples: [{text: "Hello"}, {text: "Hi"}]
                }
            }
        }
    }

    //Format intents for sending to Watson
    function createIntents() {
        let intents = [];
        for (let next_intent in this.global_data.data.intents) {
            let intent = {
                intent: next_intent,
                description: this.global_data.data.intents[next_intent].desc,
                examples: this.global_data.data.intents[next_intent].examples
            };

            intents.push(intent);
        }
        console.log("Intents_______________\n" + intents);
        return intents;
    }

    //Format entities for sending to Watson
    function createEntities() {
        let entities = [];
        for (let next_entity in this.global_data.data.entities) {

            console.log(this.global_data.data.entities[next_entity].fuzzy_match);

            let entity = {
                entity: next_entity,
                description: this.global_data.data.entities[next_entity].description,
                fuzzy_match: this.global_data.data.entities[next_entity].fuzzy_match == true,
                values:  this.global_data.data.entities[next_entity].values
            };

            entities.push(entity)
        }

        console.log("ENTITIES_______________\n" + entities);
        return entities;
    }




    function createWatson(config) {


        // test_data();

        RED.nodes.createNode(this, config);
        // if (this.context().flow.get("global_data") != undefined){
        //     this.global_data.data = this.context().flow.get("global_data");
        // }
        var node = this;

        node.on('input', function (msg) {

            startData();


            let self = this;

            if (global_top.global_data.data == undefined){
                global_top.global_data.data = {
                    entities:{},
                    intents:{}
                }
            }
            // this.context().flow.set("saved_data", this.global_data.data);
            try {
                this.context().flow.set("ids",1);
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



            function createWatson() {
                self.assistant.createWorkspace(workspace)
                    .then(res => {
                        json = JSON.stringify(res, null, 2);
                        let object = JSON.parse(json);
                        workspaceid = object.result.workspace_id;
                        msg.payload.workspaceId = workspaceid;
                        node.send(msg); //send workspace id to next
                        console.log(config);
                        config.nodeData = global_top.global_data.data;
                        writeData();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }




            self.assistant.listWorkspaces()
                .then(res => {
                    json = JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    for (let i = 0; i < object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name == msg.payload.chatbot_name) {//if the workspce exist
                            console.log(object.result.workspaces[i].name);
                            const workspace_to_delete = {
                                workspaceId: object.result.workspaces[i].workspace_id,
                            };
                            self.assistant.deleteWorkspace(workspace_to_delete)
                                .then(res => {
                                    console.log("delete success");
                                    node.error("delete success");

                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }

                    }

                    createWatson();


                })
                .catch(err => {
                    console.log(err);
                });
        });


    }


    RED.nodes.registerType("createWatson", createWatson);



    RED.httpAdmin.get("/global_data", RED.auth.needsPermission('global_data.read'), function (req, res) {
        //send all data to node

        startData();
        res.json(this.global_data.data);
    });


    RED.httpAdmin.post('/global_data', RED.auth.needsPermission("global_data.write"), function (req, res) {

        let new_data = req.body;
        ///Handle creation on new intent or entity from node
        if (new_data.control == "add" || new_data.control == "update"){
            if (new_data.type == "intent") {
                this.global_data.add_intent(new_data);
            } else if (new_data.type = "entity") {

                console.log(new_data.values);
                this.global_data.add_entity(new_data);
            } else {
                res.sendStatus(500);
                node.error(RED._("inject.failed", {
                    error: err.toString()
                }));
            }
        }else{
            if (new_data.type == "intent") {
                this.global_data.remove_intent(new_data);
            } else if (new_data.type = "entity") {
                this.global_data.remove_entity(new_data);
            } else {
                res.sendStatus(500);
                node.error(RED._("inject.failed", {
                    error: err.toString()
                }));
            }
        }

    });





}
