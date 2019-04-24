//根目录是gulp学习
var gulp = require('gulp'),
  //导入插件
  htmlhint = require("gulp-htmlhint"),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  jsdocConfig = require('./jsdoc.json'),
  jsdoc = require('gulp-jsdoc3'),
  less = require("gulp-less"),
  concat = require('gulp-concat'),//合并文件
  uglify = require('gulp-uglify'),//压缩代码
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),//重命名
  autoprefixer = require('gulp-autoprefixer'),//处理前缀
  comb = require('gulp-csscomb'),//css格式美化
  serve = require('browser-sync').create(),
  notify = require("gulp-notify"),
  //路径配置
  cssSrc = "./src/less/*.less",
  jsSrc = "./src/js/core.*.js",
  htmlSrc = "./src/demo/*/*.html",
  cssDest = "./src/css",
//jsDest =  "./dest/js",
//htmlDest= "./dest/",
condition = true;
// 语法检查
gulp.task("htmlhint", function () {
  return gulp.src([htmlSrc, '!docs/*.html'])
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter({ "attr-value-double-quotes": true }))
  //.pipe(gulp.dest(htmlDest))
  //.pipe(notify({ message: "html语法检查完毕！"}));
});
gulp.task('jshint', function () {
  return gulp.src([jsSrc, '!src/js/jquery.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(jsDest))
  //.pipe(notify({ message: "js语法检查完毕！"}));
});

gulp.task('doc', function (cb) {
  gulp.src(['README.md', jsSrc, '!src/js/jquery.js'], { read: false })
    .pipe(jsdoc(jsdocConfig, cb));
});

gulp.task('css', function () {
  return gulp.src(cssSrc)
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 20 versions', 'Android >= 4.0'],
      cascade: false,//是否美化属性值 默认true
      remove: true //去掉不必要的前缀 默认true
    }))
    .pipe(gulp.dest(cssDest))
    .pipe(concat('all.css'))
    .pipe(gulp.dest(cssDest))
    .pipe(cssmin())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(cssDest))
  //.pipe(notify({ message: "less编译完毕！"}))
  //.pipe(notify({ message: "css语法检查完毕！"}));
});
// gulp.task('images', function () {
//   return gulp.src(imagesSrc)
//     .pipe(gulp.dest(imagesDest))
//     .pipe(notify({ message: "图片处理完毕！"}));
// });
/*
// 合并文件之后压缩代码
gulp.task('minify', function (){
    return gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('src/js'))
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('src/js'));
});*/

gulp.task('serve', function () {
  var files = ['*/*.html', 'less/*.less', 'js/*.js'];
  serve.init(files, {
    server: { baseDir: "./" },
    port: 3000
  });
  gulp.watch(htmlSrc, ['htmlhint']).on('change', serve.reload);
  gulp.watch(jsSrc, ['jshint']);
  gulp.watch(cssSrc, ['css']).on('change', serve.reload);
});
// 注册缺省任务
gulp.task('default', ['htmlhint', 'jshint', 'css', 'serve']);
// 部署