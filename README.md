# Hackermen
Developers: [George Tay](https://github.com/georgetayqy), [Phua Zai Lian](https://github.com/pzl111), [Sebastian Tay](https://github.com/Sebtey) , [Tham You Wei](https://github.com/tyouwei)

## Introduction
In this hackathon, we are working on Topic 4: Building UI for the AI Era with Lynx.

The development tools that we used to build this project are:
- VSCode
- Github
- Amazon Bedrock (API)
- ArgoCD
- Kubernetes


Libraries used:
- Lynx

## Installation
To set up locally, git clone from this [repository](https://github.com/PSA-Hackermen/TechJam-Hackathon) into a local folder.

Following which, using the CLI, enter `cd ai-yapper-agent/` to change directory to `ai-yapper-agent/`.

Now, run the following commands in sequence to set up and run the project:

1. `npm install`

2. `npm run build`

3. `npm run dev` will run the project and show a QR code in the CLI which you can scan with Lynx Go, an application that you need to install from your mobile app store.


For the AWS bedrock API call, you will need to configure and setup your AWS Bedrock and update the API endpoint in `./ai-yapper-agent/src/hooks/useChat.ts`. Also, do add in your X_API_KEY that will be part of your fetch request in your `./ai-yapper-agent/.env` file under `PUBLIC_X_API_KEY`.


## Features
Our project seeks to integrate AI capabilities onto a Lynx project to build an AI chatbot.

We achieved this by leveraging on Amazon Bedrock's available Foundation Models, which provides an API that our Lynx project will call upon.

Through this, we seek to showcase how AI can reshape user experiences particularly through Lynx.

On top of the integrated AI capabilities, our project, being built on top of Lynx as its UI stack, has the ability to run on various platforms such as IOS and Android.
