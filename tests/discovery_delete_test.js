var deleteDiscovery = require("../nodes/deleteDiscovery/deleteDiscovery.js");
var createDiscovery = require("../nodes/createDiscovery/createDiscovery.js");
const DiscoveryV1 = require('ibm-watson/discovery/v1');
var should = require("should");
var helper = require("node-red-node-test-helper");
const {
    IamAuthenticator
} = require('ibm-watson/auth');


const apikey = "lBg_mlcCpU_SGs-RZwWthDFjKlFKLcXUDqrVfWPH1A3h";
const url = "https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/74281b85-e9d8-4490-80aa-69a48ef50d37";

const discovery = new DiscoveryV1({
    version: '2020-02-10',
    authenticator: new IamAuthenticator({
        apikey: apikey
    }),
    url: url
});
function waitFor(time) {
    // wait time and resolve
    return new Promise(resolve => setTimeout(resolve, time))
}

let json
let found = true


helper.init(require.resolve('node-red'));

describe('delete discovery Node', function() {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });
    it('should be loaded', function (done) {
        var flow = [{
            id: "n1",
            type: "deleteDiscovery",
            name: "deleteDiscovery"
        }];
        helper.load(deleteDiscovery, flow, function () {
            var n1 = helper.getNode("n1");
            console.log(n1);
            n1.should.have.property('name', "deleteDiscovery");
            done();
        });
    });


    it('workspace should not exist', function(done) {
        this.timeout(20000);
        var found = false;
        var flow = [{
            id: "n1",
            type: "deleteDiscovery",
            name: "deleteDiscovery",
            discoveryname:"testDiscovery"
        }];
        helper.load(deleteDiscovery, flow, function() {
            var n1 = helper.getNode("n1");
            const createParams = {
                name: "testDiscovery",
                description: 'My environment',
                size: 'LT',
            };
            discovery.createEnvironment(createParams)
                .then(res => {
                    n1.receive({
                        payload: {
                            discovery_api_key: apikey,
                            discoveryUrl: url,
                        }
                    }); //not really working? how to ensure this node finish the api call?
                    waitFor(4000).then(() => { //wait for internal api call from node red. currently no way of accessing promise from n1
                        discovery.listEnvironments()
                            .then(res => {
                                json = JSON.stringify(res, null, 2);
                                const object = JSON.parse(json);
                                console.log(object)
                                for (let i = 0; i < object.result.environments.length; i++) {
                                    if (object.result.environments[i].name == "testDiscovery") {
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