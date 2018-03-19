var ctx     = outcanvas.getContext('2d');
var items;
var allsum;
var allmax;
var allmin;
var dothemall=function(){
  //parse
  var w=parseInt(width.value);
  var h=parseInt(height.value);
  var ak=parseText(intext.value);
  allsum = ak[1].sum();
  allmax = ak[1].max();
  allmin = ak[1].min();
  //make tree
  var t=makeTree(ak[0],ak[1],0,0,w,h,ak[1].sum());
//  debug.value=t.toString();
  // draw
  outcanvas.width =width .value;
  outcanvas.height=height.value;
  drawTree(t);
  outImg();
};

/*---------------------------
  input:
    str = input string:
      title, amount, color\n
      title, amount, color\n
      title, amount, color\n
      title, amount, color\n
      ...
  output:
    a[l] = [title, amount, color, index]
    k[l] = amount
---------------------------*/
var parseText=function(str){
  var a=[];
  var k=[];
  var indata=str.split("\n");
  for(var l=0;l<indata.length;l++){
    var row=indata[l].split(",");
    if(row.length==3){
      a.push([
        row[0].trim(),
        parseFloat(row[1]),
        row[2].trim()]);
      k.push(parseFloat(row[1]));
    }else if(row.length==2){
      //without color
      a.push([
        row[0].trim(),
        parseFloat(row[1]),
        '']);
      k.push(parseFloat(row[1]));
    }
  }
  items = a.length;
  if(howtosort[1].checked){
    var idx=k.sorti();
    var a0=a.clone();
    var k0=k.clone();
    for(var l=0;l<a.length;l++){
      a[l]=a0[idx[l]];
      k[l]=k0[idx[l]];
    }
  }
  for(var l=0;l<a.length;l++){
    a[l].push(l);
  }
  return [a,k];
}

/*---------------------------
  input:
    a[l] = [title, amount, color, index]
    k[l] = amount
    x0,y0 = start position
    wx,wy = width and height
    allsum = all sum of amounts
  output:
    tree[]:
     tree.length == 2 then tree[0] and tree[1] are childlen
     tree.length == 5 then tree = [a,x0,y0,wx,wy]
       a = [title, amount, color, index]
       x0,y0 = start position
       wx,wy = width and height
---------------------------*/
var makeTree=function(a,k,x0,y0,wx,wy){
  if(a.length!=1){
    var half = k.sum()/2;
    var sum = k[0];
    var distmin  = Math.abs(sum-half);
    var distmini = 1; //border is between distmini-1 and distmini
    for(var l=1;l<k.length;l++){
      var distnow = Math.abs(sum-half);
      if(distnow<distmin){
        distmin =distnow;
        distmini=l;
      }
      sum+=k[l];
    }
    var k0=k.slice(0,distmini);
    var k1=k.slice(distmini);
    var a0=a.slice(0,distmini);
    var a1=a.slice(distmini);
    if(wx>wy){ //x is longer
      var wx0=wx*k0.sum()/k.sum();
      var wx1=wx*k1.sum()/k.sum();
      return [
        makeTree(a0,k0,x0    ,y0,wx0,wy),
        makeTree(a1,k1,x0+wx0,y0,wx1,wy)
      ];
    }else{
      var wy0=wy*k0.sum()/k.sum();
      var wy1=wy*k1.sum()/k.sum();
      return [
        makeTree(a0,k0,x0,y0    ,wx,wy0),
        makeTree(a1,k1,x0,y0+wy0,wx,wy1)
      ];
    }
  }else{
      return [a[0],x0,y0,wx,wy];
  }
}

var drawTree=function(t){
  if(t.length==2){
    drawTree(t[0]);
    drawTree(t[1]);
  }else{
    var text   = t[0][0];
    var key    = t[0][1];
    var color  = t[0][2];
    var idx    = t[0][3];
    ctx.font = '20px Segoe UI';
    textwidth  = ctx.measureText(text).width;
    textheight = textwidth/text.length*2;
    ctx.font = [t[3]/textwidth, t[4]/textwidth].min()*20*0.7
      +'px Segoe UI';
    textwidth = ctx.measureText(text).width;
    textheight = textwidth/text.length*2;
    ctx.strokeStyle='black';
    if(color!=''){
      //manual color
      ctx.fillStyle=color;
    }else{
      //auto color
      var r=idx/items;
      var g=1-r;
      ctx.fillStyle='rgb('+Math.floor(r*128+128)+','+Math.floor(g*256)+',0)';
    }
    ctx.fillRect(t[1],t[2],t[3],t[4]);
    ctx.strokeRect(t[1],t[2],t[3],t[4]);
    ctx.fillStyle='black';
    if(caption[0].checked){
      ctx.fillText(text,t[1]+t[3]/2-textwidth/2,t[2]+t[4]/2-textheight/2,t[3]);
      ctx.fillText(key ,t[1]+t[3]/2-textwidth/2,t[2]+t[4]/2+textheight/2,t[3]);
    }else if(caption[1].checked){
      ctx.fillText(text,t[1]+t[3]/2-textwidth/2,t[2]+t[4]/2-textheight/2,t[3]);
      ctx.fillText(Math.floor(key*1000/allsum)/10+'%'
                       ,t[1]+t[3]/2-textwidth/2,t[2]+t[4]/2+textheight/2,t[3]);
    }else{
      ctx.fillText(text,t[1]+t[3]/2-textwidth/2,t[2]+t[4]/2,t[3]);
    }
  }
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
