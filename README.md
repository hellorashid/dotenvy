# dotEnvy
## open source .env manager

dotEnvy is an environment variable &  .env file manager.  It also lets you sync your variables across computers. Data is only transferred peer-to-peer, and nothing is sent to servers or databases, because well, there arn't any. 

dotEnvy is free and open source! Do with it what you please.

# Install 

1. Install from the Releases Page

2. Build Locally: 

- ```npm i```

- Based on your machine:
```
npm run pack:win
npm run pack:mac
npm run pack:linux
```

# Instructions

1. After installing, create a project and choose a directory. 
2. Add the variables you want, and click create. This will create a local .env file
3. If you are sharing your enviroment with a teammate, you will need to send them your Share ID. 
4. Click 'Start Sharing' - This will start your p2p server.
4. If you are importing variables, click 'Import' and enter the ID of your peer. This will automatically import the variables and add them to your local project.

## Where is data stored?
Everything is stored locally, on your device. 

## How do is data transferred? 
When you chose to share variables, a p2p connection is established and data is transfered and then stored on the local machine. There are no databses or servers.  

## Is this secure?
I think so. I'm no security expert. Probably still safer than texting your API keys though.  

## Why dotEnvy?
I wanted to share API keys with teammates on a project we were collaborating on, and didn't really find a good easy solution on the internet. I wanted a secure way to automatically sync out .env files, without creating an account somewhere or storing something on third party servers.

## Why Electron??
I created this primarily as an experiment - create a complete Electron app is probably overkill. That being said, I'm working on creating a lightweight CLI version. 
