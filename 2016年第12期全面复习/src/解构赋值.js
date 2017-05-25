// let arr = [12, 23, 34];
// let n = arr[1];
// let [a,b,c]=arr;

// let arr = [12, [23, 34]];
// let [,[,a]]=arr;

//->拓展运算符：就是把某些部分抛出在外后,把剩下的部分都用数组存储起来
// let arr = [12, 23, 34, 45, 56];
// let [a,b,...c]=arr;
// let fn = (a, b, ...key)=> {
//     console.log(key);//->[3, 4, 5, 6, 7, 8]
// };
// fn(1, 2, 3, 4, 5, 6, 7, 8);

let obj = {
    a: 1,
    b: [10, 20, [30, 40]],
    c: ()=> {

    },
    d(){

    }
};
// let {a, b, c, f}=obj;
//->a:1 obj.a
//->f:undefined obj.f

//let {d:f}=obj;
//->f:function... obj.d

// let {b:[,,[,a]]}=obj;
// console.log(a);//->40
