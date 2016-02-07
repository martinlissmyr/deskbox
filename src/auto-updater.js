const GhReleases = require("electron-gh-releases");
const dialog = require("electron").dialog;
const packageJson = require("./package.json");
const updaterOptions = {
  repo: packageJson.repository.replace("github:", ""),
  currentVersion: packageJson.version
};

module.exports = function(app, browserWindow) {
  var updater = new GhReleases(updaterOptions);

  // Listen to if an update has been downloaded
  updater.on("update-downloaded", function(info) {
    dialog.showMessageBox(browserWindow, {
      "type": "question",
      "buttons": ["Install and restart", "Cancel"],
      "message": "An update is available. Install it to enjoy all sorts of magic."
    }, function(buttonIndex) {
      if (buttonIndex === 0) {
        // Restart the app and install the update
        updater.install();
      }
    });
  });

  // Check for updates
  updater.check(function(err, status) {
    // `status` returns true if there is a new update available
    if (!err && status) {
      // Download the update
      updater.download();
    }
  });
}
