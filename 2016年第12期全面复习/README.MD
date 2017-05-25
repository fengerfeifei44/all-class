##2016年第十二期复习
> HTML+CSS必须要要会的
> - 自己看CSS面试题
> - 现在有时间，自己找一个网站(稍微复杂点的)，自己回去扒代码

> JavaScript (ECMAScript3/5/6)

###免费课：
> JS引入方式、数据类型、数据类型检测、函数、三个判断三个循环、数组、字符串

####数组
> Array.prototype
> [].slice.call(arguments,0,4) ->借用数组原型上的方法操作类数组，数组中的所有方法都可以这样的来玩
- push  ary[ary.length]=xxx
- pop   ary.length--
- shift
- unshift
- splice
- slice
- concat
- join
- toString
- reverse
- sort(function(a,b){return a-b"[>0|<=0]";})
- indexOf/lastIndexOf
- forEach
- map
- filter
- find

> 数组中常用的算法：数组去重、数组的冒泡排序、数组的快速排序、数组的插入排序
```
Array.prototype.myDistinct=function(){
    var obj={};
    for(var i=0;i<this.length;i++){
        var cur=this[i];
        if(obj[cur]==cur){
           //this.splice(i,1);//->后面的索引都会改变,性能不好
           this[i]=this[this.length-1];
           this.length--; //->虽然优化了性能但是会打乱原来的排列顺序
           i--;
           continue;
        }
        obj[cur]=cur;
    }
    return this;//->为了实现链式写法,JQ中的链式写法的原理
}
ary.myDistinct()
```

####字符串
> String.prototype
- charAt / charCodeAt(获取的是查找字符的Unicode编码值)
- String.fromCharCode(22521) 把String当做一个对象，调用私有的fromCharCode方法,把Unicode编码值对应的字符串获取到
- substr(n,m) 从索引n截取m个
- substring(n,m) 从索引n找到索引m处(不包含m)
- slice(n,m) 和substring语法相同，只是索引可以是负数(str.length+n 如果n是负值)
- indexOf / lastIndexOf
- split
- replace([reg],[function])
- match([reg])
- localeCompare
- toUpperCase / toLowerCase
- trim 去除字符串的首尾空格 trimLeft / trimRight (ES5)

> 解决trim不兼容的问题
```
String.prototype.myTrim=function(){
    return this.replace(/(^\s+)|(\s+$)/g,'');
}
//-> ' 珠峰  '.myTrim()  => '珠峰'
//-> '    珠峰  '.myTrim().charAt(1) =>'峰'  链式写法:只要保证方法执行完成的结果依然是当前类的实例,我们就可以一直链接下去(jQuery中的方法结束后经常写return this)
```

> 解析URL问号传递参数的值
```
var str=http://www.zhufengpeixun.cn/school/index.html?name=zxt&age=27#man  
//->URI统一资源标识符(URL统一资源定位符 + URN统一资源名称)
//->使用字符串截取的办法
var n=str.indexOf('?'),
    m=str.lastIndexOf('#');
var result=m===-1?str.substring(n+1)?str.substring(n+1,m);
var obj={},
    ary=result.split('&');
ary.forEach(function(item,index){
    var arr=item.split('=');
    obj[arr[0]]=arr[1];
});

//->使用正则处理
var obj={},
    reg=/([^?=&#]+)=([^?=&#]+)/g;
str.replace(reg,function(){
   //arguments[0] ->大正则本次匹配的内容
   //arguments[1] ->第一小分组本次捕获的内容
   var arg=arguments,
       key=arg[1],
       value=arg[2];
   obj[key]=value;
});

//->我们利用A标签完成操作
function queryURLParameter(){
    var oLink=document.createElement('a');
    oLink.href='http://www.zhufengpeixun.cn/school/index.html?name=zxt&age=27#man';
    var pathname=oLink.pathname,
        hostname=oLink.hostname,
        hash=oLink.hash,
        search=oLink.search;//->'?name=zxt&age=27'
    if(search.length===0) return;    
    
    var obj={};
    search=search.substr(1);//->'name=zxt&age=27'
    search=search.split(/(?:&|=)/g);//->["name", "zxt", "age", "27"]
    for(var i=0;i<search.length;i+=2){
       obj[search[i]]=search[i+1];
    }
    return obj;
}

```

####Math数学函数
> Math只是一个对象，他不是类，直接输出dir(Math)查看常用的方法
- Math.PI 圆周率
- Math.abs
- Math.ceil
- Math.floor
- Math.round
- Math.random  => Math.round(Math.random()*(m-n)+n)
- Math.max
- Math.min
- Math.pow 多少次幂 Math.pow(10,3) =>1000
- Math.sqrt 开平方

```
var ary=[12,23,14,34,25,36,13],
    max=0,
    min=0;

/*获取数据中的最大值和最小值ES5*/
//->排序
ary.sort(function(a,b){return a-b;});
max=ary[ary.length-1];
min=ary[0];

//->假设
max=ary[0];
min=ary[0];
for(var i=1;i<ary.length;i++){
   var cur=ary[i];
   cur>max?max=cur:null;
   cur<min?min=cur:null;
}

//->EVAL
max=eval("Math.max("+ary.toString()+")"); //->通过字符串拼接的方式先把需要执行的JS语句拼接成为一个字符串"Math.max(12,23,14...)"，然后使用EVAL转换为JS执行

//->apply
max=Math.max.apply(null,ary); //->利用了apply再执行方法改变this的时候，需要把传递给方法的参数以数组的形式传递,但是也相当于在一个个的赋值


//->ES6
let ary=[12,23,14,34,25,36,13];
let newAry=[...ary,100,10]; //->使用拓展运算符把两个数组进行拼接
max=Math.max(...newAry);
```

####Number
> Number.prototype
- toFixed

> 常用操作数字的方法
- parseInt([val],[进制]) 第二个参数不常用
- parseFloat
- Number
- isNaN => NaN => typeof NaN==="number" => NaN===NaN是不成立的

####Boolean
> 只有NaN、0、""、null、undefined为false，其余都是true
> == / ===
> ! / !!=>Boolean

####null和undefined
> null==undefined 这个是真的
> null===undefined 这个是假的
> 耿大大的男朋友是undefined，女朋友是null

####object
var a='age';
obj[a] =>属性名:age
obj["a"] =>属性名:a

> Object.prototype
- hasOwnProperty
- isPrototypeOf
- toString =>不是转换成字符串的方法，而是检测数据类型的方法 
  + Object.prototype.toString.call([val]) =>"[object 类]" 检测数据类型最准确的办法
  
  + typeof [val] => 字符串("function"...) => typeof typeof [12,23] 结果是"string" => 不能细分是对象还是数组或者还是正则,这几种数据返回的结果都是"object"
  
  + [example] instanceof [class] 检测实例是否属于这个类的，只要当前类在实例的原型链上,最后的结果都是true，例如：ary instanceof Array 是true，ary instanceof Object 也是true，这样就会导致在原型继承的情况下，检测出来的结果是不准确的
  
  + constructor和instanceof存在同样的问题，一般项目中也不用这个办法
  
####函数
> 普通函数：作用域和内存释放问题
> 类：
> 普通对象：
> ES6中的箭头函数

####Object->类数组或者元素对象
> arguments
> HTMLCollection / NodeList
> $()


1、
预解释：在JS代码执行之前，浏览器会进行一个默认的操作(预解释/变量提声)，把所有带var和function关键词的进行提前声明或者定义，带var的是提前声明，带function是声明+定义都完成了

作用域(闭包)：堆栈内存释放

THIS

面向对象：对象、类、实例，类的继承封装和多态，原型链和构造原型模式

单例模式


2、












