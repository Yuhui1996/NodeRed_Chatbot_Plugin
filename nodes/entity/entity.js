const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');


module.exports = function (RED) {
    function EntityNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.on('input', function (msg) {
                this.rules = n.rules;
                this.name = n.name;
                this.value = n.values;
                this.values = n.values || ["test"];
                this.messages = [];

                try {
                    this.assistant = this.context().flow.get("assistant");
                } catch (e) {
                    console.log("context not found");
                } finally {
                    if (this.assistant == null || this.assistant == undefined) {
                        this.assistant = new AssistantV1({
                            version: '2019-02-08',
                            authenticator: new IamAuthenticator({
                                apikey: msg.payload.wa_api_key,
                            }),
                            url: msg.payload.instance_url
                        });
                    }
                }


                console.log(this.values);
                this.assistant.createEntity({
                    workspaceId: msg.payload.workspaceId,
                    entity: this.name,
                    values: this.values

                })
                    .then(res => {
                        console.log("name: " + this.name)
                        console.log(JSON.stringify(res, null, 2));

                        for (i = 0; i < this.rules.length; i++) {

                            var next_entry = this.rules[i];
                            var value = next_entry.v;

                            for (j = 0; j < next_entry.s.length; j++) {
                                var item = next_entry.s[j];


                                this.assistant.createSynonym({
                                    workspaceId: msg.payload.workspaceId,
                                    entity: this.name,
                                    value: value,
                                    synonym: item

                                })
                                    .then(res => {
                                        console.log("name: " + this.name)
                                        console.log(JSON.stringify(res, null, 2));
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    });
                            }


                            var next_payload = {};

                            next_payload.payload = {
                                workspaceId: msg.payload.workspaceId,
                                wa_api_key: msg.payload.wa_api_key,
                                ta_api_key: msg.payload.ta_api_key,
                                discovery_api_key: msg.payload.discovery_api_key,
                                instance_url: msg.payload.instance_url,
                                entity_name:  this.name,
                                entity_value: value
                            }

                            this.messages.push(next_payload);

                        }

                        console.log(this.messages);
                        node.send(this.messages);


                    })
                    .catch(err => {
                        console.log(err)
                    });

                console.log(this.rules);

                // this.rules.forEach(function (i ) {
                //
                //     this.currentItem = (this);
                //     console.log(this.currentItem);

                // this.s.forEach(function (j) {
                //
                // });
                // });

            }
        );
    }

    RED.nodes.registerType("entity", EntityNode);
}