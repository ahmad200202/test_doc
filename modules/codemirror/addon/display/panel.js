!function(mod){"object"==typeof exports&&"object"==typeof module?mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],mod):mod(CodeMirror)}(function(CodeMirror){function Panel(cm,node,options,height){this.cm=cm,this.node=node,this.options=options,this.height=height,this.cleared=!1}function initPanels(cm){var wrap=cm.getWrapperElement(),style=window.getComputedStyle?window.getComputedStyle(wrap):wrap.currentStyle,height=parseInt(style.height),info=cm.state.panels={setHeight:wrap.style.height,panels:[],wrapper:document.createElement("div")},hasFocus=cm.hasFocus(),scrollPos=cm.getScrollInfo();wrap.parentNode.insertBefore(info.wrapper,wrap),info.wrapper.appendChild(wrap),cm.scrollTo(scrollPos.left,scrollPos.top),hasFocus&&cm.focus(),cm._setSize=cm.setSize,null!=height&&(cm.setSize=function(width,newHeight){if(newHeight||(newHeight=info.wrapper.offsetHeight),info.setHeight=newHeight,"number"!=typeof newHeight){var px=/^(\d+\.?\d*)px$/.exec(newHeight);px?newHeight=Number(px[1]):(info.wrapper.style.height=newHeight,newHeight=info.wrapper.offsetHeight)}var editorheight=newHeight-info.panels.map(function(p){return p.node.getBoundingClientRect().height}).reduce(function(a,b){return a+b},0);cm._setSize(width,editorheight),height=newHeight})}function removePanels(cm){var info=cm.state.panels;cm.state.panels=null;var wrap=cm.getWrapperElement(),hasFocus=cm.hasFocus(),scrollPos=cm.getScrollInfo();info.wrapper.parentNode.replaceChild(wrap,info.wrapper),cm.scrollTo(scrollPos.left,scrollPos.top),hasFocus&&cm.focus(),wrap.style.height=info.setHeight,cm.setSize=cm._setSize,cm.setSize()}function isAtTop(cm,dom){for(var sibling=dom.nextSibling;sibling;sibling=sibling.nextSibling)if(sibling==cm.getWrapperElement())return!0;return!1}CodeMirror.defineExtension("addPanel",function(node,options){options=options||{},this.state.panels||initPanels(this);var info=this.state.panels,wrapper=info.wrapper,cmWrapper=this.getWrapperElement(),replace=options.replace instanceof Panel&&!options.replace.cleared;options.after instanceof Panel&&!options.after.cleared?wrapper.insertBefore(node,options.before.node.nextSibling):options.before instanceof Panel&&!options.before.cleared?wrapper.insertBefore(node,options.before.node):replace?(wrapper.insertBefore(node,options.replace.node),options.replace.clear(!0)):"bottom"==options.position?wrapper.appendChild(node):"before-bottom"==options.position?wrapper.insertBefore(node,cmWrapper.nextSibling):"after-top"==options.position?wrapper.insertBefore(node,cmWrapper):wrapper.insertBefore(node,wrapper.firstChild);var height=options&&options.height||node.offsetHeight,panel=new Panel(this,node,options,height);return info.panels.push(panel),this.setSize(),options.stable&&isAtTop(this,node)&&this.scrollTo(null,this.getScrollInfo().top+height),panel}),Panel.prototype.clear=function(skipRemove){if(!this.cleared){this.cleared=!0;var info=this.cm.state.panels;info.panels.splice(info.panels.indexOf(this),1),this.cm.setSize(),this.options.stable&&isAtTop(this.cm,this.node)&&this.cm.scrollTo(null,this.cm.getScrollInfo().top-this.height),info.wrapper.removeChild(this.node),0!=info.panels.length||skipRemove||removePanels(this.cm)}},Panel.prototype.changed=function(){this.height=this.node.getBoundingClientRect().height,this.cm.setSize()}});