# upload document

## Visual 

<p align="center">
            <img width="100%" height="100%" src="./readme_data/discoveryDocument.gif.gif"  border="4" >
</p>

## Tutorial

1) drag a metadatanode, fill all information in metadata node
2) drag a creatediscovery node, enter the name you like to call the discovery
3) link them together
4) drag a discoveryDocument node, enter the exact filepath of the file you want to upload
5) link the discoveryDocument node to the discovery you like to upload the document
4) deploy and inject

## Notes
please making sure you have fullfill the required input field, and it's important to have the correct
api key and url in the metadata node. Making sure you need to enter the exact filepath of the document, you can
usually get that path by right click the document and  click property in Window, get info on Mac.
## Requirements
* ibm-watson
* jQuery
* fs
* path