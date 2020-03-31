/**
 * @class Global_Data
 * @description Manage the global data system that is used for entity and intent creation
 * @type {{add_entity: add_entity, data: undefined, edit_intent: edit_intent, remove_entity: remove_entity, edit_entity: edit_entity, add_dialog_discovery_map: (function(*): number), remove_intent: remove_intent, remove_dialog_discovery_map: remove_dialog_discovery_map, edit_dialog_discovery_map: edit_dialog_discovery_map, add_intent: (function(*): number)}}
 */
var global_data = module.exports = {
    /**
     * @memberOf Global_Data
     * @example
     * {
      "entities": {
            "Test_Entity": {
                "values": [{
                    "value": "Menu",
                    "synonyms": ["Veg", "Normal", "Special"]
                }],
                "description": "Hello",
                "fuzzy_match": true
            }
        },
        "intents": {
            "Test_Intent": {
                "description": "",
                "examples": [{"text": "Hello"}, {"text": "Hi"}]
            }
        }
}
     * @inner Main data content
     * @var Data
     */
    data: undefined,
    /**
     * @memberOf Global_Data
     * @function create intent
     * @param {json} send_data: json object containing intent data
     * @returns {boolean}
     */
    add_intent: function (send_data) {

        let intent_data = {
            description: send_data.description,
            examples: send_data.examples
        }
        this.data.intents[send_data.name] = intent_data;
        return true;
    },
    /**
     * @memberOf Global_Data
     * @description Remove intent from current object
     * @function remove intent
     * @param {json} send_data: json object containing intent data
     * @returns {number}
     */
    remove_intent: function (send_data) {

        if (this.data.intents[send_data.name] == undefined) {
            return -1;
        } else {
            delete this.data.intents[send_data.name];
            return 1;
        }

    },
    /**
     * @memberOf Global_Data
     * @description Edit intent in current object
     * @function edit intent
     * @param {json} send_data: json object containing intent data
     * @returns {number}
     */
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
    /**
     * @memberOf Global_Data
     * @description Create new entity in global data
     * @function Create entity
     * @param  {json} send_data: json object containing entity data
     * @returns {number} Complete
     */
    add_entity: function (send_data) {

        console.log("This is send data \n\n " + send_data.values);


        let entity_data = {
            description: send_data.description,
            fuzzy_match: send_data.fuzzy_match,
            values: send_data.values
        }

        this.data.entities[send_data.name] = entity_data;

    },
    /**
     * @memberOf Global_Data
     * @description Remove old entity in global data
     * @function Remove entity
     * @param {json} send_data: json object containing entity data
     * @returns {number} Complete
     */
    remove_entity: function (send_data) {
        if (this.data.entities[send_data.name] == undefined) {
            return -1;
        } else {
            delete this.data.entities[send_data.name];
            return 1;
        }
    },
    /**
     * @memberOf Global_Data
     * @description Create new entity in global data
     * @function Create entity
     * @param {json} s send_data: json object containing entity data
     * @returns {number} Complete
     */
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