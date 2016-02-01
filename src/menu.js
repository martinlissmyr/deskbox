const electron = require("electron");
const app = electron.app;
const BrowserWindow = require("browser-window");

module.exports = [
  {
    label: "Application",
    submenu: [
      {
        label: "About " + app.getName(),
        role: "about"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() { app.quit(); }
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        role: "undo"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste"
      },
      {
        label: "Paste and Match Style",
        accelerator: "Shift+CmdOrCtrl+V",
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.pasteAndMatchStyle();
        }
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectall"
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle multi-account toolbar",
        accelerator: "CmdOrCtrl+M",
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send("toggle-multiple-account-toolbar");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: "Toggle Developer Tools",
        accelerator: (function() {
          if (process.platform == "darwin")
            return "Alt+Command+I";
          else
            return "Ctrl+Shift+I";
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      },
    ]
  }
];
