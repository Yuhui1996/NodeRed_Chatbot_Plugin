var global_data = module.exports = {
    data: {
        entities: {
            "Test_Entity": [{
                value: "Menu",
                synonyms: ["Veg", "Normal"]
            }]
        },
        intents: {
            "Test_Intent": ["Hello", "Hi"]
        }

    },
    add_intent: function (send_data) {

        if (data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            data.intents[send_data.name] = send_data.examples;
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
            data.intents[send_data.name] = send_data.examples;
            return 1;
        }
    },
    add_entity: function (send_data) {
        if (data.entities[send_data.name] == undefined) {
            return -1;
        } else {
            data.entities[send_data.name] = send_data.values;
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
            data.entities[send_data.name] = send_data.values;
            return 1;
        }
    },
}