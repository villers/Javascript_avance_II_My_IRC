'use strict';

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var typescript = require('gulp-tsc');
var stylus = require('gulp-stylus');
var nodemon = require('gulp-nodemon');

var CLIENT_DIR = './client/';

var _js = './server/**/*.js';
var _js2 = CLIENT_DIR + 'js/**/*.js';
var _css = CLIENT_DIR + 'css/**/*.css';

var _style = CLIENT_DIR + 'css/**/*.styl';
var _ts = '**/*.ts';

gulp.task('ts', function(){
	gulp.src([_ts, '!node_modules/**'])
		.pipe(typescript({target: 'ES5'}))
		.pipe(gulp.dest('.'))
});

gulp.task('style', function () {
	gulp.src(_style)
		.pipe(stylus({
			compress: true
		}))
		.pipe(gulp.dest(CLIENT_DIR+ 'css'));
});

gulp.task('clean', function()
{
	return del.sync([_js, _js2, _css]);
});

gulp.task('browser_sync', function()
{
	return browserSync.reload();
});

gulp.task('watch', ['ts', 'style', 'browser_sync'], function()
{
	browserSync({proxy: "http://localhost:3333", reloadDelay: 1000});
	var _watchable = [];
	_watchable.push(_ts);
	_watchable.push(_style);
	return gulp.watch(_watchable, ['ts', 'style', 'browser_sync']);
});

gulp.task('serve', ['default'], function(){
	nodemon({
		script: 'index.js',
		ext: 'js',
		ignore: ["client/*"]
	});
});

gulp.task('default', ['ts', 'style']);
