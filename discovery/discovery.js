const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
let fs = require('fs');
let jsonObject;
let enviroment_id;
let configuration_id;
let collection_id;


module.exports = function(RED) {
    function discoveryNode(node_data) {
        RED.nodes.createNode(this,node_data);
        var node = this
        node.on("input", function(msg){
            console.log(node_data)

            const discovery = new DiscoveryV1({
                version: '2020-02-10',
                authenticator: new IamAuthenticator({
                    apikey: node_data.discoveryKey,
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
                    let object  = JSON.parse(jsonObject);

                    for(let i =0;i<object.result.environments.length; i++ ){
                        if(object.result.environments[i].name == node_data.discoveryname){
                            const deleteparams={
                                environmentId : object.result.environments[i].environment_id
                            };

                            discovery.deleteEnvironment(deleteparams)
                                .then(deleteEnvironmentResponse => {

                                })
                                .catch(err => {
                                    console.log('error:', err);
                                })
                        }

                    }
                    waitFor(3000).then(()=>
                    {
                        discovery.createEnvironment(createParams)
                            .then(environment => {
                                jsonObject = JSON.stringify(environment, null, 2);
                                let object = JSON.parse(jsonObject);
                                enviroment_id = object.result.environment_id;
                                const configurationParams={
                                    environmentId: enviroment_id,
                                    name:"test",
                                };

                                discovery.createConfiguration(configurationParams)
                                    .then(configuration => {
                                        let configurationObject = JSON.parse(JSON.stringify(configuration, null, 2));
                                        configuration_id =configurationObject.result.configuration_id;
                                    })
                                    .catch(err => {
                                        console.log('error:', err);
                                    });
                            })
                            .catch(err => {
                                console.log('error:', err);
                            });



                        waitFor(2000).then(()=>{
                            const createCollectionParams={
                                environmentId:enviroment_id,
                                name: "test",
                            }

                            discovery.createCollection(createCollectionParams).then(collection=>{
                                let collectionobject = JSON.parse((JSON.stringify(collection,null, 2)));
                                collection_id =collectionobject.result.collection_id;
                                const createDocument ={
                                    environmentId : enviroment_id,
                                    collectionId: collection_id,
                                    file: fs.createReadStrea(node_data.filepath),
                                }
                                discovery.addDocument(createDocument)
                                    .then(documentAccepted=>
                                    {
                                        console.log(JSON.stringify(documentAccepted,null, 2))
                                    }).catch(err=> {
                                    console.log('error', err);
                                })
                            }).catch(err=>
                                console.log('error',err));

                        })
                    })

                })


                .catch(err => {
                    console.log('error:', err);
                });


        })
    }
    RED.nodes.registerType("discovery",discoveryNode);
}
//

//


