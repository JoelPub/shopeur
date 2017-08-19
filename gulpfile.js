'use strict';

var appName = 'Shopeur';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');

var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var ripple = require('ripple-emulator');
var git = require('gulp-git');
var inject = require('gulp-inject-string');
var fs = require('fs');

/**
 * Parse arguments
 */
var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('t', 'test')
    .alias('r', 'run')
    // remove all debug messages (console.logs, alerts etc) from release build
    .alias('release', 'strip-debug')
    .default('build', false)
    .default('test', false)
    .default('port', 9000)
    .default('strip-debug', false)
    .argv;

/**
 * Set default vars
 */
var build = !!(args.build || args.emulate || args.run);
var test = !!(args.test || args.emulate || args.run);
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var stripDebug = !!(build || test);
var targetDir = path.resolve(build || test ? 'www' : '.tmp');
var gitVersion;
var version;

/**
 * If we just use emualate or run without specifying platform, we assume iOS
 * in this case the value returned from yargs would just be true
 */
if (emulate === true) {
    emulate = 'ios';
}
if (run === true) {
    run = 'ios';
}

/**
 * Global error handler
 * @param error
 */
var errorHandler = function (error) {
    //console.log('Gulp error handler => ', error.toString());
    if (build) {
        throw error;
        //console.log(error);
    } else {
        beep(2, 170);
        plugins.util.log(error);
        this.emit('end');
    }
};

/**
 * Clean target dir
 */
gulp.task('clean', function (done) {

    /*del([targetDir + '/!**!/!*'], {dryRun: true}).then(function(paths){
        console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });*/

    return del([targetDir + '/**/*'], {force: true}, done);
});

/**
 * Precompile .scss files
 */
gulp.task('styles', function () {
    var options = build ? {style: 'compressed'} : {style: 'expanded'};
    var sass = gulp.src('app/styles/main.scss')
        .pipe(plugins.sass(options))
        .on('error', function (error) {
            plugins.util.log(error.message);
            this.emit('end');
        })
        // cache and remember main.scss in order to cut down re-compile time
        .pipe(plugins.cached('main'))
        .pipe(plugins.remember('main'))
        .on('error', errorHandler);

    return streamqueue({objectMode: true}, sass)
        .on('error', function (error) {
            plugins.util.log(error.message);
            this.emit('end');
        })
        .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.if(build, plugins.stripCssComments()))
        .pipe(plugins.if(build && !emulate, plugins.rev()))
        .pipe(gulp.dest(path.join(targetDir, 'styles')))
        .on('error', errorHandler);
});

/**
 * Build templatecache, copy scripts.
 * if build: concat, minsafe, uglify and versionize
 */
gulp.task('scripts', function () {
    var dest = path.join(targetDir, 'scripts');

    var minifyConfig = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeComments: true
    };

    /**
     * Prepare angular template cache from html templates
     * (remember to change appName var to desired module name)
     */
    var templateStream = gulp
        .src('**/*.html', {cwd: 'app/templates'})
        .pipe(plugins.angularTemplatecache('templates.js', {
            root: 'templates/',
            module: appName,
            htmlmin: build && minifyConfig
        }));

    var scriptStream = gulp
        .src(['templates.js', 'app.js', '**/*.js', '!env.js'], {cwd: 'app/scripts'})
        .pipe(plugins.if(!build, plugins.changed(dest)));

    return streamqueue({objectMode: true}, scriptStream, templateStream)
        .pipe(plugins.if(build, plugins.ngAnnotate()))
        .pipe(plugins.if(stripDebug, plugins.stripDebug()))
        .pipe(plugins.if(build, plugins.concat('app.js')))
        .pipe(plugins.if(build, plugins.uglify()))
        .pipe(plugins.if(build && !emulate, plugins.rev()))

        .pipe(gulp.dest(dest))

        .on('error', errorHandler);
});

/**
 * Generate icon font
 */
gulp.task('iconfont', function () {
    return gulp.src('app/assets/icons/*.svg', {
        buffer: false
    })
        .pipe(plugins.iconfontCss({
            fontName: 'ownIconFont',
            path: 'app/assets/icons/own-icons-template.css',
            targetPath: '../../styles/own-icons.css',
            fontPath: '../assets/fonts/'
        }))
        .pipe(plugins.iconfont({
            fontName: 'ownIconFont'
        }))
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'fonts')))
        .on('error', errorHandler);
});

/**
 * Copy version file
 */
gulp.task('version', function () {
    return gulp.src(['app/version'])
        .pipe(gulp.dest(path.join(targetDir)))
        .on('error', errorHandler);
});
/**
 * Copy test file
 */
gulp.task('mockserver', function () {
    return gulp.src('app/mockserver/*.*')
        .pipe(gulp.dest(path.join(targetDir,'mockserver')))
        .on('error', errorHandler);
});

/**
 * Copy fonts
 */
gulp.task('fonts', function () {
    return gulp
        .src(['app/assets/fonts/NotoSansCJKtc/**/*.{eot,svg,ttf,woff}', 'bower_components/ionic/fonts/*.*'])
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'fonts')))
        .on('error', errorHandler);
});

/**
 * Copy templates
 */
gulp.task('templates', function () {
    return gulp.src('app/templates/**/*.*')
        .pipe(gulp.dest(path.join(targetDir, 'templates')))
        .on('error', errorHandler);
});

/**
 * Copy images
 */
gulp.task('images', function () {
    return gulp.src('app/assets/images/**/*.*')
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'images')))
        .on('error', errorHandler);
});

/**
 * Copy svgs
 */
gulp.task('svgs', function () {
    return gulp.src('app/assets/icons/*.svg')
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'icons')))
        .on('error', errorHandler);
});

/**
 * Copy translations
 */
gulp.task('translations', function () {
    return gulp.src('app/assets/translations/**/*.*')
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'translations')))
        .on('error', errorHandler);
});

/**
 * Copy i18n files
 */
gulp.task('i18n', function () {
    return gulp.src('app/assets/i18n/*.js')
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'i18n')))
        .on('error', errorHandler);
});

/**
 * Copy env
 */
gulp.task('env', function() {
    return gulp
        .src(['env.js'], {cwd: 'app/scripts'})
        .pipe(gulp.dest(path.join(targetDir, 'scripts')))
        .on('error', errorHandler)
});

/**
 * Copy custom css file
 */
gulp.task('cccs', function () {
    return gulp.src('app/assets/css/*.css')
        .pipe(gulp.dest(path.join(targetDir + '/assets/', 'css')))
        .on('error', errorHandler);
});

/**
 * Get git version via "git describe --always"
 */
gulp.task('git:describe', function(cb){

    if (!fs.existsSync('.git')){
        return cb();
    }

    return git.exec({args : 'describe --always'}, function (error, stdout) {
        if (error) {
            return console.log(error);
        }

        console.log('git describe --always => ', stdout);
        gitVersion = stdout;
        cb();
    });
});

/**
 * Inject git version string
 * Read version file (targetDir + '/version')
 * If is empty and git is available set default via "git describe --always"
 */
gulp.task('inject:version', ['git:describe'], function () {

    version = fs.readFile(targetDir + '/version', 'utf-8', function (error, data) {

        var defaultVersion = (gitVersion) ? gitVersion : '0.0.1';

        if (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            } else {
                data = defaultVersion;
            }
        }

        if(data === '') {
            data = defaultVersion;
        }

        gulp.src(targetDir + (build ? '/scripts/app*.js' : '/scripts/templates.js'))
            .pipe(inject.replace('<!-- git-version -->', data.trim()))
            .pipe(gulp.dest(targetDir + '/scripts'));

        console.log('version => ', data);
        return data;
    });
});

/**
 * Lint js sources based on .jshintrc ruleset
 */
gulp.task('jsHint', function () {
    return gulp
        .src('app/scripts/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish))
        .on('error', errorHandler);
});

/**
 * Concatenate and minify vendor sources
 */
gulp.task('vendor', function () {
    var vendorFiles = require('./vendor.json');

    return gulp.src(vendorFiles)
        .pipe(plugins.concat('scripts/vendor.js'))
        .pipe(plugins.if(build, plugins.uglify()))
        .pipe(plugins.if(build, plugins.rev()))
        .pipe(gulp.dest(targetDir))
        .on('error', errorHandler);
});

/**
 * Inject the files in index.html
 */
gulp.task('index', ['jsHint', 'scripts', 'env'], function () {

    // Build has a '-versionnumber' suffix
    var cssNaming = 'styles/main*';

    // Injects 'src' into index.html at position 'tag'
    var _inject = function (src, tag) {
        return plugins.inject(src, {
            starttag: '<!-- inject:' + tag + ':{{ext}} -->',
            read: false,
            addRootSlash: false
        });
    };

    /**
     * Get all our javascript sources
     * in development mode, it's better to add each file seperately.
     * it makes debugging easier.
     */
    var _getAllScriptSources = function () {
        var scriptStream = gulp.src(
            [
                'scripts/app.js',
                'scripts/**/*.js'
            ],
            {
                cwd: targetDir
            }
        );
        return streamqueue({objectMode: true}, scriptStream);
    };

    return gulp.src('app/index.html')
        // inject css
        .pipe(_inject(gulp.src(cssNaming, {cwd: targetDir}), 'app-styles'))
        // inject vendor.js
        .pipe(_inject(gulp.src('scripts/vendor*.js', {cwd: targetDir}), 'vendor'))
        // inject app.js (build) or all js files indivually (dev)
        .pipe(plugins.if(build,
            _inject(gulp.src('scripts/app*.js', {cwd: targetDir}), 'app'),
            _inject(_getAllScriptSources(), 'app')
        ))
        .pipe(plugins.if(build, _inject(gulp.src('scripts/env.js', {cwd: targetDir}), 'env')))

        .pipe(gulp.dest(targetDir))
        .on('error', errorHandler);
});

/**
 * Start local express server
 */
gulp.task('serve', function () {
    express()
        .use(!build || !test ? connectLr() : 'noop')
        .use(express.static(targetDir))
        .listen(port)
        .on('error', errorHandler);

    open('http://localhost:' + port + '/');
});

/**
 * Ionic emulate wrapper
 */
gulp.task('ionic:emulate', plugins.shell.task([
    'ionic emulate ' + emulate + ' --livereload --consolelogs'
]));

/**
 * Ionic run wrapper
 */
gulp.task('ionic:run', plugins.shell.task([
    'ionic run ' + run
]));

/**
 * Ionic resources wrapper
 */
gulp.task('icon', plugins.shell.task([
    'ionic resources --icon'
]));
gulp.task('splash', plugins.shell.task([
    'ionic resources --splash'
]));
gulp.task('resources', plugins.shell.task([
    'ionic resources'
]));

/**
 * Select emulator device
 */
gulp.task('select', plugins.shell.task([
    './helpers/emulateios'
]));

/**
 * Ripple emulator
 */
gulp.task('ripple', ['scripts', 'styles', 'watchers'], function () {

    var options = {
        keepAlive: false,
        open: true,
        port: 4400
    };

    // Start the ripple server
    ripple.emulate.start(options);

    open('http://localhost:' + options.port + '?enableripple=true');
});

/**
 * Start watchers
 */
gulp.task('watchers', function () {
    plugins.livereload.listen();
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/assets/fonts/**', ['fonts']);
    gulp.watch('app/assets/icons/**', ['iconfont']);
    gulp.watch('app/assets/translations/**', ['translations']);
    gulp.watch('app/assets/images/**', ['images']);
    gulp.watch('app/scripts/**/*.js', ['index']);
    gulp.watch('./vendor.json', ['vendor']);
    gulp.watch('app/templates/**/*.html', ['index']);
    gulp.watch('app/index.html', ['index']);
    gulp.watch(targetDir + '/**')
        .on('change', plugins.livereload.changed)
        .on('error', errorHandler);
});

/**
 * no-op = empty function
 */
gulp.task('noop', function () {
});

/**
 * Our main sequence, with some conditional jobs depending on params
 */
gulp.task('default', function (done) {
    runSequence(
        'clean',
        'iconfont',
        [
            'fonts',
            'translations',
            'i18n',
            'styles',
            'images',
            'svgs',
            'vendor',
            'version',
            'mockserver'
        ],
        'index',
        build ? 'noop' : 'watchers',
        build ? 'noop' : 'serve',
        emulate ? ['ionic:emulate', 'watchers'] : 'noop',
        run ? 'ionic:run' : 'noop',
        done);
});

/**
 * Our main sequence, for docker setup with some conditional jobs depending on params
 */
gulp.task('docker-run', function (done) {
    runSequence(
        'clean',
        'iconfont',
        [
            'fonts',
            'translations',
            'i18n',
            'styles',
            'images',
            'svgs',
            'vendor',
            'version',
            'mockserver'
        ],
        'index',
        build ? 'noop' : 'watchers',
        'serve',
        done);
});
