let ary = [12, 23, 14, 34, 25, 36, 13];
let newAry = [...ary, 100, 10];
let max = Math.max(...newAry);

let a = 12;

//->我想把ES6转换为ES5 =>Babel：可以把ES6->ES5，也可以把React中的JSX语法编译为JS语法
/*
 * npm init -y 在本地生成一个配置清单(package.json)：
 *   1、可以在scripts中配置脚本，在本地项目中也可以执行我们的命令(我们之前想要使用命令操作某一个安装的模块，需要把模块安装到全局，但是安装到全局可能出现版本冲突的问题，为了不发生冲突，真实项目中我们都需要把模块安装到项目本地，但是安装到本地默认就不能使用命令行来操作了，如果想用的话，需要在本地生成的package.json的scripts中配置命令行操作)
 *   "scripts": {
 "test": "echo hello world"
 }
 *   以后我们只需要执行npm run test 就执行了 echo hello world 这个命令
 *
 *   2、当我们在安装模块的时候，我们在后面加 --save-dev 把安装的模块保存在package.json的依赖清单中，这样我们以后把项目上传或者发给别人的那时候，就不需要把node_modules发送过去了，别人拿到我们的项目后，执行npm install，就会按照清单把所有需要的依赖包安装完成(跑环境)
 *
 *   --save 添加的是发布依赖
 *   --save-dev 添加的是开发依赖
 *
 * 安装babel以及解析的语言包: npm install babel-cli babel-preset-es2015 babel-preset-es2016 babel-preset-react --save-dev
 *
 * 在本地配置 .babelrc文件，在文件中设置解析机制和依赖插件
 * {
     "presets": [
     "es2015",
     "es2016",
     "react"
     ],
     "plugins": []
   }
 *
 * 在package.json中配置执行的命令
 *  "scripts": {
     "build": "babel src -d build"  //->把整个文件夹中的内容都进行编译
     //->babel xxx.js -o xxx.js编译单独的一个文件
     //->babel xxx -wd xxx 不仅编译，而且随时监听变化，只要有修改自己就编译了
    }

 npm run build
 */