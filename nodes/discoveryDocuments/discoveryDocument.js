const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const promise_queue = require('../scripts/queue.js');
let fs = require('fs');
let jsonObject;
let enviroment_id;
let configuration_id;
let collection_id;

/*
* @class discoveryDocument
* @description this class allow the user to upload the document to the linked enviroment
* in this class it takes the enviorment id and collection from the previous node, createDiscovery node, and based on
* the enviroment id and collection id, make a addDocument api call to upload the documents
* @param RED, nodered object
* */
module.exports = function(RED) {

    /*
    * @function discoveryDocument
    * @memberOf discoveryDocument
    * @description the key function for this node, where it takes filepath as input of the file and then
    * upload the corresponding file to the environment.
    * fs or filestream is the built-in file reader provided by chrome.
    * node.send(msg) allows to send important msg or debug message to the next node.
    * */
    function discoveryDocument(node_data) {

        RED.nodes.createNode(this,node_data);
        var node = this
        node.on("input", function(msg){
            console.log(node_data.filepath + "hello")
            console.log(msg)
            function waitFor(time) {
                // wait time and resolve
                return new Promise(resolve => setTimeout(resolve, time))
            }
            const discovery = new DiscoveryV1({
                version: '2020-02-10',
                authenticator: new IamAuthenticator({
                    apikey: msg.payload.discovery_api_key,
                }),
                url: msg.payload.discoveryUrl
            });
            /*
            * @inner the following three lines of code is to get the imporant parameters needed for upload the file*/
            enviroment_id = msg.payload.enviroment_id
            configuration_id= msg.payload.configuration_id
            collection_id = msg.payload.collection_id
            if(!fs.existsSync(node_data.filepath)) {
                msg.payload = "filepath: " + node_data.filepath + " not exist"
                node.send(msg)
            }else
            {
            const createDocument ={
                environmentId: enviroment_id,
                collectionId: collection_id,
                file: fs.createReadStream(node_data.filepath)

            }

                discovery.addDocument(createDocument)
                    .then(res => {
                        console.log(JSON.stringify(res, null, 2))
                        msg.payload = "uploaded"
                        node.send(msg)

                    })
                    .catch(err => {
                        msg.payload = err
                        node.send(msg)
                    });
    }
    })
    }


    RED.nodes.registerType("discoveryDocument",discoveryDocument);
}
//

//


