// let fn = (a = 0, b = 0)=> {
//     // typeof a === "undefined" ? a = 0 : null;
//     // b = b || 0;
//     console.log(a + b);
// };
// fn(1);

// let fn = (a = 0, b = 0)=>a + b;
// let fn = a=> {
//
// };

// let fn = ()=> {
//
// };

/*箭头函数中出现的THIS和ES5中的那套机制不一样
 *[ES5]
 * - 自执行函数(或者部分匿名函数)中的this是window
 * - 给元素的事件绑定方法，事件触发的时候，方法中的THIS是当前元素(DOM2事件绑定在IE低版本浏览器中方法中的THIS依然是window=>attachEvent)
 * - 函数执行，看函数前面是否有.,有的话,点前面是谁this就是谁
 * - 使用call/apply/bind可以改变this指向问题
 * - 构造函数中的this是当前的类的一个实例
 *[ES6]
 * 箭头函数中的this就看所在的父级作用域this是谁
 */
// let obj = {
//     n: 0,
//     fn(){
//         console.log(this);
//     }
// };
// obj.fn();


/*let提供了块级作用域,定义的变量只能在当前的块级作用域中使用*/
// for (var i = 0; i < 10; i++) {
//
// }
// console.log(i);//->10
// for (let i = 0; i < 10; i++) {
//
// }
// console.log(i);//->报错:i不存在

/*let变量不能被重复定义(同一个作用域或者块级作用域中)*/
// let a = 12;
// let a = 13;//->Uncaught SyntaxError: Identifier 'a' has already been declared

// for (let i = 0; i < 10; i++) {
//
// }
// for (let i = 0; i < 10; i++) {
//
// }

// for (var i = 0; i < 5; i++) {
//     window.setTimeout(function () {
//         console.log(i);//->5 * 5
//     }, 0);
// }

// for (var i = 0; i < 5; i++) {
//     ~function (i) {
//         window.setTimeout(function () {
//             console.log(i);//-> 0 1 2 3 4
//         }, 0);
//     }(i);
// }

// for (let i = 0; i < 5; i++) {
//     window.setTimeout(function () {
//         console.log(i);//-> 0 1 2 3 4
//     }, 0);
// }

// var obj = {
//     fn: (function () {
//         return function () {
//
//         }
//     })()
// };
// var fn = obj.fn;
// fn = null;
// obj.fn = null;


