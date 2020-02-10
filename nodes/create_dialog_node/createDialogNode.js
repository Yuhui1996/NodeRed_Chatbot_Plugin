const AssistantV1 = require('ibm-watson/assistant/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

function createId(i){
    let str ="node_" + i + "_15812";
    for(let i = 0; i < 8; i++){
        str += Math.floor(Math.random()*10).toString();
    }
    return str
}


module.exports = function(RED) {
    function DialogNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        this.name = n.name;
        this.condition = n.condition;
        this.response_type = n.response_type;
        this.output = n.output;
        this.selection_policy = n.selection_policy;
        var nodeId=n.name;

        node.on('input', function(msg) {

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
/*
            console.log("msg: " + msg);
            console.log("name: " + n.name);
            console.log("condition: " + n.condition);
            console.log("response_type: " + n.response_type);
            console.log("output: " + n.output);
            console.log("selection_policy: " + n.selection_policy);
*/


            this.assistant.listDialogNodes({
                //workspaceId: '9d74b2b9-1973-4ab8-90ec-bc45ed12622e'
                workspaceId: msg.payload.workspaceId,
            })
                .then(res =>{
                    var json = JSON.stringify(res, null, 2);
                    var object = JSON.parse(json);
                    //console.log(object);
                    for (let i = 0; i < object.result.dialog_nodes.length; i++) {
                        //console.log(object.result.dialog_nodes[i].dialog_node);
                        if (object.result.dialog_nodes[i].dialog_node === nodeId) {
                            nodeId = createId(i);
                            console.log("NodeIde conflict! New Id:"+ nodeId);
                            //this.value =nodeId;
                        }
                    }



                    this.assistant.createDialogNode({
                        //workspaceId: '9d74b2b9-1973-4ab8-90ec-bc45ed12622e',
                        workspaceId: msg.payload.workspaceId,
                        dialogNode : nodeId,
                        conditions: n.condition,
                        //parent: n.parent,
                        previousSibling: "Welcome",
                        output: {
                            generic: [
                                {
                                    values: [
                                        {
                                            text: n.output, //response text
                                        }
                                    ],
                                    response_type: "text",
                                    selection_policy: n.selection_policy,  //sequential,random,multiline
                                }
                            ]
                        },
                        title:n.name,
                        type: "standard"
                    })
                        .then(res => {
                            console.log(JSON.stringify(res,null,2));
                            msg.payload = "DialogNode created";
                            node.send(msg);
                        })
                        .catch(err =>{
                            console.log(err);
                            msg.payload = "Creating nodes failed!";
                            node.send(msg);
                        });


                })
                .catch(err =>{
                    console.log(err);
                });


        });
    }

    RED.nodes.registerType("Dialog", DialogNode);
}