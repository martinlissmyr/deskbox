"use strict";
const {TouchBar, BrowserWindow} = require("electron");
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar;
const path = require("path");

const inboxButton = new TouchBarButton({
  label: "Inbox",
  icon: path.join(__dirname, "/icons/icon-inbox.png"),
  iconPosition: "left",
  click: () => {
    BrowserWindow.getFocusedWindow().webContents.send("goto-inbox");
  }
});

const snoozedButton = new TouchBarButton({
  label: "Snoozed",
  icon: path.join(__dirname, "/icons/icon-upcoming.png"),
  iconPosition: "left",
  click: () => {
    BrowserWindow.getFocusedWindow().webContents.send("goto-snoozed");
  }
});

const doneButton = new TouchBarButton({
  label: "Done",
  icon: path.join(__dirname, "/icons/icon-done.png"),
  iconPosition: "left",
  click: () => {
    BrowserWindow.getFocusedWindow().webContents.send("goto-done");
  }
});

const composeButton = new TouchBarButton({
  icon: path.join(__dirname, "/icons/icon-compose.png"),
  backgroundColor: "#d23f31",
  click: () => {
    BrowserWindow.getFocusedWindow().webContents.send("open-compose-window");
  }
});

const reminderButton = new TouchBarButton({
  icon: path.join(__dirname, "/icons/icon-reminder.png"),
  backgroundColor: "#4285f4",
  click: () => {
    BrowserWindow.getFocusedWindow().webContents.send("open-reminder-window");
  }
});

const touchBar = new TouchBar([
  inboxButton,
  snoozedButton,
  doneButton,
  new TouchBarSpacer({size: 'large'}),
  composeButton,
  reminderButton
]);

module.exports = touchBar;
