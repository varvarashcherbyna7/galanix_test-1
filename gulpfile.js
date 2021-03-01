const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean'),
    ghPages = require('gulp-gh-pages');

const path = {
    build: {
        html: 'build',
        css: 'build/css/',
    },
    src: {
        html: 'src/index.html',
        style: 'src/css/**/*.css',
    },
    watch: {
        html: 'src/index.html',
        style: 'src/css/**/*.css',
    },
    clean: './build/'
};

// *********** CALLBACKS ***********//

const htmlBuild = () => {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html, {allowEmpty: true}));
};

const cleanBuild = () => {
    return gulp.src(path.clean,{allowEmpty: true, read: false})
        .pipe(clean());
};

const cssBuild = () => {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowsersList: ['>0,2%'],
            cascade: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'));
};

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
    gulp.watch(path.watch.html, htmlBuild).on('change', browserSync.reload);
    gulp.watch(path.watch.style, cssBuild).on('change', browserSync.reload);
    // gulp.watch(path.watch.js, jsBuild).on('change', browserSync.reload);
};
// *********** TASKS ***********//

//task - метод gulp

gulp.task('htmlBuild', htmlBuild);
gulp.task('clean', cleanBuild);
gulp.task('scssBuild', cssBuild);
gulp.task('sourcemaps', watcher);
gulp.task('build', gulp.series(
    cleanBuild,
    htmlBuild,
    cssBuild,
    watcher
));

gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});