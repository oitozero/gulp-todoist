'use strict';

var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var todoist = require('./');

var streamFile = function (filename, stream) {
	var testFile = fs.readFileSync(filename);
	stream.write(new gutil.File({
		path: filename,
		contents: new Buffer(testFile.toString())
	}));

	stream.end();
};

describe('gulp-todoist streaming', function () {
	it('should have nothing to report', function (cb) {
		var files = [];
		var stream = todoist({
			silent: true
		});

		var expected = fs.readFileSync('./tests/fixtures/01-empty.js', 'utf8').trim();

		stream.on('data', function (data) {
			assert.deepEqual(data, {});
		}).on('end', function (out) {
			cb();
		});

		streamFile('./tests/fixtures/01-empty.js', stream);
	});

	it('should report fixme', function (cb) {
		var files = [];
		var stream = todoist({
			silent: true
		});

		var expected = fs.readFileSync('./tests/fixtures/02-fixme.js', 'utf8').trim();

		stream.on('data', function (data) {
			assert.equal(data.FIXME, 1);
		}).on('end', function (out) {
			cb();
		});

		streamFile('./tests/fixtures/02-fixme.js', stream);
	});

	it('should report todo', function (cb) {
		var files = [];
		var stream = todoist({
			silent: true
		});

		var expected = fs.readFileSync('./tests/fixtures/03-todo.js', 'utf8').trim();

		stream.on('data', function (data) {
			assert.equal(data.TODO, 1);
		}).on('end', function (out) {
			cb();
		});

		streamFile('./tests/fixtures/03-todo.js', stream);
	});

	it('should report fixme & todo', function (cb) {
		var files = [];
		var stream = todoist({
			silent: true
		});

		var expected = fs.readFileSync('./tests/fixtures/04-multiple.js', 'utf8').trim();

		stream.on('data', function (data) {
			assert.equal(data.FIXME, 1);
			assert.equal(data.TODO, 1);
		}).on('end', function (out) {
			cb();
		});

		streamFile('./tests/fixtures/04-multiple.js', stream);
	});
});
