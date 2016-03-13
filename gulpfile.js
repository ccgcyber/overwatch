var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

var src = {
	sass: 'scss/*.scss',
	javascript: 'js/src/*.js'
};

var dest = {
	css: 'css',
	javascript: 'js'
};

gulp.task('scripts', function() {
	browserify('./js/src/app.js', { debug: true })
		.transform("babelify", { presets: ["es2015"] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest(dest.javascript))
});
