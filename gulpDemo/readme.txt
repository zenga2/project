1、这里首先需要弄清楚的一点是，我们给gulp.dest()传入的路径参数，只能用来指定要生成的文件的目录，
   而不能指定生成文件的文件名，它生成文件的文件名使用的是导入到它的文件流自身的文件名

2、gulp.dest(path)生成的文件路径是我们传入的path参数后面再加上gulp.src()中有通配符开始出现的那部分路径

3、gulp.watch()对add文件没反应，只对delete和change文件有反应

4、后面加上一组花括号,在这个花括号里面，指定多个扩展名.{jpg,png}注意逗号的后面不要使用空格.

5、插件：
	编译 Sass：gulp-sass
	编译 Less：gulp-less
	合并文件：gulp-concat
	压缩js 文件：gulp-uglify
	重命名js文件：gulp-rename
	优化图像大小：gulp-imagemin
	压缩css 文件：gulp-minify-css(npm WARN deprecated gulp-minify-css@1.2.4: Please use gulp-clean-css)
	创建本地服务器：gulp-connect
	实时预览 gulp-connect

	gulpfile.js中使用gulp-load-plugins来帮我们加载插件：
	var gulp = require('gulp');
	//加载gulp-load-plugins插件，并马上运行它
	var $ = require('gulp-load-plugins')();
	然后我们要使用gulp-rename和gulp-ruby-sass这两个插件的时候，
	就可以使用$.concat和$.connect来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。


	gulp-header

	这个工具用来在压缩后的JS、CSS文件中添加头部注释，你可以包含任意想要的信息，
	通常就是作者、描述、版本号、license等，比如：

	function getHeader () {
	    var pkg = require('package.json');
	    var template = ['/**',
	        ' * <%= pkg.name %> - <%= pkg.description %>',
	        ' * @authors <%= pkg.authors %>',
	        ' * @version v<%= pkg.version %>',
	        ' * @link <%= pkg.homepage %>',
	        ' * @license <%= pkg.license %>',
	        ' */',
	        ''
	    ].join('\n');
	    return $.header(template, {
	        pkg: pkg
    	});
	}
	这个函数将package.json中的各种信息提取出来，变成头部注释，只要在压缩的pipe中调用.pipe(getHeader())即可。

6、 npm list | grep '^[+`]-- '