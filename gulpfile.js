const {
  src,
  dest,
  watch,
  series
} = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// HTML Copy
function HTMLCopy() { 
  return src('src/*.html').pipe(dest('dist'));
}

// Sass Task
function STYLEMinCopy() {
  return src('src/assets/scss/style.scss', {
      sourcemaps: true
    })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('dist/css', {
      sourcemaps: '.'
    }));
}

// JavaScript Task
function JSMinCopy() {
  return src('src/assets/js/script.js', {
      sourcemaps: true
    })
    .pipe(terser())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('dist/js', {
      sourcemaps: '.'
    }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: './src'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('src/*.html', browsersyncReload);
  watch(['src/assets/scss/**/*.scss', 'src/assets/js/**/*.js'], series(HTMLCopy, STYLEMinCopy, JSMinCopy, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  HTMLCopy,
  STYLEMinCopy,
  JSMinCopy,
  browsersyncServe,
  watchTask
);