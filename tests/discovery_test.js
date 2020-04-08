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
let found = false
let environment_id


helper.init(require.resolve('node-red'));

describe('create discovery Node', function() {

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
            type: "createDiscovery",
            name: "discovery"
        }];
        helper.load(createDiscovery, flow, function () {
            var n1 = helper.getNode("n1");
            console.log(n1);
            n1.should.have.property('name', "discovery");
            done();
        });
    });
    it('discovery should be created', function(done) {
        this.timeout(20000);
        var found = false;
        var flow = [{
            id: "n1",
            type: "createDiscovery",
            name: "testDiscovery",
            discoveryname: "testDiscovery",
            wires: [
                ["n2"]
            ]
        },
            {
                id: "n2",
                type: "helper"
            }
        ];
        helper.load(createDiscovery, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n1.receive({
                payload: {
                    discovery_api_key: apikey,
                    discoveryUrl: url,
                },
            });
            n2.on("input", function(msg) {
                waitFor(2000).then(() => { //wait for internal api call from node red. currently no way of accessing promise from n1

                    discovery.listEnvironments()
                        //.then(res => {n1.receive({ payload: testNode }); return res;})//not really working. does not wait for node red
                        .then(res => {

                            json = JSON.stringify(res, null, 2);
                            const object = JSON.parse(json);
                            // console.log(json)
                            for (let i = 0; i < object.result.environments.length; i++) {
                                console.log(object.result.environments[i].name == "testDiscovery")
                                if (object.result.environments[i].name == "testDiscovery") {
                                    found = true
                                    environment_id = object.result.environments[i].environment_id
                                    const deleteparams={
                                        environmentId :environment_id
                                    };
                                    discovery.deleteEnvironment(deleteparams).then(deleteEnvironmentResponse => {
                                        jsonObject = JSON.stringify(deleteEnvironmentResponse, null, 2);
                                        console.log("hiya")
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                    break
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
