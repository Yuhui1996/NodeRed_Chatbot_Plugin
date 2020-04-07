# Create Watson Node 

## Visual 

<p align="center">
            <img width="100%" height="100%" src="create.gif"  border="4" >
</p>

## Components
This is a relatively simple module. The HTML is the frontend and js is backend. 

##### HTML 
The HTML contains the following components

* Holds little other than formatting

##### JS 

The JS file creates the assistant on the backend doing the following: 
* Start Global Variables 
    * dialog id counter
    * assistant api object
    * Sibling manager of dialog ordering
* Manage global variable communications with dialog nodes 
    * Saving json file on run for persistence
* Create Watson Assistant Workspace 
* Create Intents and Entities API call


## Tutorial

1) Copy the node onto the flow.
2) Connect node to metadata node 
3) The node is now ready and is the top of the dialog tree
4) Start connections to dialog nodes to this node. 

## Notes
Originally we were considering merging the code from this node into the metadata node. However we 
decided against that so that it becomes easier to delete workspaces with a seperate delete node.
## Requirements
* ibm-watson
* jQuery
* fs
* path