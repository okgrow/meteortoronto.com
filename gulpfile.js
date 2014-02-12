'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-ruby-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var size = require('gulp-size');
var livereload = require('gulp-livereload');
var markdown = require('gulp-markdown');
var fileinclude = require('gulp-file-include')
var es = require('event-stream');
var lr = require('tiny-lr');
var server = lr();

gulp.task('styles', function () {
    gulp.src('app/styles/vendor/*.css')
        .pipe(csso())
        .pipe(size())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/styles'));

    return gulp.src('app/styles/**/*.sass')
        .pipe(sass({
          style: 'expanded',
          loadPath: ['app/bower_components']
        }))
        .pipe(autoprefixer('last 1 version'))
        .pipe(csso())
        .pipe(size())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', function () {
    return es.concat(
        gulp.src('app/bower_components/jquery/jquery.min.js'),
        gulp.src('app/scripts/**/*.js')
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
    )
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('markdown', function () {
    return gulp.src(['app/**/*.md', 'app/**/*.markdown'])
        .pipe(markdown())
        .pipe(gulp.dest('build/markdown'));
});

gulp.task('html', ['markdown'], function () {
     return gulp.src('app/*.html')
        .pipe(fileinclude())
        .pipe(size())
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe(size())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', function () {
    return gulp.src(['dist'], {read: false}).pipe(clean());
});

gulp.task('build', ['markdown', 'html', 'styles', 'scripts', 'images']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
