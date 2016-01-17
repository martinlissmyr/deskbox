var ipc = require("electron").ipcRenderer;
var isDragEvent = false;

// Pass all clicked external links to host
document.addEventListener("click", function(event) {
   var clickedEl = event.target;
   if (clickedEl.tagName !== "A" || clickedEl.href.indexOf("http") !== 0) {
      return;
   }
   ipc.sendToHost("external-link-clicked", clickedEl.href);
});

window.addEventListener("dragover", function(event) {
  // Register that a drag event is under way
  isDragEvent = true;
});

window.addEventListener("dragleave", function(event) {
  // Unregister drag event
  isDragEvent = false;
});

window.addEventListener("beforeunload", function(event) {
  // If the current window is about to unload, cancel it...
  // But only cancel it if it's the result of a drag-n-drop event
  // otherwise we make it impossible to log in
  if (isDragEvent) {
    event.returnValue = "false";
  }
}, false);

// Listen for requests to update unread messages count
ipc.on("do-unread-count", function() {
  var count = document.getElementsByClassName('ss').length.toString();
  ipc.sendToHost("unread-count-updated", count);
});

ipc.on("fetch-identity", function() {
  var avatar = document.querySelector(".gbii");
  var avatarImage = document.defaultView.getComputedStyle(avatar, null).getPropertyValue("background-image");
  var email = document.querySelector(".gb_fb .gb_mb").innerText;
  ipc.sendToHost("fetched-identity", avatarImage, email);
});
