var shell = require("electron").shell;

function Inbox(id, navigationContainer, inboxesContainer) {
  this.id = id;
  this.isActive = false;
  this.navigationItem = this.createNavigationItem(navigationContainer);
  this.navigationCloseButton = this.createNavigationCloseButton();
  this.webview = this.createInboxWebview(inboxesContainer);

  this.webview.addEventListener("dom-ready", (function() {
    this.triggerFetchIdentity();
    this.triggerUnreadCheck();
  }).bind(this));

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
    }
  }).bind(this));

  this.navigationItem.addEventListener("click", (function(e) {
    var e = new CustomEvent("navigation-event", {
      "detail": {
        "id": this.id
      }
    });
    navigationContainer.dispatchEvent(e);
  }).bind(this));

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
  webview.setAttribute("partition", "persist:inbox" + this.id);
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
