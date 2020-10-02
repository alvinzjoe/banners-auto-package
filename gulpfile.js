/*

Auto-package banners.
1. Put your work folder under './sources' (Sources > 160x600, 300x50, etc)
2. Change variable zipName to your preference Package Name ( JOBNUMBER_DCM )
3. Run 'gulp process' -> this syntax will capture all your banners, and put it into '/backup' folder under '/sources'. 
      then compress each folder to zip.
4. Done, file your package under 'dist' folder

*/

var gulp = require("gulp"),
  webshot = require("gulp-webshot");
const imagemin = require("gulp-imagemin");
var zip = require("gulp-zip");
var rename = require("gulp-rename");
var fs = require("fs");
var path = require("path");

var zipName = "JOBNUMBER_DCM";

var scriptsPath = "./sources";
var backupImagePath = "./sources/backup";
var webshotImagePath = "./dist/shot";
var webshotQuality = 80;
var minifiedImagesPath = "./dist/minified";
var delayBeforeCapture = 3000;
var bannerSelector = "#adwrapper";
var imageExt = "jpg";
var distPath = "./dist";

gulp.task("webshot", function () {
  return gulp
    .src([scriptsPath + "/**/**.html", "!./node_modules/**/**.html"])
    .pipe(
      webshot({
        dest: webshotImagePath,
        root: scriptsPath,
        quality: webshotQuality,
        streamType: imageExt,
        renderDelay: delayBeforeCapture,
        captureSelector: bannerSelector,
      })
    );
});
gulp.task("minify", function () {
  return gulp
    .src([webshotImagePath + "/**/**"])
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(minifiedImagesPath));
});
gulp.task("do:rename", function (done) {
  var folders = getFolders(scriptsPath);
  tasks = folders.map(function (folder) {
    gulp
      .src([minifiedImagesPath + "/" + folder + "/*"], { base: minifiedImagesPath })
      .pipe(rename(folder + "." + imageExt))
      .pipe(gulp.dest(backupImagePath));
  });
  done();
});

gulp.task("do:zip", function (done) {
  var folders = getFolders(scriptsPath);
  tasks = folders.map(function (folder) {
    return gulp
      .src([scriptsPath + "/" + folder + "/*"], { base: scriptsPath })
      .pipe(zip(folder + ".zip"))
      .pipe(gulp.dest(distPath));
  });
  done();
});

gulp.task("do:zip2", function (done) {
  setTimeout(function() {
    return gulp
    .src([distPath+"/*.zip"])
    .pipe(zip(zipName + ".zip"))
    .pipe(gulp.dest(distPath));
 }, 2000);
 done();
});

function getFolders(dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

/* 
1. Webshot
2. Minify webshot
3. Rename file and put to sources/backup
4. Zip files
*/

gulp.task("process", gulp.series("webshot","minify","do:rename", "do:zip", "do:zip2"));