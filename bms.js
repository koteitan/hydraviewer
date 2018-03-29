/* Bashicu Matrix
  in: _s[][] = 
*/
var Bms=function(_s){
    this.s=_s;
};
Bms.prototype.toString=function(){
  var str="";
  for(var c=0;c<0;c++){
    str+="(";
    for(var r=0;r<this.s.length;r++){
      str += this.s[c][r];
      if(r!=this.s[c].length)str += ",";
    }
    str+=")";
  }
  return str;
}
/* findParent(m,ci) returns index of parent of ci.
   It returns -1 when the parent of ci cannot be found. */
Bms.prototype.findParent=function(ci){
  if(ci===undefined)ci=this.length()-1;
  for(var c=ci-1;c>=0;c--){
    if(this.s[c][0]==this.s[ci][0]-1){
      return c;
    }
  }
  return -1;
}
Bms.prototype.cols=function(){
  return this.s.length;
}
Bms.prototype.rows=function(){
  return this.s[0].length;
}
/*---------------------------
Bms.multiparse("(0,1,2)(3,4,5)\n(6,7,8)(9,10,11)")
= [[[0,1,2],[3,4,5]],[[6,7,8],[9,10,11]]] 
---------------------------*/
Bms.multiparse=function(str){
  var a=str.split("\n");
  var mm=new Array(a.length);
  for(var m=0;m<a.length;m++){
    mm[m]=Bms.parse(a[m]);
  }
  return mm;
}
/*---------------------------
parse("(0,1,2)(3,4,5)") = Bms([[0,1,2],[3,4,5]])
---------------------------*/
Bms.parse=function(str){
  var a=[[]];
  //              1  2   3   4
  var r = /^(\s*\()(.*?)(\))(.*)/;
  var m=str.match(r);
  var ci=0;
  while(m!=null){
    var c=m[2].split(",");
    for(ri=0;ri<c.length;ri++){
      a[ci].push(parseInt(c[ri],10));
    }
    str=m[4];
    if(str=="")break;
    m=str.match(r);
    if(m!=null){
      a.push([]);
      ci++;
    }
  }
  return new Bms(a);
}
