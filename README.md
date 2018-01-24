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
* `npm run dist`
and the built app will be available in `/dist/`

In order to build you need to have a [developer license](https://developer.apple.com/account/mac/certificate/certificateList.action) installed in your keychain. You also need to set your `identity` in the package.json file.

### To bump version:
* `npm version patch`
will automatically bump the version in package.json

### To release do:
* Make sure everything is commited in master
* Make sure you've bumped version
* Do `export GH_TOKEN="<YOUR_TOKEN_HERE>"`
* `npm run publish`
* Release the release on GitHub by going to https://github.com/martinlissmyr/deskbox/releases, editing the release and clicking "Publish release."
