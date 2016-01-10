## What is it?
A wrapper desktop app for Google Inbox.

## Download
Download the [latest release](https://github.com/martinlissmyr/deskbox/releases/latest).

## Develop

### To get started do:  
* `npm install`  
* `npm start`

### To build it do:
* `npm run build`
and the built app will be available in `/dist/v0.36.3/` (that's the version of the Electron app)

### To bump version and build do:
* `npm version patch`
will automatically bump the version in package.json and commit the change, create a tag, push it and build the app

### To release do:
* Make sure everything is commited in master
* Make sure you've bumped version and built the app
* `npm run release`
 will create a release on Github, tag it and upload the app binary corresponding to the version in package.json