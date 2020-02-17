var global_data = module.exports = {
    data: {
        entities: {
            "Test_Entity":{
                values:[{
                    value: "Menu",
                    synonyms: ["Veg", "Normal","Special"]
                }],
                description: "Hello",
                fuzzy_match: true
            }
        },
        intents: {
            "Test_Intent": {
                desc: "",
                examples: [{text:"Hello"}, {text:"Hi"}]
            }
        }
    },
    add_intent: function (send_data) {

        if (data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            let intent_data = {
                desc: send_data.desc,
                examples: send_data.examples
            }
            data.intents[send_data.name] = intent_data;
            return 1;
        }

    },
    remove_intent: function (send_data) {

        if (data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            delete data.intents[send_data.name];
            return 1;
        }

    },
    edit_intent: function (send_data) {
        if (data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            let intent_data = {
                desc: send_data.desc,
                examples: send_data.examples
            }
            data.intents[send_data.name] = intent_data;
            return 1;
        }
    },
    add_entity: function (send_data) {
        if (data.entities[send_data.name] == undefined) {
            return -1;
        } else {
            data.entities[send_data.name].values = send_data.values;
            data.entities[send_data.name].description = send_data.description;
            data.entities[send_data.name].fuzzy_match = send_data.fuzzy_match;
            return 1;
        }
    },
    remove_entity: function (send_data) {
        if (data.entities[send_data.name] == undefined) {
            return -1;
        } else {
            delete data.entities[send_data.name];
            return 1;
        }
    },
    edit_entity: function (send_data) {
        if (data.entities[send_data.name] == undefined) {
            return -1;
        } else {
            data.entities[send_data.name].values = send_data.values;
            data.entities[send_data.name].description = send_data.description;
            data.entities[send_data.name].fuzzy_match = send_data.fuzzy_match;
            return 1;
        }
    },
}