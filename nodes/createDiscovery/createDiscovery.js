const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const AssistantV1 = require('ibm-watson/assistant/v1');
let fs = require('fs');
let path = require('path');


module.exports = function(RED) {
    let jsonObject;
    let enviroment_id;
    let configuration_id;
    let collection_id;
    let discovery_api_key;

    let dialog_discovery_map;
    let dialog_discovery_map_json_file_path = path.join(__dirname, '/../hostbot/dialog_discovery_map.json');

    function writeData(){

        try {
            let data = JSON.stringify(dialog_discovery_map, null, 2);

            fs.writeFile(dialog_discovery_map_json_file_path, data, (err) => {
                console.log('createDiscovery.js writeData() : data written to file');
            });
        }catch (e) {
            console.log("createDiscovery.js writeData() : failed to save data");
        }
    }

    function readData(){
        try{
            let fileString = fs.readFileSync(dialog_discovery_map_json_file_path, 'utf8');
            let jsonData;
            if (fileString.length != 0){
                jsonData = JSON.parse(fileString);
            }else{
                jsonData = {};
            }
            return jsonData;
        }catch (e) {
            console.log("createDiscovery.js readData() : failed to load data");
            return undefined;
        }

    }

    function updateData(dialog_id, discovery_id) {
        if (dialog_id != undefined && discovery_id != undefined){
            if (dialog_discovery_map == undefined ){
                dialog_discovery_map = readData();
            }
            dialog_discovery_map[dialog_id] = discovery_id;
            writeData();
            console.log('createDiscovery.js updateData() : new entry added');
        }else{
            console.log('createDiscovery.js updateData() : invalid args');
        }
    }


    function discoveryNode(node_data) {

        RED.nodes.createNode(this,node_data);
        var created = false;
        var node = this
        var enviromentMap = new Map();
        node.on("input", function(msg){

            let dialog_node_ID = msg.payload.nodeID;
            
            const discovery = new DiscoveryV1({
                version: '2020-02-10',
                authenticator: new IamAuthenticator({
                    apikey: msg.payload.discovery_api_key,
                }),
                url: msg.payload.discoveryUrl
            });
            const createParams = {
                name: node_data.discoveryname,
                description: 'My environment',
                size: 'LT',
            };
            function waitFor(time) {
                // wait time and resolve
                return new Promise(resolve => setTimeout(resolve, time))
            }

            discovery.listEnvironments()
                .then(listEnvironmentsResponse => {

                    jsonObject = JSON.stringify(listEnvironmentsResponse, null, 2);
                    //console.log(jsonObject)
                    let object  = JSON.parse(jsonObject);
                    for(let i = 0;i<object.result.environments.length; i++ ) {
                        enviromentMap.set(object.result.environments[i].name, object.result.environments[i].environment_id)
                    }
                    if(enviromentMap.has(node_data.discoveryname))
                    {
                        const deleteparams={
                            environmentId : enviromentMap.get(node_data.discoveryname)
                        };
                        discovery.deleteEnvironment(deleteparams)
                            .then(deleteEnvironmentResponse => {
                                discovery.createEnvironment(createParams)
                                    .then(environment => {
                                        jsonObject = JSON.stringify(environment, null, 2);
                                        let object = JSON.parse(jsonObject);
                                        enviroment_id = object.result.environment_id;
                                        const configurationParams={
                                            environmentId: enviroment_id,
                                            name:node_data.discoveryname,
                                        };

                                        //TODO validate
                                        let new_entry = {};
                                        new_entry.dialog = dialog_node_ID;
                                        new_entry.discoveryID = enviroment_id;
                                        updateData(new_entry.dialog, new_entry.discoveryID);


                                        discovery.createConfiguration(configurationParams)
                                            .then(configuration => {
                                                let configurationObject = JSON.parse(JSON.stringify(configuration, null, 2));
                                                configuration_id =configurationObject.result.configuration_id;
                                                const createCollectionParams={
                                                    environmentId:enviroment_id,
                                                    name: node_data.discoveryname,
                                                }

                                                discovery.createCollection(createCollectionParams).then(collection=>{
                                                    let collectionobject = JSON.parse((JSON.stringify(collection,null, 2)));
                                                    collection_id =collectionobject.result.collection_id;
                                                    msg.payload = {
                                                        enviroment_id: enviroment_id,
                                                        configuration_id: configuration_id,
                                                        collection_id: collection_id,
                                                        discovery_api_key: msg.payload.discovery_api_key,
                                                        discoveryUrl:msg.payload.discoveryUrl,
                                                        success: true
                                                    }
                                                    node.send(msg)
                                                    console.log(collectionobject)

                                                }).catch(err=>{
                                                    msg.payload = err
                                                    node.send(msg)
                                                })

                                            })
                                            .catch(err => {
                                                msg.payload = err
                                                node.send(msg)
                                            });
                                    })
                                    .catch(err => {
                                        msg.payload = err
                                        node.send(msg)
                                    });
                            })
                            .catch(err => {
                                msg.payload = err
                                node.send(msg)
                            })
                    }else{
                        discovery.createEnvironment(createParams)
                            .then(environment => {
                                jsonObject = JSON.stringify(environment, null, 2);
                                let object = JSON.parse(jsonObject);
                                enviroment_id = object.result.environment_id;
                                const configurationParams={
                                    environmentId: enviroment_id,
                                    name:node_data.discoveryname,
                                };



                                //TODO validate
                                let new_entry = {};
                                new_entry.dialog = dialog_node_ID;
                                new_entry.discoveryID = enviroment_id;
                                updateData(new_entry.dialog, new_entry.discoveryID);




                                discovery.createConfiguration(configurationParams)
                                    .then(configuration => {
                                        let configurationObject = JSON.parse(JSON.stringify(configuration, null, 2));
                                        configuration_id =configurationObject.result.configuration_id;
                                        const createCollectionParams={
                                            environmentId:enviroment_id,
                                            name: node_data.discoveryname,
                                        }

                                        discovery.createCollection(createCollectionParams).then(collection=>{
                                            let collectionobject = JSON.parse((JSON.stringify(collection,null, 2)));
                                            collection_id =collectionobject.result.collection_id;
                                            msg.payload = {
                                                enviroment_id: enviroment_id,
                                                configuration_id: configuration_id,
                                                collection_id: collection_id,
                                                discovery_api_key: msg.payload.discovery_api_key,
                                                discoveryUrl:msg.payload.discoveryUrl,
                                                success: true
                                            }
                                            node.send(msg)
                                            console.log(collectionobject)

                                        }).catch(err=>{
                                            msg.payload = err
                                            node.send(msg)
                                        })

                                    })
                                    .catch(err => {
                                        msg.payload = err
                                        node.send(msg)
                                    });
                            })
                            .catch(err => {
                                msg.payload = err
                                node.send(msg)
                            });

                    }


                })
                .catch(err => {
                    msg.payload = err
                    node.send(msg)
                });

        })

    }
    RED.nodes.registerType("createDiscovery",discoveryNode);
}


//


//


