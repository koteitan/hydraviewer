var ctx     = outcanvas.getContext('2d');
var items;
var allsum;
var allmax;
var allmin;
var dothemall=function(){
  //parse
  var w=parseInt(width.value);
  var h=parseInt(height.value);
  var mm=parseMultiMatrices(intext.value);
  // draw
  outcanvas.width =width .value;
  outcanvas.height=height.value;
  drawTree(mm);
  outImg();
};

/*---------------------------
parseMultiMatrices("(0,1,2)(3,4,5)\n(6,7,8)(9,10,11)")
= [[[0,1,2],[3,4,5]],[[6,7,8],[9,10,11]]] 
---------------------------*/
var parseMultiMatrices=function(str){
  var a=str.split("\n");
  var mm=new Array(a.length);
  for(var m=0;m<a.length;m++){
    mm[m]=parseAMatrix(a[m]);
  }
  return mm;
}
/*---------------------------
parseAMatrix("(0,1,2)(3,4,5)") = [[0,1,2],[3,4,5]] 
---------------------------*/
var parseAMatrix=function(str){
  var a=[];
  //              1  2   3   4
  var r = /^(\s*\()(.*?)(\))(.*)/;
  var m=str.match(r);
  while(m!=null){
    a.push(m[2].split(","));
    str=m[4];
    if(str=="")break;
    m=str.match(r);
  }
  return a;
}

var drawtype = "pair sequence hydra";
var psh=new function(){};
psh.radius     = 10;
psh.colshift   = psh.radius*3;
psh.levelshift = psh.radius*2;
psh.marginsall = [[10,10],[10,10]]; //[[L,R],[Top,Bottom]]
var drawTree=function(mm){
  switch(drawtype){
    case "pair sequence hydra":
      var root=[0,0];
      var branchr = psh.shift-psh.radius;
      for(mmi=0;mmi<mm.length;mmi++){
        var m=mm[mmi];
        var levels = (transpose(m)[0]).max();
        //draw root
        root[0]=psh.marginsall[0][0] + psh.radius;
        root[1]=psh.marginsall[0][1] + (levels+1)*psh.levelshift;
        ctx.strokeStyle='black';
        ctx.fillText("r",root[0],root[1]);
        //draw columns
        for(ci=0;ci<m.length;ci++){
          var level  = m[ci][0];
          var text   = String(m[ci][1]);
          var cx     = root[0]+ci   *psh.colshift;
          var cy     = root[1]-level*psh.levelshift;
          ctx.font = '10px Segoe UI';
          textwidth  = ctx.measureText(text).width;
          textheight = textwidth/text.length*2;
          ctx.strokeStyle='black';
          ctx.arc(cx,cy,psh.radius,0,2*Math.PI,true);
          ctx.fillText(text,cx,cy);
        }
      }
    break;// pair sequence hydra
  }//switch
}

var outImg=function(){
  outimg.width  = width.value;
  outimg.height = height.value;
  outimg.src = outcanvas.toDataURL('image/jpg');
}
Array.prototype.toString = function(){
  var s="[";
  var i=0;
  for(i=0;i<this.length-1;i++){
    s+=this[i].toString()+", ";
  }
  if(this.length==0){
    s+="]";
  }else{
    s+=this[i].toString()+"]";
  }
  return s;
}
