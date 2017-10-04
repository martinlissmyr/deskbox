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

// Listen for "open compose window" events
ipc.on("open-compose-window", function(e, options) {
  var composeButton = document.querySelector(".y.hC");
  composeButton.click();
  setTimeout(function() {
    // Wait a few milliseconds to allow composer to open
    if (options) {
      if (options.address) {
        var addressField = document.querySelector(".lS.eF input");
        addressField.value = options.address;
      }
    }
    var subjectField = document.querySelector(".iO input");
    subjectField.focus();
  }, 200);
});

// Listen for "open reminder window" events
ipc.on("open-reminder-window", function(e, options) {
  var reminderButton = document.querySelector(".o8");
  reminderButton.click();
});

// Listen for "goto-folder-inbox" events
ipc.on("goto-folder-inbox", function(e) {
  var button = document.querySelector(".oin9Fc.cN");
  button.click();
});

// Listen for "goto-folder-snoozed" events
ipc.on("goto-folder-snoozed", function(e) {
  var button = document.querySelector(".navIconUpcoming");
  button.click();
});

// Listen for "goto-folder-done" events
ipc.on("goto-folder-done", function(e) {
  var button = document.querySelector(".navIconDone");
  button.click();
});

// Listen to "fetch identity" events
ipc.on("fetch-identity", function() {
  var avatar = document.querySelector(".gbii");
  var avatarImage = document.defaultView.getComputedStyle(avatar, null).getPropertyValue("background-image");
  var email = document.querySelector(".gb_ob").innerText;
  ipc.sendToHost("fetched-identity", avatarImage, email);
});
