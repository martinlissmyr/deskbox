const remote = require("electron").remote;
const shell = require("electron").shell;
const session = remote.require("session");

function Inbox(id, navigationContainer, inboxesContainer) {
  this.id = id;
  this.isActive = false;
  this.sessionName = "persist:inbox" + this.id;
  this.navigationItem = this.createNavigationItem(navigationContainer);
  this.navigationCloseButton = this.createNavigationCloseButton();
  this.webview = this.createInboxWebview(inboxesContainer);

  // Set download path to current users Downloads folder
  session.fromPartition(this.sessionName).setDownloadPath(process.env.HOME + "/Downloads");

  // Wait for Google Inbox to load
  this.webview.addEventListener("dom-ready", (function(e) {
    this.triggerFetchIdentity();
    this.triggerUnreadCheck();
  }).bind(this));

  // Listen to messages from injected js
  this.webview.addEventListener("ipc-message", (function(e) {
    if (e.channel === "external-link-clicked") {
      // Make sure external links are opened in a browser
      shell.openExternal(e.args[0]);
    } else if (e.channel === "unread-count-updated") {
      // Update badge(s) with unread count
      this.setNavigationItemBadge(e.args[0]);
      if (this.isActive) {
        var e = new CustomEvent("active-inbox-count-update", {
          "detail": {
            "count": e.args[0]
          }
        });
      }
    } else if (e.channel === "fetched-identity") {
      this.navigationItem.classList.add("has-avatar");
      this.navigationItem.style.backgroundImage = e.args[0]; // Set avatar as background
      this.navigationItem.setAttribute("title", e.args[1]); // Set email as title
    } else if (e.channel === "debug") {
      console.log(e.args[0]);
    }
  }).bind(this));

  // Send navigation item clicks to the chrome
  this.navigationItem.addEventListener("click", (function(e) {
    var e = new CustomEvent("navigation-event", {
      "detail": {
        "id": this.id
      }
    });
    navigationContainer.dispatchEvent(e);
  }).bind(this));

  // Send close button clicks to the chrome
  this.navigationCloseButton.addEventListener("click", (function(e) {
    var e = new CustomEvent("close-inbox", {
      "detail": {
        "id": this.id
      }
    });
    navigationContainer.dispatchEvent(e);
  }).bind(this));

}

Inbox.prototype.createInboxWebview = function(parent) {
  var webview = document.createElement("webview");
  webview.setAttribute("preload", "inject.js");
  webview.setAttribute("partition", this.sessionName);
  webview.setAttribute("src", "http://inbox.google.com");
  webview.setAttribute("id", "inbox-" + this.id);
  webview.setAttribute("class", "inbox");
  parent.appendChild(webview);
  return webview;
}

Inbox.prototype.createNavigationItem = function(parent) {
  var navigationItem = document.createElement("div");
  navigationItem.setAttribute("class", "nav-item");
  navigationItem.setAttribute("data-id", "" + this.id);
  parent.appendChild(navigationItem);
  return navigationItem;
}

Inbox.prototype.createNavigationCloseButton = function() {
  var navigationCloseButton = document.createElement("div");
  navigationCloseButton.setAttribute("class", "nav-item-close");
  var closeText = document.createTextNode("✕");
  navigationCloseButton.appendChild(closeText);
  this.navigationItem.appendChild(navigationCloseButton);
  return navigationCloseButton;
}

Inbox.prototype.destroy = function() {
  this.navigationItem.parentNode.removeChild(this.navigationItem);
  this.webview.parentNode.removeChild(this.webview);
  clearTimeout(this.unreadCheckTimer);
}

Inbox.prototype.triggerUnreadCheck = function() {
  this.webview.send("do-unread-count");
  this.unreadCheckTimer = setTimeout(this.triggerUnreadCheck.bind(this), 3000);
}

Inbox.prototype.openComposeWindow = function(options) {
  if (this.webview.isLoading()) {
    // We're not done loading, hold on...
    this.webview.addEventListener("dom-ready", (function() {
      // Ok, webview has loaded, wait an extra second to make sure
      // The Inbox JS app is rendered
      setTimeout((function() {
        this.webview.send("open-compose-window", options);
      }).bind(this), 1000);
    }).bind(this));
  } else {
    // We're already up and running, fire away...
    this.webview.send("open-compose-window", options);
  }
}

Inbox.prototype.triggerFetchIdentity = function() {
  this.webview.send("fetch-identity");
}

Inbox.prototype.setNavigationItemBadge = function(count) {
  if (count == 0) {
    this.navigationItem.classList.remove("has-counter");
    this.navigationItem.removeAttribute("count");
  } else {
    this.navigationItem.classList.add("has-counter");
    this.navigationItem.setAttribute("count", count > 99 ? "99+" : count);
  }
}

Inbox.prototype.activate = function() {
  this.isActive = true;
  this.navigationItem.classList.add("active");
  this.webview.classList.add("active");
}

Inbox.prototype.inActivate = function() {
  this.isActive = false;
  this.navigationItem.classList.remove("active");
  this.webview.classList.remove("active");
}

module.exports = Inbox;
