class jQuery {
    constructor() {
        //->都是实例的私有属性
        //this.xxx = xxx;
    }

    fn() {
        //->fn就是定义在jQuery.prototype上的方法
    }

    static sum() {
        //->把jQuery当做一个普通对象, 增加的属性方法
    }
}

//var a = new jQuery();
//a.xxx
//a.fn()  a.__proto__.fn()

//jQuery.sum();

class Fn extends jQuery {
    constructor(name) {
        super(name);//->jQuery:super  jQuery.call(this,name)在使用CALL继承的方式把父级实例的私有属性继承过来
        //this.xxx=xxx;
    }

    s() {
        //->s也是子类原型的方法,父类的方法已经被继承,不需要我们自己在次处理
    }
}


// import React from 'react';
// import ReactDOM from 'react-dom';
// class Person extends React.Component{
//
// }











