var gulp = require('gulp');
var browserSync = require('browser-sync');



// gulp.task('default', function() {

//     browserSync.init({
//        // startPath: '/node_modules/genetic-js/examples/',
//         server: {
//             baseDir: "./"
//         }
//     });

//     //gulp.watch("app/scss/*.scss", ['sass']);
//     gulp.watch("./**/*.*").on('change', browserSync.reload);
// });


gulp.task('default', startServerAt('/'));
//gulp.task('gents', startServerAt('/node_modules/genetic-js/examples/'));



function startServerAt(x){
    browserSync.init({
        startPath: x,
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./**/*.*").on('change', browserSync.reload);
}