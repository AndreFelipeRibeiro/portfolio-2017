const gulp = require('gulp')
const less = require('gulp-less')
const path = require('path')

gulp.task('less', function() {
  const src  = 'styles/src/index.less'
  const path = ['styles/src']
  const dist = 'styles/dist'

  return gulp.src(src)
    .pipe(less({ path }))
    .pipe(gulp.dest(dist))
})

gulp.task('watch', function() {
  gulp.watch('./**/*.less', ['less'])
})
