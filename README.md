# node-red-watson-designer

## Description

This project was creating in partnership with IBM and the UCL IXN. The aim of this project is to create a plugin for 
Node-RED for the purpose of building a watson Assistant chatbot. This is a Proof of Concept initially but is released 
to open-source for further development! 

#### abstract 
Chatbots are AI agents that are rapidly becoming popular in the modern age. 
The Watson Assistant is a lets you build, train and deploy conversational interactions and create a chatbot. 
Node-RED removes lower-level abstractions in web application development. It allows users to drag and drop nodes, connect
them together to rapidly and easily build and deploy software. Sponsored by IBM, this project aims to integrate these two 
systems as a proof of concept (PoC) with a further attempt at integrating Watson Discovery (a powerful AI Search technology).
This would allow users (particularly with less technical literacy) to easily design, deploy and host a chatbot. All on Node-REDs user-friendly environment.
Example use cases include a small non-technical business owner wanting a basic chatbot on their companies’ site. 

## Visuals

## Installation
Follow these instructions to install the chatbot locally:

#### Requirements

* NodeJS Version 12.16.1 or higher
* Node-RED v1.0.3 
* All other requirements should install with package installation

## Installation
#### Local installation
* After installing Node-RED [(Instruction on install here).](https://nodered.org/docs/getting-started/local)
* Download this repo into a local repository and navigate into it.
* run the command: 

```console
(sudo) npm install -g
```

* run the local node-red system

#### Connecting Watson Assistant
* Log in to IBM cloud
* Navigate to Watson at the bottom of the drop down menu at the top right of the page
* Create a Watson Assistant Instance
* Copy Past the API key and Hosting URL into the metadata node for this chatbot.
* Your chatbot will now be connected!

## Running

1) Run node-red with the following command
    ```console
        $> node-red
    ```
2) You must first build the chatbot. To do this you must build the dialog tree with each of the nodes 
in the system. Detailed instruction can be seen in each nodes page. The minimum chatbot requires:
    * Metadata node
    * CreateWatson Node
    * Dialog Nodes
    * host node
 2) Deploy the chatbot
 3) Click the button on the metadata node to activate the system and build the chatbot
 5) The chatbot is now compiled. You will be able to access the test interface by navigating to 
 <node-red url> + test.html
 6) You now have a running chatbot.

## Basic Overview 
The Internet is connecting everyone. Therefore, business owners regularly use the Internet as a tool to promote their businesses to the rest of the world. As the number of customers increases, the harder it gets for companies to hire employees simply to answer common questions that customers might have. Thus, there is a growing need for a virtual assistant that can provide customers with instant responses and is available every hour of the day. Many users choose to use IBM's Watson Assistant to build, train, and deploy conversational interactions into their applications. However, to create a Watson Assistant Chatbot, our target

users must go through a series of complicated tutorials and move between different tools before they can design the chatbot they need on the IBM Cloud.

The purpose of the project titled "Watson Designer" is to provide a one-stop site to create a Watson Chatbot, that is more user-friendly than the original Watson Assistant Design System. We used Node-RED as the framework for our web application because of its flow-based programming, well designed GUI, and drag & drop interaction. We believe that creating the conversational interaction as a flow of nodes is more intuitive than connecting separate dialog through abstract keywords. Moreover, our project also implements Watson Discovery into our web application to help our target users create a more powerful Chatbot which could retrieve responses from a large dataset.

Our project uses Agile and Test-Driven Development (TDD) as our software development methodology to make sure we could get feedback in every small iteration and respond to new requirements swiftly. The team hosts a daily stand-up meeting online to track everyone's progress, a face-to-face SCRUM meeting every week to assign the user-stories and a review meeting every two weeks to communicate with our client from IBM.

The following sections of this report will introduce the tools we used, the work we have done, the architecture of our web application, and how we verify and validate our product. Finally, the report will also discuss the potential future developments of Watson Designer.
## Instruction for each node
There are __ main components of the system, to access the documentation for each of these click
the following the links below: 

* [Metadata Node](/nodes/metadata)
* [CreateWatson Node](/nodes/create_watson)
* [DeleteWatson Node](/nodes/delete_watson)
* [Dialog Node](/nodes/dialog)
* [Host Node](/nodes/hostbot)
* [CreateDiscovery Node](/nodes/createDiscovery)
* [DeleteDiscovery Node](/nodes/deleteDiscovery)
* [Discovery Documents Node](/nodes/discoveryDocuments)

## Tutorial Video
Coming soon

## Wiki
In an attempt to create a wiki we have used JSDoc to comment our functions to create the wiki. Unfortunately, this does not work with
Node-REDs structure and thus only JS docs are included in the wiki. This can be found [here](/docs/index.html)

## Contributing and Support
Original contributions were made by a team of UCL Students. However after completion of the project and 
publication to open source. This project will be taken over by the IBM Node-RED development team for 
open source management.  Hence, contributions should follow Node-RED guidelines.

These can be found [here](https://nodered.org/about/contribute/)

Other information for contributing can be found [here](/Development.md)

## Authors and acknowledgment
We would like to thank IBM and UCL IXN for making this project possible. 

Specifically we would like to thank: 
* **Partners:** John McNamara (Senior Inventor and IBM UK University Program Leader)
* **Supervisors** Dr. Dean Mohamedally, Dr. Emmanuel Letier & Eric-Tuan Le
* **Original Team** Jiahao Wang, Sven S. Finlay, Sigurdur Sigurdsson,
 Udomkarn Boonyaprasert, Xueting Wang and Yuhui Lin

