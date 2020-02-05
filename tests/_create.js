var should = require("should");
var helper = require("node-red-node-test-helper");
var createWatsonNode = require("../nodes/create_watson/createWatson.js");
const testNode = 'testCreateWatson';
const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');


const watson_assistant = new AssistantV1({
    version: '2019-02-08',
    authenticator: new IamAuthenticator({
        apikey: 'NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W', //change this api key to your to modify your own workspace
    }),
    url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381'
});

let json;


function waitFor(time) {
    // wait time and resolve
    return new Promise(resolve => setTimeout(resolve, time))
}

helper.init(require.resolve('node-red'));

describe('create Watson Node', function() {




    beforeEach(function(done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload();
        helper.stopServer(done);
    });

    after(function(done) { //doesnt get run after last test. not working
        watson_assistant.listWorkspaces()
            .then(res => {
                json = JSON.stringify(res, null, 2);
                const object = JSON.parse(json);
                for (let i = 0; i < object.result.workspaces.length; i++) {
                    if (object.result.workspaces[i].name === "testCreateWatson") {
                        const params = {
                            workspaceId: object.result.workspaces[i].workspace_id,
                        };
                        watson_assistant.deleteWorkspace(params)
                            .then(res => {
                                console.log(JSON.stringify(res, null, 2));
                                //helper.unload();
                                //helper.stopServer(done);
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    }
                }
                //helper.unload();
                //helper.stopServer(done);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('should be loaded', function(done) {
        var flow = [{
            id: "n1",
            type: "createWatson",
            name: testNode
        }];
        helper.load(createWatsonNode, flow, function() {
            var n1 = helper.getNode("n1");
            console.log(n1);
            n1.should.have.property('name', testNode);
            done();
        });
    });

    it('should be connected', function(done) {
        var statusCode;
        watson_assistant.listWorkspaces()
            .then(res => {
                statusCode = JSON.parse(JSON.stringify(res, null, 2))['status'];
                should.equal(statusCode, 200);
                done();
            })
            .catch(err => {
                done(err);
            });
    });


    it('workspace should be created', function(done) {
        this.timeout(4000);
        var found = false;
        var flow = [{
                id: "n1",
                type: "createWatson",
                name: testNode,
                wires: [
                    ["n2"]
                ]
            },
            {
                id: "n2",
                type: "helper"
            }
        ];
        helper.load(createWatsonNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n1.receive({
                payload: {
                    chatbot_name: testNode
                }
            });
            n2.on("input", function(msg) {
                waitFor(2000).then(() => { //wait for internal api call from node red. currently no way of accessing promise from n1
                    watson_assistant.listWorkspaces()
                        //.then(res => {n1.receive({ payload: testNode }); return res;})//not really working. does not wait for node red
                        .then(res => {
                            json = JSON.stringify(res, null, 2);
                            const object = JSON.parse(json);
                            for (let i = 0; i < object.result.workspaces.length; i++) {
                                if (object['result']['workspaces'][i]['name'] === testNode) {
                                    found = true;
                                }
                            }
                            should.equal(found, true);
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                })

            });
        });

    });
});