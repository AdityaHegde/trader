const gulp = require("gulp");
const mocha = require("gulp-mocha");
const ts = require("gulp-typescript");

// Hopefully typescript wont be needed when decorators are supported in nodejs
const tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function() {
  return gulp.src("src/**/*.ts")
        .pipe(tsProject())
        .pipe(gulp.dest("dist"));
});

gulp.task("test:unit", ["biuld"], function () {
  return gulp.src("test/unit/**/*.spec.js")
        .pipe(mocha({
          ui: "bdd",
          reporter: "html",
          checkLeaks: true
        }));
});

gulp.task("watch", ["build"], function() {
  gulp.watch("src/**/*.ts", ["build"]);
});
