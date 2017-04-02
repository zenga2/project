var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var minifyCss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var exec = require('child_process').exec;
var open = require('open');
var header = require('gulp-header');
var footer = require('gulp-footer');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var count = require('gulp-count');
var size = require('gulp-size');
var bytediff = require('gulp-bytediff');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var stripBom = require('gulp-stripbom')
var pkg = require('./package.json');
var minSrc = pkg.minSrc;
var myUtils = require('./myUtils');
var mData = {};

// 合并js文件
gulp.task('concatJs', function () {
    return gulp.src(minSrc.js)
        // 进行合并并指定合并后的文件名
        .pipe(concat('app.js'))
        .pipe(gulp.dest(minSrc.distRoot));
});

// 压缩合并js
gulp.task('uglifyJS', function () {
    return gulp.src(minSrc.js)
        // 进行合并并指定合并后的文件名
        .pipe(concat('app.js'))
        // 对合并后的app.js文件进行压缩
        .pipe(uglify())
        // 对此文件进行重命名
        .pipe(rename('app.min.js'))
        // 添加注释
        .pipe(getHeader())
        .pipe(getFooter())
        .pipe(gulp.dest(minSrc.distRoot));
});

// 压缩html文件
gulp.task('htmlmin', function () {
    return gulp.src(minSrc.html)
        // 压缩
        .pipe(htmlmin({collapseWhitespace: true}))
        // 后缀
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(minSrc.distRoot));
});

// 压缩css文件
gulp.task('cssmin', function () {
    return gulp.src(minSrc.css)
        // 补充前缀
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'Android >= 4.0', '>1%']
        }))
        // 压缩css文件
        .pipe(minifyCss())
        // 后缀
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(minSrc.distRoot));
});

// 压缩图片
gulp.task('imagemin', function () {
    return gulp.src(minSrc.image)
        // 统计操作前文件的大小
        .pipe(bytediff.start())
        // 压缩图片
        .pipe(imagemin())
        // 统计操作后文件的大小
        .pipe(bytediff.stop())
        .pipe(gulp.dest(minSrc.distRoot));
});

// 删除UTF-8文件中的BOM（如果有的话，因为windows中的记事本等编辑器在保存UTF-8文件时会添加BOM）
gulp.task('removeBom', function () {
    return gulp.src(minSrc.allFilesDev)
        .pipe(stripBom())
        .pipe(gulp.dest(minSrc.appRoot))
})


gulp.task('cleanTask', function () {
    return gulp.src(minSrc.distRoot).pipe(clean());
});

gulp.task('jsTask', function () {
    return gulp.src(minSrc.js)
        // 对合并后的js文件进行压缩
        .pipe(uglify())
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('JS total: <%= counter %> files'));
});

gulp.task('cssTask', [], function () {
    return gulp.src(minSrc.css)
        // 补充前缀
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'Android >= 4.0', '>5%']
        }))
        // 压缩css文件
        .pipe(minifyCss())
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('CSS total: <%= counter %> files'));
});

gulp.task('htmlTask', function () {
    return gulp.src(minSrc.html)
        // 压缩
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('HTML total: <%= counter %> files'));
});

gulp.task('imagesTask', function () {
    return gulp.src(minSrc.image)
        // 压缩图片
        .pipe(imagemin())
        .pipe(gulp.dest(minSrc.distRoot))
        .pipe(count('IMAGE total: <%= counter %> files'));
});

gulp.task('md5', function () {
    return gulp.src(minSrc.allFilesDist)
        .pipe(clean())
        // 给css,js,html加上hash版本号
        // url必须尽量完整(静态化)，同时文件类型后缀必须要有
        .pipe(rev())
        // 把引用的css和js替换成有版本号的名字
        .pipe(revReplace({prefix: 'wwww'}))
        .pipe(gulp.dest(minSrc.distRoot));
});

gulp.task('watchTask', function () {
    gulp.watch(minSrc.js, function (event) {
        myUtils.log('js:   ' + event.type);
        myUtils.log('path: ' + event.path);
    });
    gulp.watch(minSrc.css, function (event) {
        myUtils.log('css:  ' + event.type);
        myUtils.log('path: ' + event.path);
    });
    gulp.watch(minSrc.html, function (event) {
        myUtils.log('html: ' + event.type);
        myUtils.log('path: ' + event.path);
    });
    gulp.watch(minSrc.image, function (event) {
        myUtils.log('images: ' + event.type);
        myUtils.log('path: ' + event.path);
    });
});


// 创建本地服务器
gulp.task('devServer', function () {
    gulp.watch(minSrc.allFilesDev, function (event) {
        myUtils.log('type: ' + event.type);
        myUtils.log('path: ' + event.path);
        gulp.src('./index.html')
            //通知浏览器重启
            .pipe(connect.reload());
    });

    myUtils.log('创建本地服务器');
    connect.server({
        root: './',        // 服务器的根目录
        port: '8080',      // 服务器的地址，没有此配置项默认也是 8080
        livereload: true   // 启用实时刷新的功能
    });

    // 打开浏览器
    // exec('start chrome "http://localhost:8080"', function(){});
    open('http://localhost:8080', 'chrome', function () {});
});

// 统计构建前后项目的大小
gulp.task('beforeSize', function () {
    return gulp.src(minSrc.allFilesDev)
        .pipe(count('before build: <%= counter %> files in total'))
        .pipe(mData.beforeSize = size());
});

gulp.task('afterSize', function () {
    return gulp.src(minSrc.allFilesDist)
        .pipe(count('after  build: <%= counter %> files in total'))
        .pipe(mData.afterSize = size());
});

// 构建生成版本代码
mData.currDate = +new Date;
gulp.task('build', ['cleanTask'], function () {
    gulp.start('jsTask', 'cssTask', 'htmlTask', 'imagesTask', function () {
        gulp.start('md5', function () {
            gulp.start('beforeSize', 'afterSize', function () {
                var totalTime = (+new Date - mData.currDate) / 1000;
                myUtils.log('------------------------------------------------------');
                myUtils.log('before build: ' + mData.beforeSize.prettySize);
                myUtils.log('after  build: ' + mData.afterSize.prettySize);
                myUtils.log('gulp build finished, it took ' + totalTime + " s totally.");
                myUtils.log('------------------------------------------------------');
            });
        });
    });
});

function getHeader() {
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return header(template, {
        pkg: pkg
    });
}

function getFooter() {
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return footer(template, {
        pkg: pkg
    });
}