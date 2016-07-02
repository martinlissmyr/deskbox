const remote = require("electron").remote;
const Inbox = require("./inbox.js");
const ipcRenderer = require("electron").ipcRenderer;
const dialog = remote.require("electron").dialog;
var config = require("./config.js");

// Get persisted settings
var storedInboxIds = getStoredInboxes();
var navigationBarIsShowing = getNavigationBarStatus() == "visible" ? true : false;

// Set up base vars
var inboxes = {};
var currentInbox = null;
var inboxesContainer = document.getElementById("inboxes");
var navigationBar = document.getElementById("accounts-navigation-bar");
var navigationContainer = document.getElementById("accounts-navigation");
var accountAddButton = document.getElementById("add-account");

// Start up
if (storedInboxIds.length === 0) {
  addInbox(); // If no inboxes are stored, create one...
} else {
  initiateInboxes(); // Initiate all the stored inboxes...
}
if (navigationBarIsShowing) {
  showNavigationBar();
}

// Activate the first inbox
activateFirstInbox();

// Listen for activation of an inbox
navigationContainer.addEventListener("navigation-event", function(e) {
  activateInbox(e.detail.id);
});

// Listen for closing of an inbox
navigationContainer.addEventListener("close-inbox", function(e) {
  var confirmation = dialog.showMessageBox(
    remote.getCurrentWindow(),
    {
      type: "question",
      buttons: ["Yes, remove it!", "Eh, no!"],
      title: "Confirm",
      message: "Are you sure you want to remove this account button?"
    }
  );
  if (confirmation === 0) {
    removeInbox(e.detail.id);
  }
});

// Listen for unread count updates for the active inbox
navigationContainer.addEventListener("active-inbox-count-update", function(e) {
  remote.app.dock.setBadge(e.detail.count === "0" ? "" : e.detail.count);
});

// Listen for inbox adds
accountAddButton.addEventListener("click", function(e) {
  addInbox();
});

ipcRenderer.on("toggle-multiple-account-toolbar", function(e) {
  if (navigationBarIsShowing) {
    hideNavigationBar();
  } else {
    showNavigationBar();
  }
});

ipcRenderer.on("mailto", function(e, address) {
  if (currentInbox);
  currentInbox.openComposeWindow({
    address: address
  });
});


function generateId() {
  return "" + (new Date()).valueOf().toString();
}

function addInbox() {
  var uniqueId = generateId();
  storedInboxIds.push(uniqueId);
  inboxes[uniqueId] = new Inbox(uniqueId, navigationContainer, inboxesContainer);
  activateInbox(uniqueId);
  setMultipleInboxesState();
  persistInboxes();
}

function removeInbox(id) {
  inboxes[id].destroy();
  delete inboxes[id];
  storedInboxIds.splice(storedInboxIds.indexOf(id), 1);
  setTimeout(function() {
    activateFirstInbox(); // Wait a few milliseconds before switching
  }, 100);
  setMultipleInboxesState();
  persistInboxes();
}

function initiateInboxes() {
  for (var i in storedInboxIds) {
    inboxes[storedInboxIds[i]] = new Inbox(storedInboxIds[i], navigationContainer, inboxesContainer);
  }
  setMultipleInboxesState();
}

function activateFirstInbox() {
  currentInbox = inboxes[Object.keys(inboxes)[0]];
  currentInbox.activate();
}

function persistInboxes() {
  config.set("stored-inboxes", storedInboxIds);
}

function getStoredInboxes() {
  return config.get("stored-inboxes") || [];
}

function setMultipleInboxesState() {
  if (Object.keys(inboxes).length > 1) {
    navigationContainer.classList.add("has-multiple-inboxes");
  } else {
    navigationContainer.classList.remove("has-multiple-inboxes");
  }
}

function activateInbox(id) {
  for (var inboxId in inboxes) {
    if (inboxId !== id) {
      inboxes[inboxId].inActivate();
    } else {
      inboxes[inboxId].activate();
    }
  }
  currentInbox = inboxes[inboxId];
}

function showNavigationBar() {
  navigationBar.style.display = "block";
  navigationBarIsShowing = true;
  persistNavigationBarStatus();
}

function hideNavigationBar() {
  navigationBar.style.display = "none";
  navigationBarIsShowing = false;
  persistNavigationBarStatus();
}

function getNavigationBarStatus() {
  return config.get("navigation-bar-status");
}

function persistNavigationBarStatus() {
  config.set("navigation-bar-status", navigationBarIsShowing ? "visible" : "hidden");
}
