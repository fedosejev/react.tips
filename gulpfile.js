const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

const BUILD_DIR = require("./build-config").BUILD_DIR;

gulp.task("build-js-for-development", () =>
  gulp.src("./source/js/app.js").pipe(gulp.dest(`./${BUILD_DIR}/__static/js/`))
);

gulp.task("build-js-for-production", () =>
  gulp
    .src("./source/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest(`./${BUILD_DIR}/__static/js/`))
);

gulp.task("build-sass-for-development", () =>
  gulp
    .src("./source/sass/index.scss")
    .pipe(sass())
    .pipe(rename("styles.css"))
    .pipe(gulp.dest(`./${BUILD_DIR}/__static/css/`))
);

gulp.task("build-sass-for-production", () =>
  gulp
    .src("./source/sass/index.scss")
    .pipe(sass())
    .pipe(rename("styles.css"))
    .pipe(gulp.dest(`./${BUILD_DIR}/__static/css/`))
);

gulp.task("build-images-for-production", () =>
  gulp
    .src("./source/images/*.*")
    .pipe(gulp.dest(`./${BUILD_DIR}/__static/images/`))
);

gulp.task("build-static-for-production", () =>
  gulp.src("./source/static/*.*").pipe(gulp.dest(`./${BUILD_DIR}/__static/`))
);

gulp.task("watch-for-development", () => {
  gulp.watch("./source/js/**/*.js", ["build-js-for-development"]);
  gulp.watch("./source/sass/**/*.scss", ["build-sass-for-development"]);
  gulp.watch("./source/images/**/*.*", ["build-images-for-production"]);
  gulp.watch("./source/static/**/*.*", ["build-static-for-production"]);
});

gulp.task("build-for-development", [
  "build-js-for-development",
  "build-sass-for-development",
  "build-images-for-production",
  "build-static-for-production"
]);

gulp.task("build-for-production", [
  "build-js-for-production",
  "build-sass-for-production",
  "build-images-for-production",
  "build-static-for-production"
]);

gulp.task("default", ["build-for-development"]);
