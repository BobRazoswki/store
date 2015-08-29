// npm install gulp-rename gulp-sass gulp-bower gulp-autoprefixer gulp-concat gulp-watch gulp-connect gulp-livereload gulp-jsmin gulp-cssmin browser-sync --save-dev



var livereload = require('gulp-livereload');

var gulp       = require("gulp"),
    sass       = require("gulp-sass"),
    autoprefix = require("gulp-autoprefixer"),
    concat     = require("gulp-concat"),

    watch      = require("gulp-watch"),
    connect    = require("gulp-connect"),
    browserSync = require('browser-sync'),

    jsmin      = require("gulp-jsmin"),
    cssmin     = require("gulp-cssmin"),
    rename     = require("gulp-rename"),

    bower      = require('gulp-bower'),
    install    = require("gulp-install"),

    devpath   = "../"
    buildpath = "../build/"
    paths = {
      dev: {
          js:        devpath + "assets/js/"
        , css:       devpath + "assets/css/"
        , img:       devpath + "assets/img/*"
        , jsfiles:   devpath + "assets/js/partials/*.js"
        , js2build:   devpath + "assets/js/main.js"
        , js2files:   devpath + "assets/js/lib/**/*.js"
        , cssfiles:  devpath + "assets/css/*.css"
        , scssfiles: devpath + "assets/scss/**/*.scss"
        , phpfiles: devpath + "./**/*.php"
        , htmlfiles: devpath + "./*.html"
        , libfiles: devpath + "assets/lib/**/*"
      }
      , build: {
          js:  buildpath + "assets/js/"
        , css: buildpath + "assets/css/"
        , img: buildpath + "assets/img/"
        , lib: buildpath + "assets/lib"
      }
  }
  ;

gulp.task('browser-sync', function() {
    browserSync.init(null, {
      proxy: {
        host: "localhost"
      }
    });
});

// dev tasks
gulp.task("dev-php", function () {
  gulp.src(paths.dev.phpfiles)
      .pipe(browserSync.reload({stream:true}));
});

gulp.task("dev-html", function () {
  gulp.src(paths.dev.htmlfiles)
     .pipe(browserSync.reload({stream:true}));
});

gulp.task("dev-styles", function() {
  var opts = { style: "expanded" };
  gulp.src(paths.dev.scssfiles)
      .pipe(sass(opts))
      .pipe(autoprefix("last 2 versions", "> 1%", "Explorer 7", "Android 2"))
      .pipe(gulp.dest(paths.dev.css))
      .pipe(browserSync.reload({stream:true}));
});

gulp.task("dev-jsconcat", function(){
  gulp.src(paths.dev.jsfiles)
      .pipe(concat("main.js"))
      .pipe(gulp.dest(paths.dev.js))
      ;

});

// build tasks
// CSS concat and minify
gulp.task("cssmin", function(){
  gulp.src(paths.dev.cssfiles)
      .pipe(concat("cssupload.css"))
      .pipe(cssmin())
      .pipe(rename({suffix: ".min"}))
      .pipe(gulp.dest(paths.build.css))
      .pipe(browserSync.reload({stream:true}));
});

gulp.task("jsmin", function(){
  gulp.src(paths.dev.js2build)
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.build.js))
        .pipe(browserSync.reload({stream:true}))
        ;
});

// Moves the libraries to build/assets/lib folder
gulp.task("build-libs", function(){
  gulp.src(paths.dev.libfiles)
      .pipe(gulp.dest(paths.build.lib))
      ;
});

// watch html, scss and js files
gulp.task("watch", function () {
  gulp.watch(paths.dev.scssfiles, ["dev-styles"]);
  gulp.watch(paths.dev.cssfiles,  ["cssmin"]);
  gulp.watch(paths.dev.jsfiles,   ["dev-jsconcat"]);
  gulp.watch(paths.dev.jsfiles,   ["jsmin"]);
  gulp.watch(paths.dev.htmlfiles, ["dev-html"]);
  gulp.watch(paths.dev.phpfiles,  ["dev-php"]);
});

// tasks
// gulp.task("build",  ["sendfonts","sendphp","imgmin","jsmin","cssmin"]);
//gulp.task("default", ["dev-styles", "dev-jsconcat", 'browser-sync', "watch"]);
gulp.task("default", ["dev-styles", "dev-jsconcat", "watch"]);





// Toni

gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb(); // notify gulp that this task is finished
    });
});

gulp.src(['./bower.json'])
  .pipe(install()
);
