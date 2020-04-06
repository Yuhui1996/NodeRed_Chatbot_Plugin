# Hostbot
The purpose of this custom node is to generate a url link and open a new tab which navigates to a webpage that 'host' the created chatbot.

## Usage
It needs be connected to the metanode (with api key and url included), or create_watson so that it will automatically choose the created workspace.

The msg.payload of this node contains the snip of the chatbot widget which can be inserted into webpages. It can be viewd by connectting a node just as debug to output the code.

### Dependency
- [open](https://www.npmjs.com/package/open)
- [connect](https://www.npmjs.com/package/open)
- [serve-static](https://www.npmjs.com/package/serve-static)
- [ngrok](https://www.npmjs.com/package/ngrok)

For ngrok use:
```
sudo npm i -g ngrok --unsafe-perm=true --allow-root
```
if you have difficulties installing ngrok dependency. Also, please restart node-red to restart the flow as localhost does not stop running when a new flow has started, causeing a conflicted port.

### Note
Currently the webpage provides no security to the api key at all as every api calls to watson is done through client side js.
