var should = require("should");
var helper = require("node-red-node-test-helper");
var createWatsonNode = require("../nodes/create_watson/createWatson.js");
var dialog = require("../nodes/dialog/dialog.js");

const AssistantV1 = require('ibm-watson/assistant/v1');

const {
    IamAuthenticator
} = require('ibm-watson/auth');

const apikey = "iaPZHdbsoWlThg8IWVFXM1m3IWuIbJ-vyPa9DstoRT5G";
const urlHost = "https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/0ccb889d-9dc1-4098-93e7-2be9f027d0d6";

const watson_assistant = new AssistantV1({
    version: '2019-02-08',
    authenticator: new IamAuthenticator({
        apikey: apikey, //change this api key to your to modify your own workspace
    }),
    url: urlHost
});


//const testNode = 'testCreateWatson';
const testWorksp = 'testDialog';

const testIntent = 'testDialog_Intent';
const testExample1 = 'forDialogTest_Example1';
const testExample2 = 'forDialogTest_Example2';

const testEntity = 'testDialog_Entity';
const testValue = 'forDialogTest_Value';
const testSym1 = 'forDialogTest_Sym1';
const testSym2 = 'forDialogTest_Sym2';

const testDialog = 'testDialog';
const dia1_type = 'text';
const dia1_response = 'I will show you pics';
const dia2_type = 'image';
const dia2_source = 'https://i.ibb.co/YWyBGsB/u-1250608835-1573103697-fm-26-gp-0.jpg';
const dia3_type = 'text';
const dia3_response = 'Please wait';
const dia4_type = 'image';
const dia4_source = 'https://i.ibb.co/1JzkDf1/u-1557923839-2018084581-fm-26-gp-0.jpg';

let testNodeId;
let json;


function waitFor(time) {
    // wait time and resolve
    return new Promise(resolve => setTimeout(resolve, time))
}

helper.init(require.resolve('node-red'));

describe('test dialog', function() {

    beforeEach(function(done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload();
        helper.stopServer(done);
    });

    /*
    after(function(done) { //doesnt get run after last test. not working
        const param = {
            workspaceId: testNodeId,
        };
        watson_assistant.deleteWorkspace(param)
            .then(res => {
                console.log(JSON.stringify(res, null, 2));
            })
            .catch(err => {
                console.log(err)
            });
        done();
    });

     */


    it('should be loaded', function(done) {
        var flow = [{
            id: "n1",
            type: "dialog",
            name: testDialog
        }];
        helper.load(dialog, flow, function() {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', testDialog);
            done();
        });
    });



    it('workspace should be created', function(done) {
        this.timeout(20000);
        var found = false;
        var flow = [{
            id: "n1",
            type: "createWatson",
            name: testWorksp,
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
                    chatbot_name: testWorksp,
                    wa_api_key: apikey,
                    ta_api_key: "",
                    discovery_api_key: "",
                    instance_url: urlHost,
                }
            });
            n2.on("input", function(msg) {
                watson_assistant.listWorkspaces()
                    .then(res => {
                        json = JSON.stringify(res, null, 2);
                        const object = JSON.parse(json);
                        for (let i = 0; i < object.result.workspaces.length; i++) {
                            if (object['result']['workspaces'][i]['name'] === testWorksp) {
                                testNodeId = object['result']['workspaces'][i]['workspace_id'];
                                console.log("worksp_id:" + testNodeId);
                                found = true;
                            }
                        }
                        should.equal(found, true);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
        });

    });


    it('Dialog should be created', function(done) {
        //this.timeout(20000);
        var found = false;
        var flow = [{
            id: "n1",
            type: "dialog",
            name: testDialog,
            //testIntent
            intentName: testIntent,
            intentDescription: "",
            examples: [testExample1,testExample2],
            //testEntity
            entityName: testEntity,
            entity_values: {
                v: testEntity,
                s: [testSym1,testSym2]
            },
            //dialog
            dialog_response:[{
                response_type: dia1_type,
                responseContent: dia1_response
            },{
                response_type: dia2_type,
                image:{
                    source: dia2_source
                }
            },{
                response_type: dia3_type,
                responseContent: dia3_response
            },{
                response_type: dia4_type,
                image:{
                    source: dia4_source
                }
            }],
            //assistant: watson_assistant,
            //assistant: null,
            ids: 1,
            wires: [
                ["n2"]
            ]
        },
            {
                id: "n2",
                type: "helper"
            }
        ];

        //flow.assistant = watson_assistant;
        flow.assistant = null;
        flow.ids = 1;
        //console.log("test3:" + testNodeId);
        //done();

        helper.load(dialog, flow, function() {
            //flow.set("assistant", watson_assistant);

            var found = false;
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n1.receive({
                payload: {
                    wa_api_key: apikey,
                    ta_api_key: "",
                    discovery_api_key: "",
                    instance_url: urlHost,
                    workspaceId: testNodeId
                }
            });
            n2.on("input", function(msg) {
                var param = {
                    workspaceId: testNodeId
                }
                watson_assistant.listDialogNodes(param)
                    .then(res => {
                        json = JSON.stringify(res, null, 2);
                        const object = JSON.parse(json);
                        for (let i = 0; i < object.result.dialog_nodes.length; i++) {
                            if (object['result']['dialog_nodes'][i]['title'] === testDialog) {
                                found = true;
                            }
                        }
                        should.equal(found, true);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
        });

    });
});