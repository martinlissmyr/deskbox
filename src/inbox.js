var ipc = require("electron").ipcRenderer;
var shell = require("electron").shell;
var webview = document.getElementById("inbox");
var remote = require("electron").remote;

function setBadge(str) {
  remote.app.dock.setBadge(str);
}

function triggerUnreadCheck() {
  webview.send("do-unread-count");
  setTimeout(triggerUnreadCheck, 3000);
}

webview.addEventListener("ipc-message", function(e){
  if (e.channel === "external-link-clicked") {
    // Make sure external links are opened in a browser
    //console.log("href: " + e.args[0]);
    shell.openExternal(e.args[0]);
  } else if (e.channel === "unread-count-updated") {
    // Update icon badge with unread count
    setBadge(e.args[0] === "0" ? "" : e.args[0]);
  }
});

webview.addEventListener("dom-ready", function() {
  triggerUnreadCheck();
});
