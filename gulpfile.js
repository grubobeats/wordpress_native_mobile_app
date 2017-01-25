/**
 * Created by vladan on 24/01/2017.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('www/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./www/css/'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('www/sass/**/*.scss',['styles']);
});