var gulp = require('gulp');

var forever = require('forever-monitor');

gulp.task('server', function () {
  var child = new (forever.Monitor)('./server.js', {
    max: 3,
    silent: true,
    args: []
  });

  child.on('exit', function () {
    console.log('your-filename.js has exited after 3 restarts');
  });

  child.start();
});

gulp.task('default', ['server']);
