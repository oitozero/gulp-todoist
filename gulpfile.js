'use strict';
var gulp = require('gulp');
var todoist = require('./index');


gulp.task('default', function () {
  gulp.src('./tests/**/*.js', {
    base: './'
  })
  .pipe(todoist({
    silent: false,
    verbose: false
  }));
});
