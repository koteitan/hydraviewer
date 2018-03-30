var ctx     = outcanvas.getContext('2d');
var items;
var allsum;
var allmax;
var allmin;
var dothemall=function(){
  //parse
  var str=intext.value;
  str=str.replace(/^\n*/g, "");
  str=str.replace(/\n*$/g, "");
  str=str.replace(/\n+/g, "\n");
  var mm=Bms.multiparse(str);
  // draw
  usedsize=drawTree(mm);
  outImg();
};


var drawtype = "pair sequence hydra";
var psh=new function(){};
psh.radius     = 10;
psh.colshift   = psh.radius*3;
psh.levelshift = psh.radius*2;
psh.marginsall = [[10,10],[10,10]]; //[[L,R],[Top,Bottom]]
psh.marginmatrices = 0;
psh.fontsize   = 15;
var drawTree=function(mm){
  var usedsize=[0,0];
  debug.value="";
  switch(drawtype){
    case "pair sequence hydra":
      //calc upperbound and lowerbound of each hydras
      var matrices = mm.length;
      var maxcols = 0;
      for(mmi=0;mmi<matrices;mmi++){
        var m=mm[mmi];
        maxcols  = Math.max(maxcols, m.cols());
      }
      var upperbound=new Array(matrices);
      var lowerbound=new Array(matrices);
      for(mmi=0;mmi<matrices;mmi++){
        var m=mm[mmi];
        upperbound[mmi]=new Array(maxcols);
        lowerbound[mmi]=new Array(maxcols);
        for(x=0;x<maxcols;x++){
          upperbound[mmi][x]=1;
          if(x<m.cols()){
            lowerbound[mmi][x]=m.s[x][0];
          }else{
            lowerbound[mmi][x]=+Infinity;
          }
        }
      }
      for(mmi=0;mmi<matrices;mmi++){
        var m=mm[mmi];
        for(cx=0;cx<m.cols();cx++){
          upperbound[mmi][cx] = m.s[cx][0]+1; //length of root to child
          var px = m.findParent(cx);
          if(px>=0){
            // fill for branch at parent to child in x axis
            for(cx2=px;cx2<=cx;cx2++){
              // fill for branch at a level lower than child in y axis (+1 for root)
              lowerbound[mmi][cx2]=Math.min(lowerbound[mmi][cx2], m.s[px][0]+1);
            }
          }else{
            // fill for branch at parent(=root) to child in x axis
            for(cx2=0;cx2<=cx;cx2++){
              // fill for branch at level 0
              lowerbound[mmi][cx2]=0;
            }
          }//if
        }//for cx
      }//for mmi

      //packing and decide position of root
      //depth[x] = used area of column x
      var depth=new Array(maxcols);
      for(x=0;x<maxcols;x++) depth[x]=0;
      //rooty      [mmi] = y-position of root of mmi th matrix [unit is nodes]
      //rooty_pixel[mmi] = y-position of root of mmi th matrix [unit is pixels]
      //rootx_pixel[mmi] = x-position of root of mmi th matrix [unit is pixels]
      var rooty      =new Array(matrices);
      var rooty_pixel=new Array(matrices);
      var rootx_pixel=psh.radius;
      for(mmi=0;mmi<matrices;mmi++){
        rooty[mmi] = 1;
        for(x=0;x<maxcols;x++){
          rooty[mmi] = Math.max(rooty[mmi], upperbound[mmi][x]+depth[x]+1);
        }
        for(x=0;x<maxcols;x++){
          var prev = depth[x];
          depth[x] = Math.max(prev, rooty[mmi]-lowerbound[mmi][x]);
        }
        rooty_pixel[mmi] = rooty[mmi];
        rooty_pixel[mmi] *= psh.levelshift;
        rooty_pixel[mmi] += mmi*psh.marginmatrices;
      }
      // decide use size
      usedsize[0]  = (maxcols+1)*psh.colshift + psh.radius*2;
      usedsize[0] += psh.marginsall[0][0];
      usedsize[0] += psh.marginsall[0][1];
      
      usedsize[1]  = rooty_pixel[mm.length-1] + psh.levelshift + psh.radius*2;
      usedsize[1] += psh.marginsall[1][0];
      usedsize[1] += psh.marginsall[1][1];
      //resize canvas
      outcanvas.width=usedsize[0];
      outcanvas.height=usedsize[1];
      //draw background
      ctx.fillStyle="white";
      ctx.fillRect(0,0,outcanvas.width,outcanvas.height);
      //draw trees
      for(mmi=0;mmi<matrices;mmi++){
        var m=mm[mmi];
        var levels = (transpose(m.s)[0]).max()+1;
        //draw root
        var text   = "r";
        ctx.fillStyle='black';
        ctx.font = String(psh.fontsize)+'px Segoe UI';
        textwidth  = ctx.measureText(text).width;
        textheight = psh.fontsize;
        ctx.fillText(text,rootx_pixel-textwidth/2,rooty_pixel[mmi]+textheight/2*0.7);
        //draw columns
        for(ci=0;ci<m.cols();ci++){
          var level  = m.s[ci][0];
          var cx     = rootx_pixel     +(ci   +1)*psh.colshift;
          var cy     = rooty_pixel[mmi]-(level+1)*psh.levelshift;
          
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
          var pi      = m.findParent(ci);     // parent
          var px     = rootx_pixel+(pi      +1)*psh.colshift;
          var py;
          if(pi>=0){
              py     = rooty_pixel[mmi]-(m.s[pi][0]+1)*psh.levelshift;
          }else{//branch for root
              py     = rooty_pixel[mmi];
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
          text   = String(m.s[ci][1]);
          if(text==="undefined") text="";
          ctx.fillStyle='black';
          ctx.font = String(psh.fontsize)+'px Segoe UI';
          textwidth  = ctx.measureText(text).width;
          textheight = psh.fontsize;
          ctx.fillText(text,cx-textwidth/2,cy+textheight/2*0.7);          
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
