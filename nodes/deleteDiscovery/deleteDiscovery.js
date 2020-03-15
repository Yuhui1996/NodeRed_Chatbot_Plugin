const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
let fs = require('fs');
let jsonObject;


module.exports = function(RED) {
    let enviroment_id;
    let configuration_id;
    let collection_id;
    function deleteDiscovery(node_data) {
        RED.nodes.createNode(this, node_data);
        var node = this
        var deleted = false;
        var enviromentMap = new Map();

        node.on("input", function (msg) {

            const discovery = new DiscoveryV1({
                version: '2020-02-10',
                authenticator: new IamAuthenticator({
                    apikey: msg.payload.discovery_api_key,
                }),
                url: msg.payload.discoveryUrl
            });

            discovery.listEnvironments()
                .then(listEnvironmentsResponse => {
                    jsonObject = JSON.stringify(listEnvironmentsResponse, null, 2);
                    let object = JSON.parse(jsonObject);
                    for(let i = 0;i<object.result.environments.length; i++ ) {
                        enviromentMap.set(object.result.environments[i].name, object.result.environments[i].environment_id)
                    }
                    if(enviromentMap.has(node_data.discoveryname)){
                            const deleteparams = {
                                environmentId: enviromentMap.get(node_data.discoveryname)
                            };
                            discovery.deleteEnvironment(deleteparams)
                                .then(deleteEnvironmentResponse => {
                                    enviromentMap.delete(node_data.discoveryname)
                                    msg.payload = "deleted"
                                    node.send(msg)
                                    jsonObject = JSON.stringify(deleteEnvironmentResponse, null, 2);
                                    console.log(jsonObject)
                                }).catch(err => {
                                console.log(err)
                            })
                        }else{
                        msg.payload="this discovery doesn't exist"
                        node.send(msg)
                    }

                })
        });

    }
    RED.nodes.registerType("deleteDiscovery",deleteDiscovery);

}
//

//


