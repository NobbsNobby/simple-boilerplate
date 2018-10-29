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
// IMAGE
const imagemin = require('gulp-imagemin');
// String replace
const replace = require('gulp-replace');
// Favicon
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');
const FAVICON_DATA_FILE = 'faviconData.json';

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
    .pipe(stripCssComments())
    .pipe(dest('public/css'));

const html = () =>
  src('src/index.html')
    .pipe(replace('../node_modules/normalize.css/', 'css/'))
    .pipe(replace('../node_modules/jquery/dist/', 'js/vendor/'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(dest('public'));

const img = () =>
  src('src/img/*.*')
    .pipe(imagemin())
    .pipe(dest('public/img'));


const createFavicon = (done) => {
  realFavicon.generateFavicon({
    masterPicture: 'src/img/favicon/favicon.png',
    dest: 'public',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done();
  });
};

const injectFavicon = () => {
  return src(['public/index.html'])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(dest('public'));
};

exports.fav = createFavicon;
exports.injectFavicon = injectFavicon;
exports.build = series(parallel(js, jsVendor, css, html), img, createFavicon, injectFavicon);
