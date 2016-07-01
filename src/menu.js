const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const packageJson = require("./package.json");

module.exports = [
  {
    label: "Application",
    submenu: [
      {
        label: "About",
        click: function() {
          var repo = packageJson.repository.replace("github:", "");
          electron.shell.openExternal("https://github.com/" + repo + "/releases/tag/v" + packageJson.version);
        }
      },
      {
        type: "separator"
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
        role: "pasteandmatchstyle"
      },
      {
        label: "Paste and Maintain Style",
        accelerator: "Shift+CmdOrCtrl+V",
        role: "paste"
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
