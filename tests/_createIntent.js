var should = require("should");
var helper = require("node-red-node-test-helper");
var createIntent = require("../nodes/create_intent/createIntent.js");

const AssistantV1 = require('ibm-watson/assistant/v1');

const apikey = "NYLBfhff5TKngBCwOxjfRp7dIipvFPm_v1yo_XlR_K7W";
const urlHost = "https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/a20b257b-83f7-44a4-8093-2553e67aa381";


const {
    IamAuthenticator
} = require('ibm-watson/auth');


const watson_assistant = new AssistantV1({
    version: '2019-02-08',
    authenticator: new IamAuthenticator({
        apikey: apikey, //change this api key to your to modify your own workspace
    }),
    url: urlHost
});


const testIntent = 'testCreateIntent';
const testDescription = 'forTest';
const testExample1 = '123456';
const testExample2 = 'helloChatbot';

let testNode;
let testNodeId;
let json;

function waitFor(time) {
    // wait time and resolve
    return new Promise(resolve => setTimeout(resolve, time))
}

helper.init(require.resolve('node-red'));

describe('create Intent', function() {




    beforeEach(function(done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload();
        helper.stopServer(done);
    });

    after(function(done) { //doesnt get run after last tests. not working
        watson_assistant.listWorkspaces()
            .then(res => {
                json = JSON.stringify(res, null, 2);
                const object = JSON.parse(json);
                const params = {
                    workspaceId: object.result.workspaces[0].workspace_id,
                    intent: testIntent,
                };
                watson_assistant.deleteIntent(params)
                    .then(res => {
                        console.log(JSON.stringify(res, null, 2));
                    })
                    .catch(err => {
                        console.log(err)
                    });
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('should be loaded', function(done) {
        var flow = [{
            id: "n1",
            type: "createIntent",
            name: testIntent
        }];
        helper.load(createIntent, flow, function() {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', testIntent);
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


    it('Intent should be created', function(done) {
        //this.timeout(2000);
        var found = false;
        var flow = [{
                id: "n1",
                type: "createIntent",
                name: testIntent,
                description: testDescription,
                example1: testExample1,
                example2: testExample2,
                wires: [
                    ["n2"]
                ]
            },
            {
                id: "n2",
                type: "helper"
            }
        ];

        watson_assistant.listWorkspaces()
            .then(res => {
                json = JSON.stringify(res, null, 2);
                const object = JSON.parse(json);
                testNode = object.result.workspaces[0].name;
                testNodeId = object.result.workspaces[0].workspace_id;

                helper.load(createIntent, flow, function() {
                    var n1 = helper.getNode("n1");
                    var n2 = helper.getNode("n2");
                    console.log(JSON.stringify(n1, null, 2));
                    console.log(JSON.stringify(testNode, null, 2));
                    n1.receive({
                        payload: {
                            chatbot_name: testNode,
                            wa_api_key: apikey,
                            ta_api_key: "",
                            discovery_api_key: "",
                            instance_url: urlHost,
                            workspaceId: testNodeId
                        }
                    });
                    n2.on("input", function(msg) {
                        //waitFor(2000).then(() => {//wait for internal api call from node red. currently no way of accessing promise from n1
                        const params = {
                            workspaceId: testNodeId,
                            intent: testIntent,
                        };
                        watson_assistant.getIntent(params)
                            .then(res => {
                                var status = JSON.parse(JSON.stringify(res, null, 2))['status'];
                                should.equal(status, 200);
                                done();
                            })
                            .catch(err => {
                                done(err);
                            });
                        //})
                    });
                });
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});