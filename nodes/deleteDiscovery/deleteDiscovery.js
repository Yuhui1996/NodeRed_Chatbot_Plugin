const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
let fs = require('fs');
let jsonObject;

/*
* @class deleteDiscovery
* @description in this class, it reads input from the front-end and take apikey and api url from the metadata node,
* then based on the information make a deletion api call to delete the enviornment
* @param RED, nodered object
* */
module.exports = function(RED) {
    let enviroment_id;
    let configuration_id;
    let collection_id;

    /*
    * @function deleteDiscovery
    * @memberOf deleteDiscovery
    * @description this function first check if the environment user like to delete exist, if yes find the enviroment id
    * of the enviroment that has the given name, and then delete it using deleteEnvironment api call,
    * if no, send message of "this discovery doesn't exist"
    * node.send(msg) allows to send important msg or debug message to the next node.
    * */
    function deleteDiscovery(node_data) {
        RED.nodes.createNode(this, node_data);
        var node = this
        //boolean store whether it's deleted
        var deleted = false;
        var enviromentMap = new Map();

        /*
        * @inner this is the key function of this class
        * */
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
                    /*
                    * @inner this checks if enviroment user like to delete exist already
                    * */
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


