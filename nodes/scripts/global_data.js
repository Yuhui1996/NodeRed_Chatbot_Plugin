var global_data = module.exports = {
<<<<<<< HEAD
        entities: [{
            name: "Test_Entity",
            values: [{
                value: "Menu",
                synonyms: ["Veg","Normal"]
            }]
        }],
        intents: [{
            name: "Test_Intent",
            examples: ["Hello", "Hi"]
        }],
        
    add_intent: function () {
        Counter.count += 10;
=======
    data: {
        entities: {},
        intents: {}
    },
    add_intent: function (send_data) {

        let intent_data = {
            description: send_data.description,
            examples: send_data.examples
        }
        data.intents[send_data.name] = intent_data;
        return 1;


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
                description: send_data.description,
                examples: send_data.examples
            }
            data.intents[send_data.name] = intent_data;
            return 1;
        }
>>>>>>> 933ff8901457a3f432ac06b9f586b3ab00b71146
    },
    add_entity: function (send_data) {
        data.entities[send_data.name].values = send_data.values;
        data.entities[send_data.name].description = send_data.description;
        data.entities[send_data.name].fuzzy_match = send_data.fuzzy_match;

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