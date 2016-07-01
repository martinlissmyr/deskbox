"use strict";
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const windowStateKeeper = require("electron-window-state");
const Menu = electron.Menu;
const menuTemplate = require("./menu.js");
const autoUpdate = require("./auto-updater.js");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768
  });

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    "x": mainWindowState.x,
    "y": mainWindowState.y,
    "width": mainWindowState.width,
    "height": mainWindowState.height
  });

  // Handle resizes etc
  mainWindowState.manage(mainWindow);

  // Load chrome
  mainWindow.loadURL("file://" + __dirname + "/chrome.html");

  // Initiate application menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  // Run auto update
  autoUpdate(app, mainWindow);

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Let"s prevent events such as drag and drop to trigger in the host window
  // We want them to trigger in the webview instead
  mainWindow.webContents.on("will-navigate", function(e) {
    e.preventDefault();
  });
}

// Handle mailto system events
function openMailtoLink(address) {
  var win = BrowserWindow.getFocusedWindow(); // Get the currently focused window
  if (win) {
    win.webContents.send("mailto", address);
  } else {
    setTimeout(function() {
      openMailtoLink(address); // Try again in a second
    }, 1000);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", createWindow);

// Emitted when the application has finished basic startup.
app.on("will-finish-launching", function() {
  app.on("open-url", function(e, url) {
    openMailtoLink(url.replace("mailto:", ""));
    e.preventDefault();
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
