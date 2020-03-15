var global_data = module.exports = {
    data: undefined,
    add_intent: function (send_data) {

        let intent_data = {
            description: send_data.description,
            examples: send_data.examples
        }
        this.data.intents[send_data.name] = intent_data;
        return 1;
    },
    remove_intent: function (send_data) {

        if (this.data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            delete this.data.intents[send_data.name];
            return 1;
        }

    },
    edit_intent: function (send_data) {
        if (this.data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            let intent_data = {
                description: send_data.description,
                examples: send_data.examples
            }
            this.data.intents[send_data.name] = intent_data;
            return 1;
        }
    },
    add_entity: function (send_data) {

        console.log("This is send data \n\n " + send_data.values);


        let entity_data = {
            description: send_data.description,
            fuzzy_match: send_data.fuzzy_match,
            values: send_data.values
        }

        this.data.entities[send_data.name] = entity_data;

    },
    remove_entity: function (send_data) {
        if (this.data.entities[send_data.name] == undefined) {
            return -1;
        } else {
            delete this.data.entities[send_data.name];
            return 1;
        }
    },
    edit_entity: function (send_data) {
        if (this.data.entities[send_data.name] == undefined) {
            return -1;
        } else {


            let entity_data = {
                description: send_data.description,
                fuzzy_match: send_data.fuzzy_match,
                values: send_data.values
            }

            this.data.entities[send_data.name] = entity_data;

            return 1;
        }
    },
    add_dialog_discovery_map: function (send_data) {

        let discoveryID = send_data.discoveryID;
        this.data.dialogDiscoveryMap[send_data.dialog] = discoveryID;
        return 1;
    },
    remove_dialog_discovery_map: function (send_data) {

        if (this.data.dialogDiscoveryMap[send_data.dialog] == undefined) {
            return -1;
        } else {
            delete this.data.dialogDiscoveryMap[send_data.dialog];
            return 1;
        }

    },
    edit_dialog_discovery_map: function (send_data) {
        if (this.data.dialogDiscoveryMap[send_data.dialog] == undefined) {
            return -1;
        } else {
            let discoveryID = send_data.discoveryID;
            this.data.dialogDiscoveryMap[send_data.dialog] = discoveryID;
            return 1;
        }
    },
}