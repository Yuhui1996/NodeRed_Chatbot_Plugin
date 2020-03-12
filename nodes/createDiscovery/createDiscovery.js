const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const AssistantV1 = require('ibm-watson/assistant/v1');
let fs = require('fs');



module.exports = function(RED) {
    let jsonObject;
    let enviroment_id;
    let configuration_id;
    let collection_id;
    let discovery_api_key;
    function discoveryNode(node_data) {

        RED.nodes.createNode(this,node_data);
        var created = false;
        var node = this
        var enviromentMap = new Map();
        node.on("input", function(msg){
            console.log("this is fucked "+ msg.payload.discovery_api_key)
            const discovery = new DiscoveryV1({
                version: '2020-02-10',
                authenticator: new IamAuthenticator({
                    apikey: msg.payload.discovery_api_key,
                }),
                url: 'https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/74281b85-e9d8-4490-80aa-69a48ef50d37',
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
                    console.log(jsonObject)
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


