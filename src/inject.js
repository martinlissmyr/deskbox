var ipc = require("electron").ipcRenderer;

// Pass all clicked external links to host
document.addEventListener("click", function(event) {
   var clickedEl = event.target;
   if (clickedEl.tagName !== "A" || clickedEl.href.indexOf("http") !== 0) {
      return;
   }
   ipc.sendToHost("external-link-clicked", clickedEl.href);
});

// Listen for requests to update unread messages count
ipc.on("do-unread-count", function() {
  var count = document.getElementsByClassName('ss').length.toString();
  ipc.sendToHost("unread-count-updated", count);
});
