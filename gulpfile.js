/* eslint-disable */
'use strict';

var gulp = require('gulp');
var order = require('gulp-order');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var ghPages = require('gh-pages');

gulp.task('js', function () {
  return gulp.src('source/js/modules/**/*.js')
    .pipe(order([
      'utils.js',
      'spinner.js',
      'custom-validation.js',
      'alerts.js',
      'backend.js',
      'filter-form.js',
      'data.js',
      'pin.js',
      'card.js',
      'map.js',
      'image-loader.js',
      'ad-form.js',
      'app.js'
    ]))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy', function () {
  return gulp.src([
    'source/css/**',
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/favicon.ico',
    'source/index.html'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'js'
));

gulp.task('deploy', function () {
  ghPages.publish('build', function (err) {});
});
