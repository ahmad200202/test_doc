!function(mod){"object"==typeof exports&&"object"==typeof module?mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],mod):mod(CodeMirror)}(function(CodeMirror){"use strict";function drawRulers(cm){cm.state.rulerDiv.textContent="";var val=cm.getOption("rulers"),cw=cm.defaultCharWidth(),left=cm.charCoords(CodeMirror.Pos(cm.firstLine(),0),"div").left;cm.state.rulerDiv.style.minHeight=cm.display.scroller.offsetHeight+30+"px";for(var i=0;i<val.length;i++){var elt=document.createElement("div");elt.className="CodeMirror-ruler";var col,conf=val[i];"number"==typeof conf?col=conf:(col=conf.column,conf.className&&(elt.className+=" "+conf.className),conf.color&&(elt.style.borderColor=conf.color),conf.lineStyle&&(elt.style.borderLeftStyle=conf.lineStyle),conf.width&&(elt.style.borderLeftWidth=conf.width)),elt.style.left=left+col*cw+"px",cm.state.rulerDiv.appendChild(elt)}}CodeMirror.defineOption("rulers",!1,function(cm,val){cm.state.rulerDiv&&(cm.state.rulerDiv.parentElement.removeChild(cm.state.rulerDiv),cm.state.rulerDiv=null,cm.off("refresh",drawRulers)),val&&val.length&&(cm.state.rulerDiv=cm.display.lineSpace.parentElement.insertBefore(document.createElement("div"),cm.display.lineSpace),cm.state.rulerDiv.className="CodeMirror-rulers",drawRulers(cm),cm.on("refresh",drawRulers))})});