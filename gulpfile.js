var gulp = require('gulp'),
  gutil = require('gulp-util'),
  babel = require('gulp-babel'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  less = require('gulp-less'),
  cssmin = require('gulp-cssmin'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  htmlmin = require('gulp-htmlmin'),
  rev = require('gulp-rev'),
  del = require('del'),
  path = require('path'),
  sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['watch']);

// Lints javascript and builds less on file changes
gulp.task('watch', function () {
  gulp.watch('app/js/**/*.js', ['jshint', 'build-scripts']);
  gulp.watch('app/less/**/*.less', ['build-styles']);
  gulp.watch('app/views/**/*.html', ['build-html']);
})

// Lints javascript
gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
})

// Builds all scripts to the public directory
gulp.task('build-scripts', ['clean-script-rev'], function () {
  // Build the scripts for everything that can be bundled into the main app.min.js
  buildScripts([
    'app/js/**/*.js',
    '!app/js/colorZones/**/!(colorZonesController)*.js',
    '!app/js/apod/**/!(apodController)*.js',
    '!app/js/utils/utils.js'
  ], 'app.min.js');
  // Build scripts for utils
  buildScripts('app/js/utils/utils.js', 'utils.min.js')
  // Build scripts for APOD
  buildScripts([
    'app/js/apod/**/*.js',
    '!app/js/apod/apodController.js'
  ], 'apod.min.js')
  // Build scripts for Color Zones
  return buildScripts([
    'app/js/colorZones/**/*.js',
    '!app/js/colorZones/colorZonesController.js'
  ], 'color-zones.min.js');
})

function buildScripts(src, output) {
  return gulp.src(src)
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(sourcemaps.init())
    .pipe(concat(output))
    .pipe(isProd() ? uglify().on('error', uglifyError) : gutil.noop())
    // .pipe(sourcemaps.write('maps'))
    .pipe(isProd() ? rev() : gutil.noop())
    .pipe(gulp.dest('public/js'))
    .pipe(isProd() ? rev.manifest({
      base: '',
      merge: true
    }) : gutil.noop())
    .pipe(isProd() ? gulp.dest('') : gutil.noop());
}

// Builds all less to the public directory
gulp.task('build-styles', ['clean-styles-rev'], function () {
  buildStyles('app/less/style.less', 'style.css');
  return buildStyles([
    'app/less/**/*.less',
    '!app/less/style.less',
  ], 'portfolioStyle.css');
})

function buildStyles(input, output) {
  return gulp.src(input)
    // .pipe(sourcemaps.init())
    .pipe(less().on('error', function (err) {
      gutil.log('Error in build-less task...');
      gutil.err(err);
    }))
    .pipe(cssmin().on('error', function (err) {
      gutil.log('Error in build-less task...');
      gutil.err(err);
    }))
    .pipe(concat(output))
    // .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest('public/css'))
    .pipe(rev.manifest({
      base: '',
      merge: true
    }))
    .pipe(gulp.dest(''));
}

gulp.task('build-html', () => {
  return gulp.src('app/views/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public/views'))
})

// Clean up tasks
gulp.task('clean-script-rev', function () {
  clean('app.min.js', path.join('public', 'js'));
  clean('apod.min.js', path.join('public', 'js'));
  clean('color-zones.min.js', path.join('public', 'js'));
  clean('utils.min.js', path.join('public', 'js'));
})
gulp.task('clean-styles-rev', function () {
  clean('style.css', path.join('public', 'css'));
  clean('portfolioStyle.css', path.join('public', 'css'));
})
function clean(fileKey, dir) {
  try {
    var manifest = require('./rev-manifest.json');
    console.log(manifest)
    var oldFilePath = manifest[fileKey];
    if (!oldFilePath) {
      return gutil.noop();
    }
    console.log('deleting ' + path.join(dir, oldFilePath))
    return del(path.join(dir, oldFilePath));
  } catch (e) {
    return gutil.noop();
  }
}

gulp.task('build-scripts-ugly', function () {
  return gulp.src('public/js/lib/*.js')
    // .pipe(sourcemaps.init())
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js/lib/out'));
})

// Builds both scripts, less, and html to the public directory
gulp.task('build', ['build-scripts', 'build-styles', 'build-html']);

function uglifyError(err) {
  gutil.log(gutil.colors.red('[Error]'), err.toString());
  this.emit('end');
};

function isProd() {
  return gutil.env.env === 'prod';
}