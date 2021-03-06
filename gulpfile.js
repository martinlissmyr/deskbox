const gulp = require("gulp");
const gutil = require("gulp-util");
const packager = require("electron-packager");
const release = require("gulp-github-release");
const packageJson = require("./package.json");
const fs = require("fs");
const del = require("del");

var architecture = "x64";
var platform = "darwin";
var outputDir = "./dist";
var sourceDir = "./src";
var appName = packageJson.name;
var appVersion = packageJson.version;
var zipFileName = appName + "-" + appVersion + ".zip";
var githubUri = packageJson.repository.replace("github:", "").split("/");
var githubUser = githubUri[0];
var githubRepo = githubUri[1];

// Load env variables
require("dotenv").load();

// Config clean task
gulp.task("clean", function() {
  return del([
    "dist/*"
  ]);
});

// Config build task
gulp.task("build", ["clean"], function(done) {
  if (!process.env.DEVELOPER_IDENTITY) {
    gutil.log(gutil.colors.red("HALTED: No DEVELOPER_IDENTITY provided in .env"));
    done();
    return;
  }

  packager({
    "arch": architecture,
    "platform": platform,
    "dir": sourceDir,
    "out": outputDir,
    "overwrite": true,
    "asar": true,
    "name": appName,
    "app-bundle-id": appName,
    "helper-bundle-id": appName,
    "app-category-type": "public.app-category.productivity",
    "app-version": appVersion,
    "build-version": appVersion,
    "icon": "resources/icon.icns",
    "osx-sign": {
      "platform": "darwin",
      "identity": process.env.DEVELOPER_IDENTITY,
      "verbose": true
    },
    "protocols": [
      {
        "name": "Send Email",
        "schemes": [
          "mailto"
        ]
      }
    ]
  }, function(err, location) {
    gutil.log(gutil.colors.green("BUILD DONE! Executable can be found in " + location));
    done();
  });
});

gulp.task("sync-package-files", function(done) {
  var srcPackageJson = require("./src/package.json");
  srcPackageJson.version = packageJson.version;
  srcPackageJson.name = packageJson.name;
  srcPackageJson.description = packageJson.description;
  srcPackageJson.repository = packageJson.repository;
  fs.writeFile("./src/package.json", JSON.stringify(srcPackageJson, null, 2), function(err) {
    if (err) {
      gutil.log(gutil.colors.red(err));
    } else {
      gutil.log(gutil.colors.green("PACKAGE FILES SYNCED!"));
    }
    done();
  });
});

gulp.task("create-autoupdater-file", function(done) {
  var autoUpdaterJson = {
    "url": "https://github.com/" + githubUser + "/" + githubRepo + "/releases/download/v" + appVersion + "/" + zipFileName,
    "pub_date": (new Date()).toISOString(),
    "name": appName
  }
  fs.writeFile("./auto_updater.json", JSON.stringify(autoUpdaterJson, null, 2), function(err) {
    if (err) {
      gutil.log(gutil.colors.red(err));
    } else {
      gutil.log(gutil.colors.green("AUTO UPDATER FILE CREATED!"));
    }
    done();
  });
});

// Config release task
gulp.task("release", function() {
  if (!process.env.GITHUB_TOKEN) {
    gutil.log(gutil.colors.red("HALTED: No GITHUB_TOKEN provided in .env"));
    done();
    return;
  }
  gulp.src(outputDir + "/" + zipFileName)
  .pipe(release({
    token: process.env.GITHUB_TOKEN,
    owner: githubUser,
    repo: githubRepo,
    notes: "This is v" + appVersion + " of " + appName + ". Enjoy!",
    manifest: packageJson
  }));
});
