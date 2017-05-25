//如果没有书 希望读出空数组
var fs = require('fs');
function readBooks(callback) {
    //在函数内部 预置 参数
    fs.readFile('./books.json','utf8',function (err,data) {
        if(data=='' || err){
            callback([]);
        }else{
            callback(JSON.parse(data));
        }
    });
}
function writeBooks(data,callback) {
    fs.writeFile('./books.json',JSON.stringify(data),callback);
}
var id = 1;
/*
readBooks(function (data) {
    data=data.filter(function (item) {
        return item.id!=1;
    });
    writeBooks(data,function () {
        console.log(1);
    })
})*/
var obj={"bookName":"js","bookPrice":100,"bookCover":"http://img5.imgtn.bdimg.com/it/u=2310841639,      3812038310&fm=23&gp=0.jpg"};
readBooks(function (data) {
    data=data.map(function (item) {
        if(item.id==2){
            return obj;
        }
        return item;
    });
    writeBooks(data,function () {
        console.log(1);
    })
})