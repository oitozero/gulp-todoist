# gulp-todoist
[![Build Status](https://travis-ci.org/oitozero/gulp-todoist.svg?branch=master)](https://travis-ci.org/oitozero/gulp-todoist)

> Outputs a report with total of TODOs and FIXMEs in your file/s.

_Shamelessly_ copied from [gulp-todo](https://github.com/pgilad/gulp-todo).

## Install

```
$ npm install --save-dev gulp-todoist
```


## Usage

```js
var gulp = require('gulp');
var todoist = require('gulp-todoist');

gulp.task('default', function () {
	return gulp.src('/**/*.js')
	.pipe(todoist());
});
```


## API

### todoist(options)

#### options

##### absolute
Output absolute paths of files (as available via `file.path`).

Type: `string`  
Default: `false`

##### silent
Silent all reports.

Type: `boolean`  
Default: `false`

##### verbose
Silent report for each file.

Type: `boolean`  
Default: `false`


## License

MIT © [Pedro Sampaio](https://github.com/oitozero)
