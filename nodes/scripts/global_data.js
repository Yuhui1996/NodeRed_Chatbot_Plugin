var global_data = module.exports = {
    data: {
        entities: {
            "Test_Entity": {
                values: [{
                    value: "Menu",
                    synonyms: ["Veg", "Normal", "Special_Menu"]
                }],
                description: "Hello",
                fuzzy_match: true
            }
        },
        intents: {
            "Test_Intent": {
                description: "",
                examples: [{text: "Hello"}, {text: "Hi"}]
            }
        }
    },
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
        this.data.entities[send_data.name].values = send_data.values;
        this.data.entities[send_data.name].description = send_data.description;
        this.data.entities[send_data.name].fuzzy_match = send_data.fuzzy_match;

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
            this.data.entities[send_data.name].values = send_data.values;
            this.data.entities[send_data.name].description = send_data.description;
            this.data.entities[send_data.name].fuzzy_match = send_data.fuzzy_match;
            return 1;
        }
    },
}