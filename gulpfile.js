var gulp = require("gulp");
var electron = require("gulp-electron");
var packageJson = require("./package.json");

gulp.task("build", function() {
  gulp.src("")
  .pipe(electron({
    src: "./src",
    packageJson: packageJson,
    release: "./dist",
    cache: "./cache",
    version: "v0.36.3",
    packaging: true,
    platforms: ["darwin-x64"],
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
