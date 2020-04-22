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


## Why dotEnvy?
I wanted to share API keys with teammates on a project we were collaborating on, and didn't really find a good easy solution on the internet. I wanted a secure way to automatically sync out .env files, without creating an account somewhere or storing something on third party servers.

## Why Electron??
I created this primarily as an experiment - create a complete Electron app is probably overkill. That being said, I'm working on creating a lightweight CLI version. 
