var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var markdox = require("gulp-markdox");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var size = require('gulp-size');
var pkg = require('./package.json');

var messageServer = require('fs').readFileSync('./demo/message/server.js');
var messageClient = require('fs').readFileSync('./demo/message/client.js');

var emitterServer = require('fs').readFileSync('./demo/emitter/server.js');
var emitterClient = require('fs').readFileSync('./demo/emitter/client.js');


var docHeader = [
  '<%= pkg.name %> - v<%= pkg.version %>',
  '===',
  '<%= pkg.description %>',
  '## Install',
  '### npm',
  '```bash',
  '$ npm install <%= pkg.repository %> --save',
  '```',
  '### bower',
  '```bash',
  '$ bower install <%= pkg.repository %> --save',
  '```',
  '## Test',
  '```bash',
  '$ npm install -g mocha',
  '$ npm test',
  '```',
  '## Usage',
  '### Message Api adapter',
  '#### demo/message/server.js',
  '```js',
  messageServer,
  '```',
  '#### demo/message/client.js',
  '```js',
  messageClient,
  '```',
  '### Emitter Api adapter',
  '#### demo/emitter/server.js',
  '```js',
  emitterServer,
  '```',
  '#### demo/emitter/client.js',
  '```js',
  emitterClient,
  '```',
  '##API'
].join('\n');

gulp.task('lint', function () {
  return gulp.src([pkg.main, './lib/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function () {
  return gulp.src('./test/*.js')
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('clean', function () {
  return gulp.src('./browser', { read: false })
    .pipe(clean());
});

gulp.task('docs', function () {
  return gulp.src([pkg.main, './lib/*.js'])
    .pipe(markdox())
    .pipe(concat('readme.md'))
    .pipe(header(docHeader, {pkg: pkg}))
    .pipe(gulp.dest('.'));
});


gulp.task('build', ['test','clean', 'docs'], function () {
  var bundler = browserify({
    entries: [pkg.main],
    standalone: pkg.title
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source(pkg.name + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./browser'));
  };

  return bundle();
});

gulp.task('bump', ['build'], function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('tag', ['bump'], function () {
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});

gulp.task('npm', ['tag'], function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('test', ['lint', 'mocha']);
gulp.task('ci', ['build']);
gulp.task('release', ['npm']);