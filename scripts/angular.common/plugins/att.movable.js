!function($){$.fn.movable=function(options){function mousemove(event){y=event.pageY-startY,x=event.pageX-startX;var containerOffset,width=$el.width(),height=$el.height(),containerHeight=0,containerWidth=0;"window"==settings.containerElemSelector?(containerOffset={left:0,top:0},containerHeight=containerElem[0].innerHeigh,containerWidth=containerElem[0].innerWidth):(containerHeight=containerElem[0].offsetHeight,containerWidth=containerElem[0].offsetWidth,containerOffset=containerElem.position()),5>x&&(x=5),5>y&&(y=5),y+height>containerHeight-5&&(y=containerHeight-5-height),x+width>containerWidth-5&&(x=containerWidth-5-width),$el.css({position:"fixed",top:y+"px",left:x+"px","z-index":"1200"})}function mouseup(){$document.off("mousemove",mousemove),$document.off("mouseup",mouseup),attachElem.css("cursor","default")}var settings=$.extend({containerElemSelector:"window",attachElementSelector:null,openInCenter:!0},options),$el=$(this),$document=$(document),offset=$el.offset(),startX=0,startY=0,x=offset.left,y=offset.top;settings.openInCenter&&(x=($document.width()-$el.width())/2,y=($document.height()-$el.height())/2);var attachElem=$el;null!=settings.attachElementSelector&&(attachElem=$el.find(settings.attachElementSelector)),$el.css({position:"fixed","z-index":"1100",top:y+"px",left:x+"px"}),attachElem.on("mousedown",function(event){startX=event.pageX-x,startY=event.pageY-y,$document.on("mousemove",mousemove),$document.on("mouseup",mouseup),attachElem.css("cursor","move")});var containerElem=$(window);return null!=settings.containerElemSelector&&"window"!=settings.containerElemSelector&&(containerElem=$el.parents(settings.containerElemSelector)),$el}}(jQuery);