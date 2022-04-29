const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const image = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const notify = require('gulp-notify');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const clear = () => {
  return del(['dist'])
}

const resources = () => {
  return src('src/resources/**')
  .pipe(dest('dist'))
}

const fonts = () => {
  return src([
    'src/fonts/**/*.woff',
    'src/fonts/**/*.woff2'
  ])
    .pipe(dest('dist/fonts'))
}

const styles = () => {
  return src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
      cascade: true,
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const stylesBuild = () => {
  return src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(dest('dist'))
}

const pugCompile = () => {
  return src('src/**/*.pug')
    .pipe(pug())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlBuild = () => {
  return src('src/**/*.pug')
    .pipe(pug())
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
}

const removeIconsColors = () => {
  return src('src/images/svg/sprite/changing/**/*.svg')
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(dest('src/images/svg/sprite/changing'))
}

const svgSprites = () => {
  return src('src/images/svg/sprite/**/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(replace('changing--', ''))
    .pipe(dest('dist/images/svg'))
}

const svgMove = () => {
  return src('src/images/svg/*.svg')
    .pipe(dest('dist/images/svg'))
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg',
  ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

const scripts = () => {
  return src([
    'src/script/script/**/*.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'))
  .pipe(sourcemaps.write())
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
}

const scriptComponents = () => {
  return src([
    'src/script/components/**/*.js',
  ])
  .pipe(dest('dist'))
}

const scriptsBuild = () => {
  return src([
    'src/script/components/**/.js',
    'src/script/script/**/*.js'
  ])
  .pipe(concat('main.js'))
  .pipe(uglify().on('error', notify.onError()))
  .pipe(dest('dist'))
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

watch('src/**/*.pug', pugCompile)
watch('src/styles/**/*.css', styles)
watch('src/images/svg/sprite/**/*.svg', svgSprites)
watch('src/script/**/*.js', scripts)
watch('src/resources/**', resources)

exports.styles = styles;
exports.pug = pugCompile;
exports.scripts = scripts;
exports.svg = series(removeIconsColors, svgSprites);

// dev версия
exports.default = series(clear, resources, pugCompile, fonts, styles, scriptComponents, scripts, removeIconsColors, svgSprites, svgMove, images, watchFiles);
//build версия
exports.build = series(clear, resources, htmlBuild, fonts, stylesBuild, scriptComponents, scriptsBuild, removeIconsColors, svgSprites, svgMove, images);
