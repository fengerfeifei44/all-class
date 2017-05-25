/**
 * Created by Administrator on 2016/11/4.
 */
(function () {
    var oTab = document.getElementById("tab");
    var tHead = oTab.tHead;
    var tCells = tHead.rows[0].cells;
    var tBody = oTab.tBodies[0];
    var aRows = tBody.rows;
    var data = null;
    getData();
    function getData() {
        var xml = new XMLHttpRequest;
        xml.open("get", "data.txt", false)
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && /^2\d{2}$/.test(xml.status)) {
                data = utils.jsonParse(xml.responseText);
                console.log(data);
            }
        }
        xml.send()
    }
    changeColor();
    function changeColor(){
        for(var i=0;i<aRows.length;i++){
            aRows[i].className="bg"+i%3;
        }
    }

    bind();
    function bind() {
        var frg = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            var oTr=document.createElement('tr');
            var cur=data[i];
            for(var attr in cur){
                var oTd=document.createElement('td');
                if(attr=="sex"){
                    cur[attr]=cur[attr]==0?"男":"女";
                }
                oTd.innerHTML+=cur[attr];
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg=null;
       // changeColor();
    }
    function sort(n){
        for(var i=0;i<tCells.length;i++){
            /*if(n==i){
                tCells[i].flag*=-1;
            }else{
                tCells[i].flag=-1;
            }*/
           tCells[i].flag=n==i?tCells[i].flag*(-1):-1;
        }
        var ary=utils.makeArray(aRows);
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a)||isNaN(b)){
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
        tCells[i].flag=-1;
        tCells[i].index=i;
        tCells[i].onclick=function(){
            sort(this.index);
        }
    }
})()