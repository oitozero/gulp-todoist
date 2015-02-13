'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var leasot = require('leasot');
var defaults = require('lodash.defaults');
var omit = require('lodash.omit');
var countBy = require('lodash.countby');
var padRight = require('lodash.padright');
var PluginError = gutil.PluginError;
var pluginName = 'gulp-todo';

function logCommentsToConsole(comments) {
	comments.forEach(function (comment) {
		var isTodo = /todo/i.test(comment.kind);
		var commentType = isTodo ? gutil.colors.cyan(comment.kind) : gutil.colors.magenta(comment.kind);
		var commentLocation = '@' + gutil.colors.gray(comment.file + ':' + comment.line);
		gutil.log(commentType, comment.text, commentLocation);
	});
}

function logTotalsToConsole(header, totals) {
	if(header){
		gutil.log(gutil.colors.underline('Totals'));
	}
	Object.keys(totals).forEach(function(key) {
		var isTodo = /todo/i.test(key);
		var totalType = isTodo ? gutil.colors.cyan(key) : gutil.colors.magenta(key);
		var totalCount = isTodo ? gutil.colors.cyan(totals[key]) : gutil.colors.magenta(totals[key]);
		gutil.log(padRight(totalType, 20), String.fromCharCode(0x27A9), totalCount);
	});
}

module.exports = function (options) {
	options = defaults(options || {}, {
		silent: false,
		verbose: false,
		absolute: false
	});
	var config = omit(options, ['verbose', 'absolute', 'silent']);
	var firstFile;
	var comments = [];

	return through.obj(function collectTodos(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError(pluginName, 'Streaming not supported'));
			return;
		}
		firstFile = firstFile || file;
		//get extension - assume .js as default
		var ext = path.extname(file.path) || '.js';
		//check if parser for filetype exists
		//TODO: perhaps just skip unsupported files
		if (!leasot.isExtSupported(ext)) {
			var msg = ['File:', file.path, '- Extension', gutil.colors.red(ext),
			'is not supported'
			].join(' ');
			cb(new PluginError(pluginName, msg));
			return;
		}
		var filePath;
		if (options.absolute) {
			filePath = file.path;
		} else {
			filePath = file.path && file.relative || file.path;
		}
		var _comments = leasot.parse(ext, file.contents.toString('utf8'), filePath);

		if (options.verbose) {
			logCommentsToConsole(_comments);
		}
		comments = comments.concat(_comments);
		cb();
	},
	function reportTotals(cb) {

		var totals = countBy(comments, function(c) { return c.kind; });

		if(!options.silent){
			logTotalsToConsole(options.verbose, totals);
		}
		this.emit('data', totals);

		cb();
	});
};
