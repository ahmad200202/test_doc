define(["./core","./core/isAttached","./var/flat","./var/isFunction","./var/push","./var/rcheckableType","./core/access","./manipulation/var/rtagName","./manipulation/var/rscriptType","./manipulation/wrapMap","./manipulation/getAll","./manipulation/setGlobalEval","./manipulation/buildFragment","./manipulation/support","./data/var/dataPriv","./data/var/dataUser","./data/var/acceptData","./core/DOMEval","./core/nodeName","./core/init","./traversing","./selector","./event"],function(jQuery,isAttached,flat,isFunction,push,rcheckableType,access,rtagName,rscriptType,wrapMap,getAll,setGlobalEval,buildFragment,support,dataPriv,dataUser,acceptData,DOMEval,nodeName){"use strict";function manipulationTarget(elem,content){return nodeName(elem,"table")&&nodeName(11!==content.nodeType?content:content.firstChild,"tr")?jQuery(elem).children("tbody")[0]||elem:elem}function disableScript(elem){return elem.type=(null!==elem.getAttribute("type"))+"/"+elem.type,elem}function restoreScript(elem){return"true/"===(elem.type||"").slice(0,5)?elem.type=elem.type.slice(5):elem.removeAttribute("type"),elem}function cloneCopyEvent(src,dest){var i,l,type,pdataOld,udataOld,udataCur,events;if(1===dest.nodeType){if(dataPriv.hasData(src)&&(pdataOld=dataPriv.get(src),events=pdataOld.events)){dataPriv.remove(dest,"handle events");for(type in events)for(i=0,l=events[type].length;l>i;i++)jQuery.event.add(dest,type,events[type][i])}dataUser.hasData(src)&&(udataOld=dataUser.access(src),udataCur=jQuery.extend({},udataOld),dataUser.set(dest,udataCur))}}function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase();"input"===nodeName&&rcheckableType.test(src.type)?dest.checked=src.checked:("input"===nodeName||"textarea"===nodeName)&&(dest.defaultValue=src.defaultValue)}function domManip(collection,args,callback,ignored){args=flat(args);var fragment,first,scripts,hasScripts,node,doc,i=0,l=collection.length,iNoClone=l-1,value=args[0],valueIsFunction=isFunction(value);if(valueIsFunction||l>1&&"string"==typeof value&&!support.checkClone&&rchecked.test(value))return collection.each(function(index){var self=collection.eq(index);valueIsFunction&&(args[0]=value.call(this,index,self.html())),domManip(self,args,callback,ignored)});if(l&&(fragment=buildFragment(args,collection[0].ownerDocument,!1,collection,ignored),first=fragment.firstChild,1===fragment.childNodes.length&&(fragment=first),first||ignored)){for(scripts=jQuery.map(getAll(fragment,"script"),disableScript),hasScripts=scripts.length;l>i;i++)node=fragment,i!==iNoClone&&(node=jQuery.clone(node,!0,!0),hasScripts&&jQuery.merge(scripts,getAll(node,"script"))),callback.call(collection[i],node,i);if(hasScripts)for(doc=scripts[scripts.length-1].ownerDocument,jQuery.map(scripts,restoreScript),i=0;hasScripts>i;i++)node=scripts[i],rscriptType.test(node.type||"")&&!dataPriv.access(node,"globalEval")&&jQuery.contains(doc,node)&&(node.src&&"module"!==(node.type||"").toLowerCase()?jQuery._evalUrl&&!node.noModule&&jQuery._evalUrl(node.src,{nonce:node.nonce||node.getAttribute("nonce")},doc):DOMEval(node.textContent.replace(rcleanScript,""),node,doc))}return collection}function remove(elem,selector,keepData){for(var node,nodes=selector?jQuery.filter(selector,elem):elem,i=0;null!=(node=nodes[i]);i++)keepData||1!==node.nodeType||jQuery.cleanData(getAll(node)),node.parentNode&&(keepData&&isAttached(node)&&setGlobalEval(getAll(node,"script")),node.parentNode.removeChild(node));return elem}var rnoInnerhtml=/<script|<style|<link/i,rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;return jQuery.extend({htmlPrefilter:function(html){return html},clone:function(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(!0),inPage=isAttached(elem);if(!(support.noCloneChecked||1!==elem.nodeType&&11!==elem.nodeType||jQuery.isXMLDoc(elem)))for(destElements=getAll(clone),srcElements=getAll(elem),i=0,l=srcElements.length;l>i;i++)fixInput(srcElements[i],destElements[i]);if(dataAndEvents)if(deepDataAndEvents)for(srcElements=srcElements||getAll(elem),destElements=destElements||getAll(clone),i=0,l=srcElements.length;l>i;i++)cloneCopyEvent(srcElements[i],destElements[i]);else cloneCopyEvent(elem,clone);return destElements=getAll(clone,"script"),destElements.length>0&&setGlobalEval(destElements,!inPage&&getAll(elem,"script")),clone},cleanData:function(elems){for(var data,elem,type,special=jQuery.event.special,i=0;void 0!==(elem=elems[i]);i++)if(acceptData(elem)){if(data=elem[dataPriv.expando]){if(data.events)for(type in data.events)special[type]?jQuery.event.remove(elem,type):jQuery.removeEvent(elem,type,data.handle);elem[dataPriv.expando]=void 0}elem[dataUser.expando]&&(elem[dataUser.expando]=void 0)}}}),jQuery.fn.extend({detach:function(selector){return remove(this,selector,!0)},remove:function(selector){return remove(this,selector)},text:function(value){return access(this,function(value){return void 0===value?jQuery.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=value)})},null,value,arguments.length)},append:function(){return domManip(this,arguments,function(elem){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var target=manipulationTarget(this,elem);target.appendChild(elem)}})},prepend:function(){return domManip(this,arguments,function(elem){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild)}})},before:function(){return domManip(this,arguments,function(elem){this.parentNode&&this.parentNode.insertBefore(elem,this)})},after:function(){return domManip(this,arguments,function(elem){this.parentNode&&this.parentNode.insertBefore(elem,this.nextSibling)})},empty:function(){for(var elem,i=0;null!=(elem=this[i]);i++)1===elem.nodeType&&(jQuery.cleanData(getAll(elem,!1)),elem.textContent="");return this},clone:function(dataAndEvents,deepDataAndEvents){return dataAndEvents=null==dataAndEvents?!1:dataAndEvents,deepDataAndEvents=null==deepDataAndEvents?dataAndEvents:deepDataAndEvents,this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents)})},html:function(value){return access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(void 0===value&&1===elem.nodeType)return elem.innerHTML;if("string"==typeof value&&!rnoInnerhtml.test(value)&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=jQuery.htmlPrefilter(value);try{for(;l>i;i++)elem=this[i]||{},1===elem.nodeType&&(jQuery.cleanData(getAll(elem,!1)),elem.innerHTML=value);elem=0}catch(e){}}elem&&this.empty().append(value)},null,value,arguments.length)},replaceWith:function(){var ignored=[];return domManip(this,arguments,function(elem){var parent=this.parentNode;jQuery.inArray(this,ignored)<0&&(jQuery.cleanData(getAll(this)),parent&&parent.replaceChild(elem,this))},ignored)}}),jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){for(var elems,ret=[],insert=jQuery(selector),last=insert.length-1,i=0;last>=i;i++)elems=i===last?this:this.clone(!0),jQuery(insert[i])[original](elems),push.apply(ret,elems.get());return this.pushStack(ret)}}),jQuery});