const {src, dest, parallel, series} = require('gulp');
// HTML
const htmlmin = require('gulp-htmlmin');
// const rename = require('gulp-rename');
// JS
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
// CSS
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const stripCssComments = require('gulp-strip-css-comments');
//IMAGE
const imagemin = require('gulp-imagemin');
//String replace
const replace = require('gulp-replace');


const js = () =>
  src('src/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('public/js'));

const jsVendor = () =>
  src('node_modules/jquery/dist/jquery.min.js')
    .pipe(dest('public/js/vendor'));

const css = () =>
  src('src/css/*.scss')
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(src('node_modules/normalize.css/normalize.css'))
    .pipe(replace('../node_modules/normalize.css/', 'css/'))
    .pipe(dest('public/css'));

const html = () =>
  src('src/index.html')
    .pipe(replace('../node_modules/normalize.css/', 'css/'))
    .pipe(replace('../node_modules/jquery/dist/', 'js/vendor/'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(dest('public'));

const img = () =>
  src('src/img/*')
    .pipe(imagemin())
    .pipe(dest('public/img'));


exports.build = series(parallel(js, jsVendor, css, html), img);
