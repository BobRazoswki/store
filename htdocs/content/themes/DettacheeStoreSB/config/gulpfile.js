// npm install gulp gulp-jsmin gulp-clean gulp-sass del gulp-livereload gulp-cache gulp-concat gulp-rename gulp-imagemin gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-uglify --save-dev
'use strict';
var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    del          = require('del'),
    sass         = require('gulp-sass'),
    clean        = require('gulp-clean'),
    jsmin        = require("gulp-jsmin");

gulp.task('default', function() {
    gulp.start('styles', 'scripts','depcss','depjs', 'images', 'watch');
});

gulp.task('images', function() {
  return gulp.src('../assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('../build/assets/images'))
});

gulp.task('styles', function() {
  return gulp.src('../assets/scss/*.scss', { style: 'expanded' })
    // del(["../build/assets/stylesheets/main.min.css"], {force : true})
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../build/assets/stylesheets'))
});

gulp.task('depcss', function() {
  return gulp.src('../assets/dependencies/css/*.css', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('dependencies.css'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../build/assets/dependencies/css'))
});

gulp.task('depjs', function() {
  return gulp.src('../assets/dependencies/js/*.js', { style: 'expanded' })
    .pipe(concat('dependencies.min.js'))
    .pipe(gulp.dest('../build/assets/dependencies/js'))
});


gulp.task('scripts', function() {
  return gulp.src('../assets/js/**/*.js')
    //del(["../build/assets/js/main.min.js"], {force : true})
    .pipe(concat('main.js'))
    .pipe(jsmin())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../build/assets/js'))
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('../assets/stylesheets/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('../assets/javascripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('../assets/images/**/*', ['images']);

});
