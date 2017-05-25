###学习笔记
####ES6
> ECMAScript 6.0（以下简称ES6）是JavaScript语言的下一代标准，已经在2015年6月正式发布了。它的目标，是使得JavaScript语言可以用来编写复杂的大型应用程序，成为企业级开发语言。
> - 在学习ES6之前需要熟练掌握ES3/ES5
> - ES6在目前的很多环境中都不支持，我们需要使用Babel(JS编译器)将ES6编译为ES5，这样就可以在目前的环境中执行了'
> - ES6中提供了很多新的语法，掌握一些常用的(20%左右)即可，剩下的看具体的工作需求以及个人的爱好了

#####1、局部变量let和常量const
	//let定义的变量不会污染window属性上的值
	var a=12; window.a->12
	let b=13; window.b->undefined 
	
	//-----------------------------------------------------
	//let定义的变量不能重复被定义
	let a=12;
	let a=13; //->报错
	
	//------------------------------------------------------
	//->LET定义的变量只能在当前的块级作用域中起到作用
	for (let i = 0; i < 10; i++) {
	    console.log(i);
	}
	console.log(i);//->Uncaught ReferenceError:i is not defined
	  
	//-----------------------------------------------------  
	let oBox = document.getElementById('box'),
	    boxList = oBox.getElementsByTagName('li'),
	    boxContainers = oBox.getElementsByTagName('div');
	/*
	for (var i = 0; i < boxList.length; i++) {
	    boxList[i].onclick = function () {
	        for (var j = 0; j < boxList.length; j++) {
	            boxList[j].className = boxContainers[j].className = '';
	        }
	        boxList[i].className = boxContainers[i].className = 'cur';
	    }
	}
	//->Uncaught TypeError: Cannot set property 'className' of undefined 说明这种方式不可以
	*/
	
	
	/*
	//->解决办法套一层作用域
	for (var i = 0; i < boxList.length; i++) {
	    boxList[i].onclick =(function (i) {
	        return function () {
	            for (var j = 0; j < boxList.length; j++) {
	                boxList[j].className = boxContainers[j].className = '';
	            }
	            boxList[i].className = boxContainers[i].className = 'cur';
	        }
	    })(i);
	}
	*/
	
	//->使用LET定义变量，自然就把这个问题解决了
	for (let i = 0; i < boxList.length; i++) {
	    boxList[i].onclick = function () {
	        for (let j = 0; j < boxList.length; j++) {
	            boxList[j].className = boxContainers[j].className = '';
	        }
	        boxList[i].className = boxContainers[i].className = 'cur';
	    }
	}
	 
	//-----------------------------------------------------
	let a = 12;
	a = 13;
	console.log(a);//->13
	
	const b = 12;
	b = 13;//->常量的值不能被修改，而且起名也有默认的规范：字母大写中间用_隔开
	console.log(b);

#####2、解构赋值
	var ary = ['鼠', '牛', '虎'];
	var [a]=ary;
	var [,b]=ary;
	var [c,d,e,f]=ary;
	 
	//->解析后的结果
	var ary = ['鼠', '牛', '虎'];
	var a = ary[0];
	var b = ary[1];
	var c = ary[0],
	    d = ary[1],
	    e = ary[2],
	    f = ary[3];
    
    //-----------------------
    var ary = ['鼠', ['牛', '虎']];
	var [a,[b,c]]=ary;
	console.log(b);//->牛
	 
	//----------------------
	var obj = {
	    a: 12,
	    b: ['鼠', ['虎', '牛']],
	    c(){}
	};
	var {a, b, c}=obj;
	console.log(c);
	
	var [,[,niu]]=b;
	console.log(niu);
	 
	var {a,b,fn}=obj;
	console.log(fn);//->undefined 但是可以按照如下的修改
	var {a,b,c:fn}=obj;
	console.log(fn);//->这样就有值了
     
    var {a,b:[,[,x]]}=obj;
    console.log(x);//->牛 这种情况属于解构赋值嵌套

#####3、拓展运算符
	var arr = [1, 2, 3, 4];
	var [a,...key]=arr;
	/*
	 var arr = [1, 2, 3, 4];
	 var a = arr[0],
		 key = arr.slice(1);
	*/
	
	//----------------------------------
	var fn = (parm1, ...keys)=> {
	    console.log(keys);
	};
	fn(1, 2, 3, 4, 5, 6);
	/*
	 var fn = function fn(parm1) {
		 for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			 keys[_key - 1] = arguments[_key];
		 }
		 console.log(keys);
	 };
	 fn(1, 2, 3, 4, 5, 6);
	 */
      
    //-----------------------------------
    var arr2 = [1, 22, 3, 4];
	var newArr = [...arr2, 100, 0];
	console.log(Math.max(...newArr));
	/*
	 var arr2 = [1, 22, 3, 4];
	 var newArr = [].concat(arr2, [100, 0]);
	 console.log(Math.max.apply(Math, _toConsumableArray(newArr)));
	*/

#####4、箭头函数
	var fn=()=>{}
	var fn=a=>a;
	var fn=(a,b)=>a+b;
	var fn=(a,b)=>{
		return a*100+b*100;
	}

	//->箭头函数没有上下文(context)，函数中的this继承父级的this
	var obj={
	   name:'zhufeng',
	   fn:function(){
	      var f=()=>{
	          console.log(this);
	      }
	      f();
	   }
	}
	obj.fn(); //-> obj,f中的this继承了fn中的this

    //->也可以直接的赋值给对象
	var fn = (a, b)=> {
	    console.log(a + b);
	};
	var obj = {name: '珠峰', fn};
	obj.fn(1, 2);
	 
	//------------------------------------------------
	//->参数默认值
	var fn = (a, b)=> {
	    a = a || 0;
	    b = b || 0;
	    console.log(a + b);
	};
	fn(1);
	
	var fn2 = (a = 0, b = 0)=> {
	    console.log(a + b);
	};
	fn2();

#####5、类和继承
	class Person {
	    constructor(name, age) {
	        this.name = name;
	        this.age = age;
	    }
	    say() {}
	    fn() {}
	    static eat() {}
	}
	console.dir(Person);//-> 其中name/age是当前类实例的私有属性；say/fn写在了Person.prototype上；eat写在了Person上；
	
	class ManPerson extends Person {
	    constructor(name, age) {
	        super(name, age);//->supper就是继承的类,这里相当于Person.prototype.constructor.call(this, name,age) 或者 Person.call(this,name,age);
	        this.sex = '男';
	    }
	    moneyFn() {
	        console.log('男人要赚钱养家!');
	    }
	}
	console.dir(ManPerson);
	//->ManPerson 继承了 Person 

#####6、模板字符串
	var name = 'zhufeng';
	var age = 8;
	var tempStr = `${name} is ${age} years old.`;
	console.log(tempStr);
	 
	//->编译后
	var name = 'zhufeng';
	var age = 8;
	var tempStr = name + ' is ' + age + ' years old.';
	console.log(tempStr);

####Babel
> Babel是一个广泛使用的转码器，可以将ES6代码转为ES5代码，从而在现有环境执行

#####1、安装
> npm install babel-cli -g     安装到全局(可以通过命令行的方式执行babel)
>  
> npm install babel-cli --save-dev   安装到当前项目目录下(并且在项目的package.json中记录安装的版本)

#####2、命令行使用
> 在命令行中执行：npm -help 可以查看babel中提供的操作命令
> - -V(--version) 查看安装的babel的版本号
> - -o(--out-file) 单独编译某一个文件
> - -d(--out-dir) 编译整个文件夹中的文件
> - ...
>  
> 例如：babel A.js -o B.js  把A.js中的ES6代码编译成为ES5，然后输出在B.js中

#####3、解析预设
> 在本地项目中创建 '.babelrc' 文件，在文件中配置插件和转码规则

	{
	  "presets": ["es2015"], //->设置转码规则，官方提供以下的规则集，你可以根据需要安装：
	   /*
	    # ES2015转码规则
		$ npm install --save-dev babel-preset-es2015
		 
		# ES2016转码规则
		$ npm install --save-dev babel-preset-es2016
		 
		# ES2017转码规则
		$ npm install --save-dev babel-preset-es2017

		# react转码规则
		$ npm install --save-dev babel-preset-react

		# ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
		$ npm install --save-dev babel-preset-stage-0
		$ npm install --save-dev babel-preset-stage-1
		$ npm install --save-dev babel-preset-stage-2
		$ npm install --save-dev babel-preset-stage-3
		 
		...
		http://babeljs.io/docs/plugins/
	   */
	    
	  "plugins": []
	}

#####4、在Babel中解析 React jsx 语法
> 安装 babel-preset-react

	import React, {Component} from 'temp';
	import ReactDOM, {render} from 'temp';
	class MyComponent extends Component {
	    render() {
	        return <h1> HELLO </h1>;
	    }
	}
	render(<MyComponent/>, document.getElementById('app')); 

> 完成后一样去执行 npm run build 即可