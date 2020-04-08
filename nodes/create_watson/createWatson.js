const AssistantV1 = require('ibm-watson/assistant/v1');

const fs  = require("fs");
let path = require('path');
let dialog_discovery_map_json_file_path = path.join(__dirname, '/../hostbot/dialog_discovery_map.json');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

let workspaceid;
let json;

const fd = fs.openSync(dialog_discovery_map_json_file_path, 'w')

/**
 * @class Create_Watson
 * @classdesc This class is to create the watson assistant. It also uses the global variable to send the entity and intent
 * create api calls.
 * @param RED
 */
module.exports = function (RED) {
    let global_top = this;


    /**
     * @function Write Data
     * @memberOf Create_Watson
     * @description Function to write global data to file for persistence.
     */
    function writeData(){

        try {
            let data = JSON.stringify(global_top.global_data.data, null, 2);

            fs.writeFile('global_data.json', data, (err) => {
                console.log('Data written to file');
            });
        }catch (e) {
            console.log("Failed to save data");
        }
    }

    /**
     * @function Read Data
     * @description Read the global data file to get previously saved data
     * @memberOf Create_Watson
     * @returns {undefined|any} Data data from file
     */
    function readData(){
        try{
            let  jsonData = JSON.parse(fs.readFileSync('global_data.json', 'utf8'));
            return jsonData;
        }catch (e) {
            console.log("failed to load data");
            return undefined;
        }

    }

    /**
     * @function Start Data
     * @memberOf Create_Watson
     * @description Attempt to read global data from file, otherwise create new global data that is empty.
     */
    function startData() {

        if (global_top.global_data.data == undefined ){

            let old_data = readData();


            if (old_data != undefined){
                global_top.global_data.data = old_data;
            }else{
                global_top.global_data.data = {
                    entities: {},
                    intents: {}
                }
            }

            console.log("Making the red");
        }
    }


    this.global_data = require('../scripts/global_data.js');






    //Format intents for sending to Watson
    /**
     * @function create Intents
     * @memberOf Create_Watson
     * @description function to format global data into correct API call format
     * @returns {any} data: API call data
     */
    function createIntents() {
        let intents = [];
        for (let next_intent in this.global_data.data.intents) {
            let intent = {
                intent: next_intent,
                description: this.global_data.data.intents[next_intent].description,
                examples: this.global_data.data.intents[next_intent].examples
            };

            intents.push(intent);
        }
        console.log("Intents_______________\n" + intents);
        return intents;
    }

    //Format entities for sending to Watson
    /**
     * @function create Entities
     * @memberOf Create_Watson
     * @description function to format global data into correct API call format
     * @returns {any} data: API call data
     */
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


    /**
     * @function create watson
     * @memberOf Create_Watson
     * @description Main function to create watson environment. Creation of intent, entities and workspace.
     * @param config
     */
    function createWatson(config) {
        startData();

        // test_data();

        RED.nodes.createNode(this, config);
        // if (this.context().flow.get("global_data") != undefined){
        //     this.global_data.data = this.context().flow.get("global_data");
        // }
        var node = this;

        /**
         * @memberOf Create_Watson
         * @inline When activated from metadata.
         */
        node.on('input', function (msg) {


            startData();


            let startIDs = {};

            //begin sibling variable for dialog nodes
            try{
                node.context().flow.set("siblings",startIDs);
            }catch (errors) {
                console.log("failed to set flows");
            }


            let self = this;

            //final catch for global data empty
            if (global_top.global_data.data == undefined){
                global_top.global_data.data = {
                    entities:{},
                    intents:{}
                }
            }

            /**
             * @memberOf Create_Watson
             * @inline initialise id counter for dialog node IDS
             */
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


            /**
             * @memberOf Create_Watson
             * @inline Create workspace paramaters for API call including intents and entiteis
             * @type {JSON}
             */
            const workspace = {
                name: msg.payload.chatbot_name,
                description: 'this is the first chatbot created using node.js',
                intents: createIntents(),
                entities: createEntities()
            };
            console.log(createIntents());


            /**
             * @function method Call
             * @memberOf Create_Watson
             * @description make the api call to create the workspace.
             */
            function createWatson() {
                self.assistant.createWorkspace(workspace)
                    .then(res => {
                        json = JSON.stringify(res, null, 2);
                        let object = JSON.parse(json);
                        workspaceid = object.result.workspace_id;
                        msg.payload.workspaceId = workspaceid;
                        msg.payload.discovery_api_key=msg.payload.discovery_api_key;
                        msg.payload.discoveryUrl= msg.payload.discoveryUrl;
                        node.send(msg); //send workspace id to next
                        console.log("config");
                        console.log(config);
                        config.nodeData = global_top.global_data.data;
                        writeData();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }


            /**
             * @memberOf Create_Watson
             * @inline Check if workspace with the same name exitst. Delete it!
             */
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

                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }

                    }

                    /**
                     * @memberOf Create_Watson
                     * @inline Create Watson
                     */
                    createWatson();


                })
                .catch(err => {
                    console.log(err);
                });
        });


    }


    RED.nodes.registerType("createWatson", createWatson);

    /**
     * @memberOf Create_Watson
     * @inline Communication between front end nodes and the global variable. Sending data to front-end
     *
     */
    RED.httpAdmin.get("/global_data", RED.auth.needsPermission('global_data.read'), function (req, res) {
        //send all data to node

        startData();
        res.json(this.global_data.data);
    });


    /**
     * @memberOf Create_Watson
     * @inline Communication between front end nodes and the global variable. Adding data from frontend to global variable.
     *
     */

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
