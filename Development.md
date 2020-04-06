# NodeRed_Chatbot_Plugin

Node-red is based on Node.js, so to run this you need:

1. Node.js,https://www.google.com/search?client=safari&rls=en&q=node.js&ie=UTF-8&oe=UTF-8
2. Node-Red, https://nodered.org

To run the plugin, follow https://nodered.org/docs/creating-nodes/first-node. You should be able to see the new node,'lowercase' on the function subsection of Node-Red.

...................

# Development Branching strategy: Case-Branch

## Branching

- When you start a new story/task
- Create a Branch with the following format:

  <developer_initials>_<Story_name>_<Sprint_Number>

Pull Request into development when the story is done. This pull request must be reviewed by
at least 1 other developer before being merged.

After each Sprint, merge into release branch / Master branch.



....................


# Using the nodes with the global intent and entity system
The project has been designed so that the nodes in the system can communicate with each other via http. This allows users to select intents they wish to use or create new ones.
When creating a new node the node will make an http call to the *CreateWatson* Node. Hence this must be on the dashboard for the other nodes to work correctly.

The format that the data must be sent to the node is as follows:

### Entities:

```json
{
  "control": "add / remove / update",
  "type": "entity",
  "name": "Str"
  "description":  "Str",
  "fuzzy_match": "boolean",
  "values": [{"value": "Str", "synonyms": ["str","str"]}]  
}
``` 

### Intents:

```json

{
  "control": "add / remove / update",
  "type": "intent",
  "name": "Str",
  "description":  "Str",
  "examples": "[{'text':'Str'}]"
}
``` 

## To retrieve the data call the following:

```javascript
 $.getJSON('global_data', function (global_data) {
     let intents = global_data.intents;
     let entities = global_data.entities;
 }
```
### Node that the data retrieved will be in the following format:

```json
{
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

```

## To send new data complete the following is an example: 

```javascript
  $.post("/global_data","<intent or entity object>")
                        .done(function (data) {
                            alert("Data Loaded: " + data);
                        });
```