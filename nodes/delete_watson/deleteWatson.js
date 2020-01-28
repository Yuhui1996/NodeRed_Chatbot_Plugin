
const AssistantV1 = require('ibm-watson/assistant/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const assistant = new AssistantV1({
    version: '2019-02-08',
    authenticator: new IamAuthenticator({
        apikey: 'mHBe7hP3EvS--SAOe8fBSDRhTp78W__ZOL7iqfjMzUvf',//change this api key to your to modify your own workspace
    }),
    url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/4cc1d037-5230-4352-b3e4-dd74ede3951c',
});

let json;
let workspaceid;




module.exports = function (RED) {
    function deleteWatson(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            assistant.listWorkspaces()
                .then(res => {
                    json =  JSON.stringify(res, null, 2);
                    const object = JSON.parse(json);
                    for(let i =0; i<object.result.workspaces.length; i++) {
                        if (object.result.workspaces[i].name == msg.payload) {
                            console.log(object.result.workspaces[i].name);
                            const params = {
                                workspaceId: object.result.workspaces[i].workspace_id,
                            };
                            assistant.deleteWorkspace(params)
                                .then(res => {
                                    console.log(JSON.stringify(res, null, 2));
                                })
                                .catch(err => {
                                    console.log(err)
                                });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });



        });



    }

    RED.nodes.registerType("deleteWatson", deleteWatson);
}