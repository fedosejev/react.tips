var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('build-js-for-development', function () {
  return gulp
        .src('./source/js/app.js')
        .pipe(gulp.dest('./build/__static/js/'));
});

gulp.task('build-js-for-production', function () {
  return gulp
        .src('./source/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/__static/js/'));
});

gulp.task('build-sass-for-development', function () {
  return gulp
        .src('./source/sass/main.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./build/__static/css/'));
});

gulp.task('build-sass-for-production', function () {
  return gulp
        .src('./source/sass/main.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./build/__static/css/'));
});

gulp.task('build-images-for-production', function () {
  return gulp
        .src('./source/images/*.*')
        .pipe(gulp.dest('./build/__static/images/'));
});

gulp.task('watch-for-development', function () {
  gulp.watch('./source/js/**/*.js', ['build-js-for-development']);
  gulp.watch('./source/sass/**/*.scss', ['build-sass-for-development']);
  gulp.watch('./source/images/**/*.*', ['build-images-for-production']);
});

gulp.task('build-for-development', ['build-js-for-development', 'build-sass-for-development', 'build-images-for-production']);
gulp.task('build-for-production', ['build-js-for-production', 'build-sass-for-production', 'build-images-for-production']);

gulp.task('default', ['build-for-development']);