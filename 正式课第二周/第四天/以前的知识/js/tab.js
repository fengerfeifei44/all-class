/**
 * Created by Administrator on 2016/11/6.
 */
(function(){
    var oTab=document.getElementById("tab");
    var tHead=oTab.tHead;
    var tCells=tHead.rows[0].cells;
    var tBody=oTab.tBodies[0];
    var aRows=tBody.rows;
    var data=null;
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open("get","data.txt",false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        }
        xml.send();
    }
    bind();
    function bind(){
        var frg=document.createDocumentFragment();
        for(var i=0;i<data.length;i++){
            var cur=data[i]
            var oTr=document.createElement('tr');
            for(var attr in cur){
                var oTd=document.createElement('td');
                if(attr=="sex"){
                    cur[attr]=cur[attr]==0?"ÄÐ":"Å®";
                }
                oTd.innerHTML=cur[attr];
                oTr.appendChild(oTd);
            }

            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg=null;
    }
    changeColor();
    function changeColor(){
        for(var i=0;i<aRows.length;i++){
            aRows[i].className="bg"+i%3;
        }
    }
    function sort(n){
        for(var i=0;i<tCells.length;i++){
            tCells[i].flag=n==i?tCells[i].flag*(-1):-1;
        }
        var ary=utils.makeArray(aRows);
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a)&&isNaN(b)){
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;
        })
        var frg=document.createDocumentFragment();
        for(var i=0;i<ary.length;i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        changeColor();
    }
    for(var i=0;i<tCells.length;i++){
        tCells[i].index=i;
        tCells[i].flag=-1;
        tCells[i].onclick=function(){
            sort(this.index);
        }
    }
})()