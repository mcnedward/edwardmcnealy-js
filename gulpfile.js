var gulp = require('gulp'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    rev = require('gulp-rev'),
    del = require('del'),
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['watch']);

// Lints javascript and builds less on file changes
gulp.task('watch', function() {
  gulp.watch('app/js/**/*.js', ['jshint', 'build-scripts']);
  gulp.watch('app/less/**/*.less', ['build-styles']);
})

// Lints javascript
gulp.task('jshint', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
})

// Builds all scripts to the public directory
gulp.task('build-scripts', ['clean-script-rev'], function() {
  buildScripts([
    'app/js/**/*.js',
    '!app/js/colorZones/**/!(colorZonesController)*.js'
  ], 'app.min.js');
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
    .pipe(uglify().on('error', uglifyError))
    // .pipe(sourcemaps.write('maps'))
    .pipe(rev())
    .pipe(gulp.dest('public/js'))
    .pipe(rev.manifest({
      base: '',
      merge: true
    }))
    .pipe(gulp.dest(''));
}

// Builds all less to the public directory
// gulp.task('build-styles', ['clean-styles-rev', 'build-styles-main', 'build-styles-portfolio']);
gulp.task('build-styles', function() {
  var dir = path.join('public', 'css');
  clean('style.css', dir).then(() => {
    clean('portfolioStyle.css', dir).then(() => {
      buildStyles('app/less/style.less', 'style.css');
      return buildStyles([
        'app/less/blackjack.less',
        'app/less/colorzones.less',
        'app/less/modal.less',
        'app/less/parser.less',
      ], 'portfolioStyle.css');
    })
  })
  return buildStyles('app/less/style.less', 'style.css');
})

function buildStyles(input, output) {
  return gulp.src(input)
    // .pipe(sourcemaps.init())
    .pipe(less().on('error', function(err) {
      gutil.log('Error in build-less task...');
      gutil.err(err);
    }))
    .pipe(cssmin().on('error', function(err) {
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

// Clean up tasks
gulp.task('clean-script-rev', function() {
  return clean('app.min.js', path.join('public', 'js'));
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
  } catch(e) {
    return gutil.noop();
  }
}

gulp.task('build-scripts-ugly', function() {
  return gulp.src('public/js/lib/*.js')
    // .pipe(sourcemaps.init())
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js/lib/out'));
})

// Builds both scripts and less to the public directory
gulp.task('build', ['build-scripts', 'build-styles']);

function uglifyError(err) {
  gutil.log(gutil.colors.red('[Error]'), err.toString());
  this.emit('end');
};
