## What is it?
A wrapper desktop app for Google Inbox.

## Download
Download the [latest release](https://github.com/martinlissmyr/deskbox/releases/latest).

## Develop

### To get started do:  
* Run `npm install` in the src folder  
* Run `npm install` in the repository root folder  
* `npm start` to run the app

### To build it do:
* `npm run build`
and the built app will be available in `/dist/`

In order to build you need to have a [developer license](https://developer.apple.com/account/mac/certificate/certificateList.action) installed in your keychain. You also need to set your `DEVELOPER_IDENTITY` in a .env file in the root.

### To bump version and build do:
* `npm version patch`
will automatically bump the version in package.json and commit the change, create a tag, push it and build the app

### To release do:
* Make sure everything is commited in master
* Make sure you've bumped version and built the app
* `npm run release`
 will create a release on Github, tag it and upload the app binary corresponding to the version in package.json
