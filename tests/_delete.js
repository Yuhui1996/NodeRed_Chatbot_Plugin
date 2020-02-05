var should = require("should");
var helper = require("node-red-node-test-helper");
var deleteWatsonNode = require("../nodes/delete_watson/deleteWatson.js")
const Watson_API = require('../nodes/scripts/chatbot_fuctions.js');
const testNode = 'testDeleteWatson'
let wa = new Watson_API();

helper.init(require.resolve('node-red'));

function waitFor(time){
    // wait time and resolve
    return new Promise(resolve => setTimeout(resolve, time))
}

describe('create Watson Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "deleteWatson", name: testNode }];
        helper.load(deleteWatsonNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', testNode);
            done();
        });
    });

    it('should be connected', function (done) {
        var statusCode;
        wa.assistant.listWorkspaces()
            .then(res => {
                statusCode = JSON.parse(JSON.stringify(res, null, 2))['status'];
                should.equal(statusCode, 200);
                done();
            })
            .catch(err => {
                done(err);
            });
    });


    it('workspace should not exist', function (done) {
        this.timeout(4000);
        var found = false;
        var flow = [{ id: "n1", type: "deleteWatson", name: testNode }];
        helper.load(deleteWatsonNode, flow, function () {
            var n1 = helper.getNode("n1");
            wa.assistant.createWorkspace({
                name: testNode,
                description: 'for testing delete'
            })
                .then(res => {
                    n1.receive({payload: testNode}); //not really working? how to ensure this node finish the api call?
                    waitFor(2000).then(() => {//wait for internal api call from node red. currently no way of accessing promise from n1
                        wa.assistant.listWorkspaces()
                            .then(res => {

                                var listOfWorkSpaces = JSON.parse(JSON.stringify(res, null, 2));
                                for (var workspace in listOfWorkSpaces['result']['workspaces']) {
                                    if (listOfWorkSpaces['result']['workspaces'][workspace]['name'] === testNode) {
                                        found = true;
                                    }
                                }
                                should.equal(found, false);
                                done();
                            })
                            .catch(err => {
                                done(err);
                            });

                    })
                })
                .catch(err => {
                    console.log(err)
                });


        });

    });
});