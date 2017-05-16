const del = require('del');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const open = require('open');
const count = require('gulp-count');
const connect = require('gulp-connect');
const stylus = require('gulp-stylus');
const myUtils = require('./myUtils');
const pkg = require('./package.json');
const minSrc = pkg.minSrc;
const mData = {};

gulp.task('jsTask', function () {
    return gulp.src(minSrc.js)
    // 对合并后的js文件进行压缩
    //     .pipe(uglify())
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('JS total: <%= counter %> files'));
});

gulp.task('cssTask', [], function () {
    return gulp.src(minSrc.style)
        .pipe(stylus())
        // 补充前缀
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        // 压缩css文件
        // .pipe(minifyCss())
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('CSS total: <%= counter %> files'));
});

gulp.task('htmlTask', function () {
    return gulp.src(minSrc.html)
    // 压缩
    //     .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('HTML total: <%= counter %> files'));
});

gulp.task('imagesTask', function () {
    return gulp.src(minSrc.image)
    // 压缩图片
    //     .pipe(imagemin())
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('IMAGE total: <%= counter %> files'));
});

gulp.task('watchTask', function () {
    function cleanFiles(patterns) {
        del.sync(patterns);
    }

    gulp.watch(minSrc.js, function (event) {
        cleanFiles('dist/js');
        gulp.start('jsTask', function () {});
    });
    gulp.watch(minSrc.style, function (event) {
        cleanFiles('dist/style');
        gulp.start('cssTask', function () {});
    });
    gulp.watch(minSrc.html, function (event) {
        cleanFiles('dist/html');
        gulp.start('htmlTask', function () {});
    });
    gulp.watch(minSrc.image, function (event) {
        cleanFiles('dist/images');
        gulp.start('imagesTask', function () {});
    });
    gulp.watch(minSrc.allFilesDev, function (event) {
        gulp.src('dist/**/*.*')
        //通知浏览器重启
            .pipe(connect.reload());
    });
});

// 创建本地服务器
gulp.task('devServer', function () {
    connect.server({
        root: './',        // 服务器的根目录
        port: '8080',      // 服务器的地址，没有此配置项默认也是 8080
        livereload: true   // 启用实时刷新的功能
    });

    // 打开浏览器
    // exec('start chrome "http://localhost:8080"', function(){});
    open('http://localhost:8080/dist/index.html', 'chrome', function () {
    });
});

// 构建生成版本代码
mData.currDate = +new Date;
gulp.task('build', ['clean'] ,function () {
    gulp.start('jsTask', 'cssTask', 'htmlTask', 'imagesTask', function () {
        gulp.start('devServer', function () {
            gulp.start('watchTask', function(){});
        });
    });
});

gulp.task('clean', function () {
    del.sync(minSrc.distRoot);
});