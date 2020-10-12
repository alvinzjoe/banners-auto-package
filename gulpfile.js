/*

Auto-package banners.
1. Put your work folder under './sources' (Sources > 160x600, 300x50, etc)
2. Change variable zipName to your preference Package Name ( JOBNUMBER_DCM )
3. Run 'gulp process' -> this syntax will capture all your banners, and put it into '/backup' folder under '/sources'. 
      then compress each folder to zip.
4. Done, file your package under 'dist' folder

NB:
Under head tag, put below comment code, it will auto-inject meta ad.size:
<!--AD.SIZE-->
If you want to capture specific size, use "gulp webshot --300x600"
*/

var gulp = require("gulp"),
  webshot = require("gulp-webshot");
const imagemin = require("gulp-imagemin");
var zip = require("gulp-zip");
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var fs = require("fs");
var path = require("path");
var sizeOf = require("image-size");
var clean = require('gulp-clean');
const { dir } = require("console");

var zipName = "VOLAWG0922_Dealer_DCM";

var scriptsPath = "./sources/Dealer/DCM";
var generatedPath = "./dist/generated";
var backupImagePath = scriptsPath+"/backup";
var webshotImagePath = "./dist/shot";
var webshotQuality = 80;
var minifiedImagesPath = "./dist/minified";
var delayBeforeCapture = 20000;
var bannerSelector = "#adwrapper";
var imageExt = "jpg";
var distPath = "./dist";

gulp.task('do:clean', function () {
  return gulp.src([distPath+'',])
    .pipe(clean({force: true}));
});

gulp.task('do:clean-zip', function () {
  return gulp.src([distPath+'/**.zip',])
    .pipe(clean({force: true}));
});

gulp.task("webshot", function (done) {
  var option = process.argv[3]; //set to '123'
  if(option) {
    var size = option.substr(2);
    dir_html = scriptsPath + "/"+size+"/";
    if (fs.existsSync(dir_html)) {
      console.log('Start capturing');
      return shot(size);
    } else {
      console.log('dir doesnt exists');
      done();
    }
  } else {
    return shot();
  }
  
});
function shot(size){
  size = typeof size !== 'undefined' ? size : '**';
  return gulp
    .src([scriptsPath + "/"+size+"/**.html", "!./node_modules/**/**.html"])
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
}

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
      .src([minifiedImagesPath + "/" + folder + "/*"], {
        base: minifiedImagesPath,
      })
      .pipe(rename(folder + "." + imageExt))
      .pipe(gulp.dest(backupImagePath));
  });
  done();
});

gulp.task("to-generated", function (done) {
  setTimeout(function () {
    gulp.src([scriptsPath+'/**'])
        .pipe(gulp.dest(generatedPath));
    done();
  }, 2000);
});

gulp.task("inject-meta-ad-size", function (done) {
  setTimeout(function () {
  var folders = getFolders(scriptsPath);
  tasks = folders.map(function (folder) {
    dir_image = minifiedImagesPath + "/" + folder + "/index." + imageExt;
    dir_ =  generatedPath + "/" + folder;
    dir_html = dir_ + "/index.html";
    if (fs.existsSync(dir_image)) {
      var dimensions = sizeOf(dir_image);
      var meta_tag = '<meta name="ad.size" content="width='+dimensions.width+',height='+dimensions.height+'" />';
      gulp.src([dir_html])
        .pipe(replace("<!--AD.SIZE-->", meta_tag))
        .pipe(gulp.dest(generatedPath+ "/" + folder));
    }
  });
  done();
  }, 2000);
});

gulp.task("do:zip", function (done) {
  setTimeout(function () {
    var folders = getFolders(generatedPath);
    tasks = folders.map(function (folder) {
      gulp
        .src([generatedPath + "/" + folder + "/*"], { base: generatedPath })
        .pipe(zip(folder + ".zip"))
        .pipe(gulp.dest(distPath));
    });
    done();
  }, 2000);
});

gulp.task("do:zip2", function (done) {
  setTimeout(function () {
    gulp
      .src([distPath + "/*.zip"])
      .pipe(zip(zipName + ".zip"))
      .pipe(gulp.dest(distPath));
      done();
  }, 2000);
});

function getFolders(dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

// gulp.task('mytask', function(done) {
  
// });

/* 
1. Webshot
2. Minify webshot
3. Rename file and put to sources/backup
4. Zip files
*/

gulp.task(
  "process",
  gulp.series("do:clean", "webshot", "minify", "do:rename", "to-generated","inject-meta-ad-size", "do:zip", "do:zip2")
);

gulp.task(
  "backup-image",
  gulp.series("webshot", "minify", "do:rename")
);

gulp.task(
  "zipping",
  gulp.series("do:clean-zip", "to-generated",  "do:zip", "do:zip2")
);
