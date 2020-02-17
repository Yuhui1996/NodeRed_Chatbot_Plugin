var global_data = module.exports = {
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
    },
    remove_intent: function () {
        Counter.count += 10;
    },
    edit_intent: function () {
        Counter.count += 10;
    },
    add_entity: function () {
        Counter.count += 10;
    },
    remove_entity: function () {
        Counter.count += 10;
    }
}