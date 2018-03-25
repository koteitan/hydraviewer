var ctx     = outcanvas.getContext('2d');
var items;
var allsum;
var allmax;
var allmin;
var dothemall=function(){
  //parse
  var mm=parseMultiMatrices(intext.value);
  // draw
  usedsize=drawTree(mm);
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
  return a;
}
/* findParent(m,ci) returns index of parent of ci.
   It returns -1 when the parent of ci cannot be found. */
var findParent=function(m, ci){
  for(var c=ci-1;c>=0;c--){
    if(m[c][0]==m[ci][0]-1){
      return c;
    }
  }
  return -1;
}
var drawtype = "pair sequence hydra";
var psh=new function(){};
psh.radius     = 10;
psh.colshift   = psh.radius*3;
psh.levelshift = psh.radius*2;
psh.marginsall = [[10,10],[10,10]]; //[[L,R],[Top,Bottom]]
psh.marginmatrices = 10;
psh.fontsize   = 15;
var drawTree=function(mm){
  var usedsize=[0,0];
  debug.value="";
  switch(drawtype){
    case "pair sequence hydra":
      //calc size
      for(mmi=0;mmi<mm.length;mmi++){
        var m=mm[mmi];
        var levels = (transpose(m)[0]).max()+1;
        usedsize[0] = Math.max(usedsize[0] , (m.length+1)*psh.colshift  );
        usedsize[1] =          usedsize[1] + (levels  +1)*psh.levelshift ;
      }
      usedsize[1] += psh.marginmatrices*(mm.length-1);
      usedsize[1] += psh.marginsall[1][0]+psh.marginsall[1][1];
      usedsize[0] += psh.marginsall[0][0]+psh.marginsall[0][1];
      //resize canvas
      outcanvas.width=usedsize[0];
      outcanvas.height=usedsize[1];
      var root=[psh.marginsall[0][0], psh.marginsall[0][1]];
      for(mmi=0;mmi<mm.length;mmi++){
        var m=mm[mmi];
        var levels = (transpose(m)[0]).max()+1;
        root[0] =psh.marginsall[0][0] + psh.radius; // no inclement.
        root[1]+=(levels+1)*psh.levelshift;         // inclement. +1 is for root.
        if(mmi>0)root[1]+=psh.marginmatrices;       // margin for matrices
        //draw root
        var text   = "r";
        ctx.strokeStyle='black';
        ctx.font = String(psh.fontsize)+'px Segoe UI';
        textwidth  = ctx.measureText(text).width;
        textheight = psh.fontsize;
        ctx.fillText(text,root[0]-textwidth/2,root[1]+textheight/2*0.7);
        //draw columns
        for(ci=0;ci<m.length;ci++){
          var level  = m[ci][0];
          var cx     = root[0]+(ci   +1)*psh.colshift;
          var cy     = root[1]-(level+1)*psh.levelshift;
          
          // stroke circle
          ctx.strokeStyle="rgba(0,0,0,0.3)";
          ctx.lineWidth  = 2;
          ctx.beginPath();
          ctx.arc(cx,cy,psh.radius,0,2*Math.PI,false);
          ctx.stroke();
          ctx.strokeStyle='black';
          ctx.lineWidth  = 1;
          ctx.beginPath();
          ctx.arc(cx,cy,psh.radius,0,2*Math.PI,false);
          ctx.stroke();
          
          // stroke branch
          var branchr = psh.levelshift-psh.radius; // radius of branch
          var pi      = findParent(m,ci);     // parent
          var px     = root[0]+(pi      +1)*psh.colshift;
          var py;
          if(pi>=0){
              py     = root[1]-(m[pi][0]+1)*psh.levelshift;
          }else{//branch for root
              py     = root[1];
          }
          ctx.strokeStyle='black';
          ctx.lineWidth  = 1;
          ctx.beginPath();
          ctx.arc(cx-branchr, cy+psh.radius, branchr, 0, Math.PI/2,false);
          ctx.stroke();
          ctx.strokeStyle='black';
          ctx.lineWidth  = 1;
          ctx.beginPath();
          ctx.moveTo(cx-psh.radius, cy+branchr+psh.radius);
          ctx.lineTo(px+branchr, py);
          ctx.stroke();
          
          // stroke text
          text   = String(m[ci][1]);
          ctx.strokeStyle='black';
          ctx.font = String(psh.fontsize)+'px Segoe UI';
          textwidth  = ctx.measureText(text).width;
          textheight = psh.fontsize;
          ctx.fillText(text,cx-textwidth/2,cy+textheight/2*0.7);
          
          debug.value=debug.value+"ci="+String(ci)+" cx="+String(cx)+" cy="+String(cy);
          debug.value=debug.value+"\n";
        }//for ci
      }//for mmi
    break;// pair sequence hydra
  }//switch
  return usedsize;
}

var outImg=function(){
  outimg.width  = outcanvas.width;
  outimg.height = outcanvas.height;
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
