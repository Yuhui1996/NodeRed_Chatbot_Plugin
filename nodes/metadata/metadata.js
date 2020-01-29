module.exports = function(RED) {
    function MetadataNode(n) {
        RED.nodes.createNode(this, n);
        this.payload = n.payload;
        this.payloadType = n.payloadType;
        var node = this;

        this.on("input", function(msg) {
            msg.topic = this.topic;
            if (this.payloadType === 'str') {
                try {
                    if (this.payloadType == null) {
                        msg.payload = this.payload;
                    } else if (this.payloadType === 'none') {
                        msg.payload = "";
                    } else {
                        msg.payload = RED.util.evaluateNodeProperty(this.payload, this.payloadType, this, msg);
                    }
                    this.send(msg);
                    msg = null;
                } catch (err) {
                    this.error(err, msg);
                }
            }
        });
    }

    RED.nodes.registerType("metadata", MetadataNode);

    RED.httpAdmin.post("/metadata/:id", RED.auth.needsPermission("inject.write"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch (err) {
                res.sendStatus(500);
                node.error(RED._("inject.failed", {
                    error: err.toString()
                }));
            }
        } else {
            res.sendStatus(404);
        }
    });
}