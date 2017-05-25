###webpack
webpack是一款强大的模块加载器兼打包工具,是目前市场上最常用的构建自动化平台的工具之一，它能把各种资源，例如：JS（含JSX）、样式（含less/sass）、图片等进行合并压缩和打包，最后把所有的资源都汇总到HTML页面中。

####1、基础使用
> 首先在全局下安装webpack，体验一下它的命令操作

	npm install webpack -g
	//->安装完成后，我们可以查看到webpack的安装目录：C:\Users\team\AppData\Roaming\npm，我们找到webpack.cmd文件
		
	@IF EXIST "%~dp0\node.exe" (
	  "%~dp0\node.exe"  "%~dp0\node_modules\webpack\bin\webpack.js" %*
	) ELSE (
	  @SETLOCAL
	  @SET PATHEXT=%PATHEXT:;.JS;=;%
	  node  "%~dp0\node_modules\webpack\bin\webpack.js" %*
	)
	//->dp0是当前目录，当我们执行webpack命令的时候，执行的都是webpack.js这个文件，所有安装在全局下的模块都是这样的机制和原理

> 语法命令：webpack xxx/xxx.js  xxx/xxx.js  把某一个目录下的文件打包到另外一个文件夹中
> - 一般原代码文件都存放在 src 文件夹中
> - 一般编打包后的文件都存在 build 文件夹中

> 更多的命令： “webpack -h”
>  - webpack -p 生产环境下编译，会压缩生成后的文件
>  - webpack -w 开发环境下持续的监听文件变动来进行编译
>  - webpack -d 生成map映射文件,会在控制台的Sources页签中出现存放打包前原始文件的webpack://目录，可以打断点，帮助调试
>  - webpack --progress 显示构建百分比进度
>  - webpack --display-error-details 显示打包过程中的出错信息(比如 webpack寻找模块的过程)
>  - webpack --profile 输出性能数据，可以看到每一步的耗时

####2、在本地项目中使用
> 首先在本地项目中安装：npm install webpack@1.14.0 --save-dev
>  
> npm view webpack > version.webpack 查看webpack的版本号
> 
> 其次在当前项目的根目录下创建:   webpack.config.js  文件，填写如下的内容

	var path = require('path');
	module.exports = {
	    //->设置入口文件的绝对路径
	    entry: path.resolve('src/index.js'),
	    //->设置输出文件的目录和名称
	    output: {
	        path: path.resolve('build'),
	        filename: 'index.js'
	    }
	};

> 在本地项目的 package.json 文件中配置命令行执行

	{
	  ...
	  "scripts": {
	    "build": "webpack"
	  }
	  ...
	}

> 这样以后在命令行执行：npm run build  就可以完成webpack打包操作了

####3、devServer
> webpack-dev-server 是一个Web服务器，可以预览项目，并且当修改源码后可以实时刷新页面
>  
> npm install webpack-dev-server@1.16.2 --save-dev
>  
> 在 package.json 中配置新的执行命令：

	"scripts": {
	    "dev": "webpack-dev-server"
	}

> 执行 npm run dev，当服务创建成功后，我们在浏览器输入：http://localhost:8080  就可以看到我们的项目目录了

#####指定webpack-dev-server的配置项
> 在 webpack.config.js 中配置如下信息

	module.exports = {
	    ...
	    //->指定webpack-dev-server的配置项
	    devServer: {
	        port: 9090,//->设置创建服务的端口号
	        contentBase: './build',//->配置部署项目文件的根目录
	        inline:true //->设置自动刷新
	    },
	    ...
	};

> 如何自动打开浏览器：这个需要我们给 webpack 配置插件
> 1.安装插件
>  
>  npm install open-browser-webpack-plugin --save-dev
> 
> 2.在 webpack.config.js 中配置如下信息

	var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
	module.exports = {
		...,
		//->配置插件
	    plugins: [
	        new openBrowserWebpackPlugin({url: 'http://localhost:9090'})
	    ]
	}

####4、loader 加载器
> 之前我们讲解过ES6的语法，但是我们也提到了，在IE的低版本浏览器或者其它环境中是不支持的，我们需要使用babel进行编译，大概步骤如下：
>  
> 1. npm install babel-cli babel-preset-es2015 babel-preset-es2016  --save-dev
>  
> 2. 创建 .babelrc 文件，在文件中配置

	//->.babelrc
	{
	  "presets": [
	    "es2015",
	    "es2016"
	  ],
	  "plugins": []
	}
	
> 3.按照相同的方式，在 package.json 文件中配置执行的命令，然后使用npm run xxx 执行

<font color=red>那么问题来了!</font>
> 我们想要的肯定是，以后执行执行 webpack 这个命令，那么ES6转成ES5，然后再进行打包部署，这套流程应该是一体的，不应该在单独的执行两次命令才可以啊，所以我们需要用到了 webpack 中的加载器 loader

#####配置babel加载器解析JS
> 安装LOADER：
>  
> npm install babel-loader babel-core --save-dev

	//->webpack.config.js
	module.exports = {
	    entry: ...,
	    output: {...},
	    //->定义了对模块的处理逻辑
	    module: {
	        //->定义了一系列的加载器(Array)
	        loaders: [
	            {
	                test: /\.js$/,//->正则匹配使用当前加载器的文件类型
	                loader: 'babel-loader'//->设置加载器，loader可以省略不写，也就是写'babel'
	            }
	        ]
	    }
	};


#####配置样式文件(css/less)的加载器
> 需要安装的加载器：
> npm install less style-loader css-loader less-loader --save-dev
> - less-loader负责把less源码转成css代码
> - css-loader负责读取css代码
> - style-loader负责在css代码转变成style标签并作为页内样式插入到页面中去

	module: {
        //->定义了一系列的加载器(Array)
        loaders: [
            {
                test: /\.(less|css)$/i,
                loader: 'style!css!less'//->多个加载器之间用!隔开
            }
        ]
    }

#####配置图片资源加载器
> npm install file-loader url-loader --save-dev

	{
        test: /\.(woff|woff2|ttf|svg|eot|jpg|png)$/i,
        loader: "url?limit=8192" //->“?limit=8192”表示将所有小于8kb的图片都转为base64形式(其实应该说超过8kb的才使用url-loader来映射到文件，否则转为dataUrl形式)
    }

####5、自动产出HTML
> npm install html-webpack-plugin --save-dev

	var HtmlWebpackPlugin = require('html-webpack-plugin');
	plugins: [
	      new HtmlWebpackPlugin({
		       title: 'zhufeng-react',//->标题
		       template: './src/index.html', //->模板文件
	           filename:'./build/index.html' //->产出后的文件名称
	     })
	]

####6、区分环境
> package.json

	"scripts": {
		"publish-dev": "set BUILD_ENV=dev && webpack-dev-server",
		"publish-prod": "set BUILD_ENV=prod && webpack-dev-server"
	}

> webpack.config.js

	var webpack = require('webpack');
	var definePlugin = new webpack.DefinePlugin({
		 __DEV__: (process.env.BUILD_DEV||'dev').trim() == 'dev'
	});
	
	plugins: [
		definePlugin,
		...
	]

> 后期执行 npm run publish-dev 就是设置在开发环境下执行

####7、css文件单独加载 
> npm install extract-text-webpack-plugin --save-dev

	var ExtractTextPlugin = require("extract-text-webpack-plugin");
	
	//->配置文件中修改
	module: {
        loaders: [
            {
                test: /\.less$/i,
                loader: ExtractTextPlugin.extract("style-loader"
                    , "css-loader!less-loader")
            },
            {
                test: /\.css$/i,
                loader: ExtractTextPlugin.extract("style-loader"
                    , "css-loader")
            }
        ]
    },
    plugins: [
        definePlugin,
        new ExtractTextPlugin("index.css"),
        ...
    ]

####8、资源压缩
	plugins: [
        ...
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({
            compress: {
                warnings: false
            }
        }),
        //->查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.DedupePlugin(),
        //->按引用频度来排序ID,以便达到减少文件大小的效果
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        })
    ]

详细文档：
http://www.zhufengpeixun.cn/doc/html/%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/webpack.html
