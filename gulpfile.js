const gulp = require('gulp')
const babel = require('gulp-babel')
const runSequence = require('run-sequence')

let session = null

gulp.task('babel', () => gulp
  .src(['src/index.js'])
  .pipe(babel({
    presets: [
      'es2015'
    ],
  }))
  .pipe(gulp.dest('bin')))

/* CLI tasks */
gulp.task('default', callback => {
  runSequence('babel', callback)
})
gulp.task('start', callback => {
  runSequence('babel', callback)
})