/**
 * Module Dependencies
 */

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const clean = require('gulp-clean');

/**
 * Config
 */
var paths = {
  styles: [
    './src/client/css/*.css',
  ],
  scripts: [
    './src/client/js/*.js',
  ],
  server:
    './src/server/app.js',
  distServer: [
    './dist/server/bin/www'
  ]
};

var nodemonConfig = {
  script: paths.server,
  ext: 'html js css',
  ignore: ['node_modules']
};

var nodemonDistConfig = {
  script: paths.distServer,
  ext: 'html js css',
  ignore: ['node_modules']
};


/**
 * Gulp Tasks
 */
gulp.task('clean', function() {
  return gulp.src('/dist/*')
    .pipe(clean({force: true}));
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copy-server-files', function () {
  return gulp.src('/src/server/**/*')
    .pipe(gulp.dest('/dist/server/'));
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon(nodemonConfig)
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('minify-css', function() {
  var opts = {comments:true, spare:true};
  return gulp.src(paths.styles)
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('/dist/client/css/'));
});

gulp.task('minify-js', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest('/dist/client/js/'));
});

gulp.task('browser-sync', gulp.series('nodemon', function(done) {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  }, done);
}));

gulp.task('watch', function() {
  gulp.watch(paths.scripts);
});

gulp.task('connectDist', function (cb) {
  var called = false;
  return nodemon(nodemonDistConfig)
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

/**
 * Run test once and exit
 */
const path = require('path');
// const configFilePath = path.resolve(__dirname, 'karma.conf.js');
const karma = require('karma')
const parseConfig = karma.config.parseConfig
const jasmine = require('gulp-jasmine');
const Server = karma.Server

gulp.task('test', async function (done) {
  return parseConfig(null, { port: 5000 }, { promiseConfig: true, throwErrors: true }
).then(
  (karmaConfig) => {
    // gulp.src('/spec/test/**.js')
    // .pipe(jasmine())

    const server = new Server(karmaConfig, function doneCallback(exitCode, possibleErrorCode) {
      console.log('Karma has exited with ' + exitCode)
      console.log('Error ' + possibleErrorCode)
      process.exit(exitCode)
    })
    
    server.on('progress', function(data) {
      console.log('Karma progress: ' + data)
      process.stdout.write(data)
    })

    server.on("browser_register", function (browser) {
      console.log("A new browser was registered");
    });
  },
  (rejectReason) => {
     /* respond to the rejection reason error */ 
     console.error('Rejected: ' + rejectReason)}
);
});

// *** default task *** //
gulp.task('default', gulp.series('browser-sync', 'watch'));

// *** build task *** //
gulp.task('build', gulp.series('clean', 'lint', 'minify-css', 'minify-js', 'copy-server-files', 'connectDist'));
