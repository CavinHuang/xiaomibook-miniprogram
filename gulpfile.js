const gulp = require('gulp')
const rename = require('gulp-rename')
const del = require('del')

const through = require('through2')
const colors = require('ansi-colors')
const log = require('fancy-log')
const argv = require('minimist')(process.argv.slice(2))

const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const base64 = require('postcss-font-base64')

const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const jsonminify = require('gulp-jsonminify')
const combiner = require('stream-combiner2')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const cssnano = require('gulp-cssnano')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const filter = require('gulp-filter')
const jdists = require('gulp-jdists')
const pug = require('gulp-pug')
const stylus = require('gulp-stylus')
const watch = require('gulp-watch')
const batch = require('gulp-batch')

const src = 'client'
const dist = './dist'
const isProd = argv.type === 'prod'

const handleError = (err) => {
  console.log('\n')
  log(colors.red('Error!'))
  log('fileName: ' + colors.red(err.fileName))
  log('lineNumber: ' + colors.red(err.lineNumber))
  log('message: ' + err.message)
  log('plugin: ' + colors.yellow(err.plugin))
}

// task start isProd ? jsonminify() :
gulp.task('json', () => {
  return gulp.src(`${src}/**/*.json`)
  .pipe(through.obj())
  .pipe(gulp.dest(dist))
})

gulp.task('wxml', () => {
  return gulp
    .src(`${src}/**/*.wxml`)
    /* .pipe(
      isProd
        ? htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            keepClosingSlash: true
          })
        : through.obj()
    ) */
    .pipe(gulp.dest(dist))
})

gulp.task('pug', () => {
  return gulp.src(`${src}/**/*.pug`)
  .pipe(pug({
    pretty: true
  }))
  .pipe(rename((path) => (path.extname = '.wxml')))
  .pipe(gulp.dest(dist))
})

gulp.task('wxs', () => {
  return gulp.src(`${src}/**/*.wxs`).pipe(gulp.dest(dist))
})

gulp.task('wxss', () => {
  const combined = combiner.obj([
    gulp.src(`${src}/**/*.{wxss,scss}`),
    sass().on('error', sass.logError),
    postcss([pxtorpx(), base64()]),
    isProd
      ? cssnano({
          autoprefixer: false,
          discardComments: {removeAll: true}
        })
      : through.obj(),
    rename((path) => (path.extname = '.wxss')),
    gulp.dest(dist)
  ])

  combined.on('error', handleError)
})

gulp.task('styl', () => {
  return gulp.src(`${src}/**/*.styl`)
  .pipe(stylus({
    compress: true
  }))
  .pipe(rename((path) => (path.extname = '.wxss')))
  .pipe(gulp.dest(dist))
})

gulp.task('images', () => {
  return gulp.src(`${src}/images/**`).pipe(gulp.dest(`${dist}/images`))
})

gulp.task('js', () => {
  const f = filter((file) => !/(mock|bluebird)/.test(file.path))
  gulp
    .src(`${src}/**/*.js`)
    .pipe(isProd ? f : through.obj())
    .pipe(
      isProd
        ? jdists({
            trigger: 'prod'
          })
        : jdists({
            trigger: 'dev'
          })
    )
    .pipe(isProd ? through.obj() : sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(
      isProd
        ? uglify({
            compress: true
          })
        : through.obj()
    )
    .pipe(isProd ? through.obj() : sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
})

gulp.task('watch', () => {
  
  watch(`${src}/**/*.js`, {
    ignoreInitial: false
  }).pipe(gulp.dest(dist))
  
  ;['wxml', 'pug','wxss', 'styl', 'js', 'json', 'wxs'].forEach((v) => {
    watch(`${src}/**/*.${v}`, function (evnt) {
      runSequence(v)
    })
  })

  watch(`${src}/images/**`, function(evt) {
    runSequence('images')
  })
  watch(`${src}/**/*.scss`, function(){
    runSequence('wxss')
  })
  watch(`${src}/**/*.styl`, function(){
    runSequence('styl')
  })

})

gulp.task('clean', () => {
  return del(['dist/**'])
})

gulp.task('dev', ['clean'], () => {
  runSequence('json', 'images', 'wxml', 'pug', 'wxss', 'styl', 'js', 'wxs', 'cloud', 'watch')
})

gulp.task('build', ['clean'], () => {
  runSequence('json', 'images', 'wxml', 'pug', 'wxss', 'styl', 'js', 'wxs', 'cloud')
})

// cloud-functions 处理方法
const cloudPath = './server/cloud-functions'
gulp.task('cloud', () => {
  return gulp
    .src(`${cloudPath}/**`)
    .pipe(
      isProd
        ? jdists({
            trigger: 'prod'
          })
        : jdists({
            trigger: 'dev'
          })
    )
    .pipe(gulp.dest(`${dist}/cloud-functions`))
})

gulp.task('watch:cloud', () => {
  gulp.watch(`${cloudPath}/**`, ['cloud'])
})

gulp.task('cloud:dev', () => {
  runSequence('cloud', 'watch:cloud')
})
