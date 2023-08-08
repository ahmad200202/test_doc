angular.module("ui.bootstrap.position",[]).factory("$uibPosition",["$document","$window",function($document,$window){var SCROLLBAR_WIDTH,BODY_SCROLLBAR_WIDTH,OVERFLOW_REGEX={normal:/(auto|scroll)/,hidden:/(auto|scroll|hidden)/},PLACEMENT_REGEX={auto:/\s?auto?\s?/i,primary:/^(top|bottom|left|right)$/,secondary:/^(top|bottom|left|right|center)$/,vertical:/^(top|bottom)$/},BODY_REGEX=/(HTML|BODY)/;return{getRawNode:function(elem){return elem.nodeName?elem:elem[0]||elem},parseStyle:function(value){return value=parseFloat(value),isFinite(value)?value:0},offsetParent:function(elem){function isStaticPositioned(el){return"static"===($window.getComputedStyle(el).position||"static")}elem=this.getRawNode(elem);for(var offsetParent=elem.offsetParent||$document[0].documentElement;offsetParent&&offsetParent!==$document[0].documentElement&&isStaticPositioned(offsetParent);)offsetParent=offsetParent.offsetParent;return offsetParent||$document[0].documentElement},scrollbarWidth:function(isBody){if(isBody){if(angular.isUndefined(BODY_SCROLLBAR_WIDTH)){var bodyElem=$document.find("body");bodyElem.addClass("uib-position-body-scrollbar-measure"),BODY_SCROLLBAR_WIDTH=$window.innerWidth-bodyElem[0].clientWidth,BODY_SCROLLBAR_WIDTH=isFinite(BODY_SCROLLBAR_WIDTH)?BODY_SCROLLBAR_WIDTH:0,bodyElem.removeClass("uib-position-body-scrollbar-measure")}return BODY_SCROLLBAR_WIDTH}if(angular.isUndefined(SCROLLBAR_WIDTH)){var scrollElem=angular.element('<div class="uib-position-scrollbar-measure"></div>');$document.find("body").append(scrollElem),SCROLLBAR_WIDTH=scrollElem[0].offsetWidth-scrollElem[0].clientWidth,SCROLLBAR_WIDTH=isFinite(SCROLLBAR_WIDTH)?SCROLLBAR_WIDTH:0,scrollElem.remove()}return SCROLLBAR_WIDTH},scrollbarPadding:function(elem){elem=this.getRawNode(elem);var elemStyle=$window.getComputedStyle(elem),paddingRight=this.parseStyle(elemStyle.paddingRight),paddingBottom=this.parseStyle(elemStyle.paddingBottom),scrollParent=this.scrollParent(elem,!1,!0),scrollbarWidth=this.scrollbarWidth(BODY_REGEX.test(scrollParent.tagName));return{scrollbarWidth:scrollbarWidth,widthOverflow:scrollParent.scrollWidth>scrollParent.clientWidth,right:paddingRight+scrollbarWidth,originalRight:paddingRight,heightOverflow:scrollParent.scrollHeight>scrollParent.clientHeight,bottom:paddingBottom+scrollbarWidth,originalBottom:paddingBottom}},isScrollable:function(elem,includeHidden){elem=this.getRawNode(elem);var overflowRegex=includeHidden?OVERFLOW_REGEX.hidden:OVERFLOW_REGEX.normal,elemStyle=$window.getComputedStyle(elem);return overflowRegex.test(elemStyle.overflow+elemStyle.overflowY+elemStyle.overflowX)},scrollParent:function(elem,includeHidden,includeSelf){elem=this.getRawNode(elem);var overflowRegex=includeHidden?OVERFLOW_REGEX.hidden:OVERFLOW_REGEX.normal,documentEl=$document[0].documentElement,elemStyle=$window.getComputedStyle(elem);if(includeSelf&&overflowRegex.test(elemStyle.overflow+elemStyle.overflowY+elemStyle.overflowX))return elem;var excludeStatic="absolute"===elemStyle.position,scrollParent=elem.parentElement||documentEl;if(scrollParent===documentEl||"fixed"===elemStyle.position)return documentEl;for(;scrollParent.parentElement&&scrollParent!==documentEl;){var spStyle=$window.getComputedStyle(scrollParent);if(excludeStatic&&"static"!==spStyle.position&&(excludeStatic=!1),!excludeStatic&&overflowRegex.test(spStyle.overflow+spStyle.overflowY+spStyle.overflowX))break;scrollParent=scrollParent.parentElement}return scrollParent},position:function(elem,includeMagins){elem=this.getRawNode(elem);var elemOffset=this.offset(elem);if(includeMagins){var elemStyle=$window.getComputedStyle(elem);elemOffset.top-=this.parseStyle(elemStyle.marginTop),elemOffset.left-=this.parseStyle(elemStyle.marginLeft)}var parent=this.offsetParent(elem),parentOffset={top:0,left:0};return parent!==$document[0].documentElement&&(parentOffset=this.offset(parent),parentOffset.top+=parent.clientTop-parent.scrollTop,parentOffset.left+=parent.clientLeft-parent.scrollLeft),{width:Math.round(angular.isNumber(elemOffset.width)?elemOffset.width:elem.offsetWidth),height:Math.round(angular.isNumber(elemOffset.height)?elemOffset.height:elem.offsetHeight),top:Math.round(elemOffset.top-parentOffset.top),left:Math.round(elemOffset.left-parentOffset.left)}},offset:function(elem){elem=this.getRawNode(elem);var elemBCR=elem.getBoundingClientRect();return{width:Math.round(angular.isNumber(elemBCR.width)?elemBCR.width:elem.offsetWidth),height:Math.round(angular.isNumber(elemBCR.height)?elemBCR.height:elem.offsetHeight),top:Math.round(elemBCR.top+($window.pageYOffset||$document[0].documentElement.scrollTop)),left:Math.round(elemBCR.left+($window.pageXOffset||$document[0].documentElement.scrollLeft))}},viewportOffset:function(elem,useDocument,includePadding){elem=this.getRawNode(elem),includePadding=includePadding!==!1?!0:!1;var elemBCR=elem.getBoundingClientRect(),offsetBCR={top:0,left:0,bottom:0,right:0},offsetParent=useDocument?$document[0].documentElement:this.scrollParent(elem),offsetParentBCR=offsetParent.getBoundingClientRect();if(offsetBCR.top=offsetParentBCR.top+offsetParent.clientTop,offsetBCR.left=offsetParentBCR.left+offsetParent.clientLeft,offsetParent===$document[0].documentElement&&(offsetBCR.top+=$window.pageYOffset,offsetBCR.left+=$window.pageXOffset),offsetBCR.bottom=offsetBCR.top+offsetParent.clientHeight,offsetBCR.right=offsetBCR.left+offsetParent.clientWidth,includePadding){var offsetParentStyle=$window.getComputedStyle(offsetParent);offsetBCR.top+=this.parseStyle(offsetParentStyle.paddingTop),offsetBCR.bottom-=this.parseStyle(offsetParentStyle.paddingBottom),offsetBCR.left+=this.parseStyle(offsetParentStyle.paddingLeft),offsetBCR.right-=this.parseStyle(offsetParentStyle.paddingRight)}return{top:Math.round(elemBCR.top-offsetBCR.top),bottom:Math.round(offsetBCR.bottom-elemBCR.bottom),left:Math.round(elemBCR.left-offsetBCR.left),right:Math.round(offsetBCR.right-elemBCR.right)}},parsePlacement:function(placement){var autoPlace=PLACEMENT_REGEX.auto.test(placement);return autoPlace&&(placement=placement.replace(PLACEMENT_REGEX.auto,"")),placement=placement.split("-"),placement[0]=placement[0]||"top",PLACEMENT_REGEX.primary.test(placement[0])||(placement[0]="top"),placement[1]=placement[1]||"center",PLACEMENT_REGEX.secondary.test(placement[1])||(placement[1]="center"),placement[2]=autoPlace?!0:!1,placement},positionElements:function(hostElem,targetElem,placement,appendToBody){hostElem=this.getRawNode(hostElem),targetElem=this.getRawNode(targetElem);var targetWidth=angular.isDefined(targetElem.offsetWidth)?targetElem.offsetWidth:targetElem.prop("offsetWidth"),targetHeight=angular.isDefined(targetElem.offsetHeight)?targetElem.offsetHeight:targetElem.prop("offsetHeight");placement=this.parsePlacement(placement);var hostElemPos=appendToBody?this.offset(hostElem):this.position(hostElem),targetElemPos={top:0,left:0,placement:""};if(placement[2]){var viewportOffset=this.viewportOffset(hostElem,appendToBody),targetElemStyle=$window.getComputedStyle(targetElem),adjustedSize={width:targetWidth+Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft)+this.parseStyle(targetElemStyle.marginRight))),height:targetHeight+Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop)+this.parseStyle(targetElemStyle.marginBottom)))};if(placement[0]="top"===placement[0]&&adjustedSize.height>viewportOffset.top&&adjustedSize.height<=viewportOffset.bottom?"bottom":"bottom"===placement[0]&&adjustedSize.height>viewportOffset.bottom&&adjustedSize.height<=viewportOffset.top?"top":"left"===placement[0]&&adjustedSize.width>viewportOffset.left&&adjustedSize.width<=viewportOffset.right?"right":"right"===placement[0]&&adjustedSize.width>viewportOffset.right&&adjustedSize.width<=viewportOffset.left?"left":placement[0],placement[1]="top"===placement[1]&&adjustedSize.height-hostElemPos.height>viewportOffset.bottom&&adjustedSize.height-hostElemPos.height<=viewportOffset.top?"bottom":"bottom"===placement[1]&&adjustedSize.height-hostElemPos.height>viewportOffset.top&&adjustedSize.height-hostElemPos.height<=viewportOffset.bottom?"top":"left"===placement[1]&&adjustedSize.width-hostElemPos.width>viewportOffset.right&&adjustedSize.width-hostElemPos.width<=viewportOffset.left?"right":"right"===placement[1]&&adjustedSize.width-hostElemPos.width>viewportOffset.left&&adjustedSize.width-hostElemPos.width<=viewportOffset.right?"left":placement[1],"center"===placement[1])if(PLACEMENT_REGEX.vertical.test(placement[0])){var xOverflow=hostElemPos.width/2-targetWidth/2;viewportOffset.left+xOverflow<0&&adjustedSize.width-hostElemPos.width<=viewportOffset.right?placement[1]="left":viewportOffset.right+xOverflow<0&&adjustedSize.width-hostElemPos.width<=viewportOffset.left&&(placement[1]="right")}else{var yOverflow=hostElemPos.height/2-adjustedSize.height/2;viewportOffset.top+yOverflow<0&&adjustedSize.height-hostElemPos.height<=viewportOffset.bottom?placement[1]="top":viewportOffset.bottom+yOverflow<0&&adjustedSize.height-hostElemPos.height<=viewportOffset.top&&(placement[1]="bottom")}}switch(placement[0]){case"top":targetElemPos.top=hostElemPos.top-targetHeight;break;case"bottom":targetElemPos.top=hostElemPos.top+hostElemPos.height;break;case"left":targetElemPos.left=hostElemPos.left-targetWidth;break;case"right":targetElemPos.left=hostElemPos.left+hostElemPos.width}switch(placement[1]){case"top":targetElemPos.top=hostElemPos.top;break;case"bottom":targetElemPos.top=hostElemPos.top+hostElemPos.height-targetHeight;break;case"left":targetElemPos.left=hostElemPos.left;break;case"right":targetElemPos.left=hostElemPos.left+hostElemPos.width-targetWidth;break;case"center":PLACEMENT_REGEX.vertical.test(placement[0])?targetElemPos.left=hostElemPos.left+hostElemPos.width/2-targetWidth/2:targetElemPos.top=hostElemPos.top+hostElemPos.height/2-targetHeight/2}return targetElemPos.top=Math.round(targetElemPos.top),targetElemPos.left=Math.round(targetElemPos.left),targetElemPos.placement="center"===placement[1]?placement[0]:placement[0]+"-"+placement[1],targetElemPos},adjustTop:function(placementClasses,containerPosition,initialHeight,currentHeight){return-1!==placementClasses.indexOf("top")&&initialHeight!==currentHeight?{top:containerPosition.top-currentHeight+"px"}:void 0},positionArrow:function(elem,placement){elem=this.getRawNode(elem);var innerElem=elem.querySelector(".tooltip-inner, .popover-inner");if(innerElem){var isTooltip=angular.element(innerElem).hasClass("tooltip-inner"),arrowElem=elem.querySelector(isTooltip?".tooltip-arrow":".arrow");if(arrowElem){var arrowCss={top:"",bottom:"",left:"",right:""};if(placement=this.parsePlacement(placement),"center"===placement[1])return void angular.element(arrowElem).css(arrowCss);var borderProp="border-"+placement[0]+"-width",borderWidth=$window.getComputedStyle(arrowElem)[borderProp],borderRadiusProp="border-";borderRadiusProp+=PLACEMENT_REGEX.vertical.test(placement[0])?placement[0]+"-"+placement[1]:placement[1]+"-"+placement[0],borderRadiusProp+="-radius";var borderRadius=$window.getComputedStyle(isTooltip?innerElem:elem)[borderRadiusProp];switch(placement[0]){case"top":arrowCss.bottom=isTooltip?"0":"-"+borderWidth;break;case"bottom":arrowCss.top=isTooltip?"0":"-"+borderWidth;break;case"left":arrowCss.right=isTooltip?"0":"-"+borderWidth;break;case"right":arrowCss.left=isTooltip?"0":"-"+borderWidth}arrowCss[placement[1]]=borderRadius,angular.element(arrowElem).css(arrowCss)}}}}}]);