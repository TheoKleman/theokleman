var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var browserSync  = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('default', ['js_libs', 'js_app', 'sass'], function(){
    browserSync.init({
        proxy: "http://theokleman.local/"
    });

    gulp.watch('js/app/**/*.js', ['js_app']);
    gulp.watch('sass/**/*.scss', ['sass']);

    gulp.watch([
            './js/app/**/*.js',
            './js/vendors/**/*.js',
            "index.html"
        ]).on('change', browserSync.reload);
});

gulp.task('js_libs', function(){
    return gulp
        .src([
            'js/vendors/jquery/dist/jquery.min.js',
            'js/vendors/handlebars/handlebars.min.js',
            'js/vendors/gsap/src/minified/TweenMax.min.js',
        ])
        .pipe(concat('vendors.js'))
        .pipe(uglify('vendors.js'))
        .pipe(gulp.dest('js/dist'))
});

gulp.task('js_app', function(){
    return gulp.src('js/app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('js/dist'))
});

gulp.task('sass', function(){
    return gulp.src('sass/**/*.scss')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream());
});
