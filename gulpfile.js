/* jshint camelcase:false */
'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    typescript = require('gulp-typescript'),
    minifyHTML = require('gulp-minify-html'),
    ngAnnotate = require('gulp-ng-annotate'),
    del = require('del'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    stylish = require('jshint-stylish');

// JSHint task
gulp.task('lint', function () {
    gulp
        .src(['src/*.js', 'src/js/*.js', '!src/api/**/*.js'])
        .pipe(jshint())
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter(stylish))
        //.pipe(notify({ message: 'lint task complete' }))
        ;
});

// TypeScript task
gulp.task('typescript', function () {
    var tsResult = gulp.src(['src/**/*.ts', '!src/api/**/*.ts'])
        .pipe(typescript({
            noImplicitAny: true,
            out: 'compiled.js'
        }));
    return tsResult.js.pipe(gulp.dest('src/js'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        //.pipe(notify({ message: 'TypeScript task complete' }))
        ;
});

// Clean
gulp.task('clean', function (cb) {
    return del(['public/api', 'public/fonts', 'public/css', 'public/js', 'public/img', 'public/index.html'], cb);
});

// Task which get all Images, minify and copy to public
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(rename({dirname: 'public/img'}))
        .pipe(gulp.dest('./'))
        //.pipe(notify({ message: 'Images task complete' }))
        ;
});

// Task which compile less files and minify
gulp.task('less', function () {
    return gulp.src('src/css/*.less')
        .pipe(less())
        /*.pipe(minifycss())
         .pipe(rename({
         suffix: '.min'
         }))*/
        .pipe(gulp.dest('./src/css'))
        //.pipe(notify({ message: 'less task complete' }))
        ;
});

// Task which compile sass files to css and minify
gulp.task('sass', function () {
    return sass('src/css/*.scss', {
        style: 'expanded'
    })
        //.pipe(autoprefixer('last 2 version'))
        /*.pipe(minifycss())
         .pipe(rename({
         suffix: '.min'
         }))*/
        .pipe(gulp.dest('src/css'))
        //.pipe(notify({ message: 'sass task complete' }))
        ;
});

// Task which get all css files contat to one and minify
gulp.task('styles', function () {
    gulp.src(['src/css/*.css'])
        .pipe(minifycss())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('public/css'))
        //.pipe(notify({ message: 'styles task complete' }))
        ;

    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('public/fonts'));

});

// Scripts
gulp.task('ngAnnotate', function () {
    return gulp.src(['src/*.js', 'src/js/*.js', 'src/js/**/*.js', '!src/api/**/*.js'])
        .pipe(ngAnnotate())
        //.pipe(notify({ message: 'ngAnnotate task complete' }))
        ;
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['src/*.js', 'src/js/*.js'])
        .pipe(ngAnnotate())
         .on('error', gutil.log)
         .on('error', gutil.beep)
         .pipe(uglify({
         global_defs: {
         DEBUG: false
         }
         }))
         .pipe(concat('main.js'))
         .pipe(rename({
         suffix: '.min'
         }))
        .pipe(gulp.dest('public/js'))
        //.pipe(notify({ message: 'Scripts task complete' }))
        ;
});

// allscr task
gulp.task('allscr', ['lint'], function () {
    gulp.start('typescript', 'scripts', 'watch');
});

// build-api
gulp.task('build-api', function () {
    return gulp.src([
        'src/api/firebase/firebase.js',
        'src/api/angular/*.min.js*',
        'src/api/angular/*.css',
        'src/api/**/*.min.js',
        'src/api/**/release/*.min.js',
        'src/api/**/dist/*.min.js',
        'src/api/**/*.css',
        'src/api/**/*.min.js',
        'src/api/**/*.js'])
        .pipe(rename({dirname: 'public/api'}))
        .pipe(gulp.dest('./'))
        //.pipe(notify({ message: 'build-api task complete' }))
        ;
});

// build-api maps
gulp.task('build-api-map', function () {
    return gulp.src([
        'src/api/**/*.min.js.map',
        'src/api/**/release/*.min.js.map',
        'src/api/**/dist/*.min.js.map'])
        .pipe(rename({dirname: 'public/assets/api'}))
        .pipe(gulp.dest('./'))
        //.pipe(notify({ message: 'build-api-map task complete' }))
        ;
});


gulp.task('start', function () {
    return nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
        //.pipe(notify({ message: 'start task complete' }))
        ;
});

gulp.task('minify-html', function () {
    var opts = {
        conditionals: true,
        spare: true
    };
    return gulp.src(['./src/templates/*.html', './src/index.html'])
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./public/'))
        //.pipe(notify({ message: 'minify-html task complete' }))
        ;
});

// Watch
gulp.task('watch', function () {
    // Watch .scss files
    gulp.watch(['src/css/**/*.scss'], ['sass']);
    gulp.watch(['src/css/**/*.less'], ['less']);
    gulp.watch(['src/css/*.css'], ['styles']);
    // Watch .ts files
    gulp.watch(['src/ts/**/*.ts'], ['typescript']);
    // Watch .js files
    gulp.watch(['src/js/**/*.js', 'src/app.js', 'src/js/compiled.js'], ['lint', 'scripts']);
    // Watch image files
    gulp.watch('src/images/**/*', ['images']);
    // Watch index.html
    gulp.watch(['./src/templates/*.html', './src/index.html'], ['minify-html']);
    // Create LiveReload server
    livereload.listen();
    // Watch any files in public/, reload on change and restart server
    gulp.watch(['public/assets/**/*', 'public/*']).on('change', livereload.changed)
});

// Watch
gulp.task('watch-lint', function () {
    // Watch .js files
    gulp.watch(['src/*.js', 'src/js/*.js', '!src/api/**/*.js'], ['lint']);
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('sass', 'less', 'styles', 'build-api', 'build-api-map', 'scripts', 'images', 'minify-html', 'watch');
});
