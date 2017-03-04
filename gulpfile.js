const gulp = require('gulp')
const gutil = require('gulp-util')
const less = require('gulp-less')
const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config.js')

gulp.task('webpack', function() {
  webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack', err)
		gutil.log('[webpack]', stats.toString({
			colors: true
		}))
	})
})

gulp.task('less', function() {
  const src  = 'styles/src/index.less'
  const path = ['styles/src']
  const dist = 'assets/styles'

  return gulp.src(src)
    .pipe(less({ path }))
    .pipe(gulp.dest(dist))
})

gulp.task('watch', function() {
  gulp.watch('./**/*.less', ['less'])
  gulp.watch('./scripts/src/**/*.js', ['webpack'])
})
