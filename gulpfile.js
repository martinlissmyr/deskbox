const gulp = require("gulp");
const gutil = require("gulp-util");
const packager = require("electron-packager");
const release = require("gulp-github-release");
const packageJson = require("./package.json");
const fs = require("fs");
const del = require("del");
const archiver = require("archiver");

var architecture = "x64";
var platform = "darwin";
var outputDir = "./dist";
var sourceDir = "./src";
var appName = packageJson.name;
var appVersion = packageJson.version;
var zipFileName = appName + "-" + appVersion + ".zip";

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
  packager({
    "arch": architecture,
    "platform": platform,
    "dir": sourceDir,
    "out": outputDir,
    "overwrite": true,
    "name": appName,
    "app-bundle-id": appName,
    "helper-bundle-id": appName,
    "app-category-type": "public.app-category.productivity",
    "app-version": appVersion,
    "build-version": appVersion,
    "icon": "resources/icon.icns",
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

gulp.task("compress", function(done) {
  var zipPath = outputDir + "/" + zipFileName;
  var archive = archiver("zip");
  var output = fs.createWriteStream(zipPath);
  output.on("close", function () {
    gutil.log(gutil.colors.green("ZIP CREATED! File can be found here: " + zipPath));
    done();
  });
  archive.on("error", function (err) {
    gutil.log(gutil.colors.red(err));
    done();
  });
  archive.pipe(output);
  archive.directory((outputDir + "/" + appName + "-" + platform + "-" + architecture), false);
  archive.finalize();
});

// Config release task
gulp.task("release", ["compress"], function() {
  if (!process.env.GITHUB_TOKEN) {
    gutil.log(gutil.colors.red("HALTED: No GITHUB_TOKEN provided in .env"));
    return;
  }
  var githubRepo = packageJson.repository.replace("github:", "").split("/");
  gulp.src(outputDir + "/" + zipFileName)
  .pipe(release({
    token: process.env.GITHUB_TOKEN,
    owner: githubRepo[0],
    repo: githubRepo[1],
    notes: "This is v" + packageJson.version + " of " + packageJson.name + ". Enjoy!",
    manifest: packageJson
  }));
});
