var gulp = require("gulp");
var gutil = require("gulp-util");
var electron = require("gulp-electron");
var release = require("gulp-github-release");
var packageJson = require("./package.json");
var electronVersion = "v0.36.3";
var platform = "darwin-x64";

// Load env variables
require("dotenv").load();

// Config build task
gulp.task("build", function() {
  gulp.src("")
  .pipe(electron({
    src: "./src",
    packageJson: packageJson,
    release: "./dist",
    cache: "./cache",
    version: electronVersion,
    packaging: true,
    platforms: [platform],
    platformResources: {
      darwin: {
        CFBundleDisplayName: packageJson.name,
        CFBundleIdentifier: packageJson.name,
        CFBundleName: packageJson.name,
        CFBundleVersion: packageJson.version,
        icon: "resources/icon.icns"
      }
    }
  }))
  .pipe(gulp.dest(""));
});

// Config release task
gulp.task("release", function() {
  if (!process.env.GITHUB_TOKEN) {
    gutil.log(gutil.colors.red("HALTED: No GITHUB_TOKEN provided in .env"));
    return;
  }
  gulp.src("./dist/" + electronVersion + "/" + packageJson.name + "-" + packageJson.version + "-" + platform + ".zip")
  .pipe(release({
    token: process.env.GITHUB_TOKEN,
    manifest: packageJson
  }));
});
