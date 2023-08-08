!function(factory){"function"==typeof define&&define.amd?define(["jquery","./button","./draggable","./mouse","./resizable","../focusable","../keycode","../position","../safe-active-element","../safe-blur","../tabbable","../unique-id","../version","../widget"],factory):factory(jQuery)}(function($){return $.widget("ui.dialog",{version:"1.12.1",options:{appendTo:"body",autoOpen:!0,buttons:[],classes:{"ui-dialog":"ui-corner-all","ui-dialog-titlebar":"ui-corner-all"},closeOnEscape:!0,closeText:"Close",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(pos){var topOffset=$(this).css(pos).offset().top;0>topOffset&&$(this).css("top",pos.top-topOffset)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},sizeRelatedOptions:{buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},resizableRelatedOptions:{maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),null==this.options.title&&null!=this.originalTitle&&(this.options.title=this.originalTitle),this.options.disabled&&(this.options.disabled=!1),this._createWrapper(),this.element.show().removeAttr("title").appendTo(this.uiDialog),this._addClass("ui-dialog-content","ui-widget-content"),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&$.fn.draggable&&this._makeDraggable(),this.options.resizable&&$.fn.resizable&&this._makeResizable(),this._isOpen=!1,this._trackFocus()},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var element=this.options.appendTo;return element&&(element.jquery||element.nodeType)?$(element):this.document.find(element||"body").eq(0)},_destroy:function(){var next,originalPosition=this.originalPosition;this._untrackInstance(),this._destroyOverlay(),this.element.removeUniqueId().css(this.originalCss).detach(),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),next=originalPosition.parent.children().eq(originalPosition.index),next.length&&next[0]!==this.element[0]?next.before(this.element):originalPosition.parent.append(this.element)},widget:function(){return this.uiDialog},disable:$.noop,enable:$.noop,close:function(event){var that=this;this._isOpen&&this._trigger("beforeClose",event)!==!1&&(this._isOpen=!1,this._focusedElement=null,this._destroyOverlay(),this._untrackInstance(),this.opener.filter(":focusable").trigger("focus").length||$.ui.safeBlur($.ui.safeActiveElement(this.document[0])),this._hide(this.uiDialog,this.options.hide,function(){that._trigger("close",event)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(event,silent){var moved=!1,zIndices=this.uiDialog.siblings(".ui-front:visible").map(function(){return+$(this).css("z-index")}).get(),zIndexMax=Math.max.apply(null,zIndices);return zIndexMax>=+this.uiDialog.css("z-index")&&(this.uiDialog.css("z-index",zIndexMax+1),moved=!0),moved&&!silent&&this._trigger("focus",event),moved},open:function(){var that=this;return this._isOpen?void(this._moveToTop()&&this._focusTabbable()):(this._isOpen=!0,this.opener=$($.ui.safeActiveElement(this.document[0])),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this.overlay&&this.overlay.css("z-index",this.uiDialog.css("z-index")-1),this._show(this.uiDialog,this.options.show,function(){that._focusTabbable(),that._trigger("focus")}),this._makeFocusTarget(),void this._trigger("open"))},_focusTabbable:function(){var hasFocus=this._focusedElement;hasFocus||(hasFocus=this.element.find("[autofocus]")),hasFocus.length||(hasFocus=this.element.find(":tabbable")),hasFocus.length||(hasFocus=this.uiDialogButtonPane.find(":tabbable")),hasFocus.length||(hasFocus=this.uiDialogTitlebarClose.filter(":tabbable")),hasFocus.length||(hasFocus=this.uiDialog),hasFocus.eq(0).trigger("focus")},_keepFocus:function(event){function checkFocus(){var activeElement=$.ui.safeActiveElement(this.document[0]),isActive=this.uiDialog[0]===activeElement||$.contains(this.uiDialog[0],activeElement);isActive||this._focusTabbable()}event.preventDefault(),checkFocus.call(this),this._delay(checkFocus)},_createWrapper:function(){this.uiDialog=$("<div>").hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._addClass(this.uiDialog,"ui-dialog","ui-widget ui-widget-content ui-front"),this._on(this.uiDialog,{keydown:function(event){if(this.options.closeOnEscape&&!event.isDefaultPrevented()&&event.keyCode&&event.keyCode===$.ui.keyCode.ESCAPE)return event.preventDefault(),void this.close(event);if(event.keyCode===$.ui.keyCode.TAB&&!event.isDefaultPrevented()){var tabbables=this.uiDialog.find(":tabbable"),first=tabbables.filter(":first"),last=tabbables.filter(":last");event.target!==last[0]&&event.target!==this.uiDialog[0]||event.shiftKey?event.target!==first[0]&&event.target!==this.uiDialog[0]||!event.shiftKey||(this._delay(function(){last.trigger("focus")}),event.preventDefault()):(this._delay(function(){first.trigger("focus")}),event.preventDefault())}},mousedown:function(event){this._moveToTop(event)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var uiDialogTitle;this.uiDialogTitlebar=$("<div>"),this._addClass(this.uiDialogTitlebar,"ui-dialog-titlebar","ui-widget-header ui-helper-clearfix"),this._on(this.uiDialogTitlebar,{mousedown:function(event){$(event.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.trigger("focus")}}),this.uiDialogTitlebarClose=$("<button type='button'></button>").button({label:$("<a>").text(this.options.closeText).html(),icon:"ui-icon-closethick",showLabel:!1}).appendTo(this.uiDialogTitlebar),this._addClass(this.uiDialogTitlebarClose,"ui-dialog-titlebar-close"),this._on(this.uiDialogTitlebarClose,{click:function(event){event.preventDefault(),this.close(event)}}),uiDialogTitle=$("<span>").uniqueId().prependTo(this.uiDialogTitlebar),this._addClass(uiDialogTitle,"ui-dialog-title"),this._title(uiDialogTitle),this.uiDialogTitlebar.prependTo(this.uiDialog),this.uiDialog.attr({"aria-labelledby":uiDialogTitle.attr("id")})},_title:function(title){this.options.title?title.text(this.options.title):title.html("&#160;")},_createButtonPane:function(){this.uiDialogButtonPane=$("<div>"),this._addClass(this.uiDialogButtonPane,"ui-dialog-buttonpane","ui-widget-content ui-helper-clearfix"),this.uiButtonSet=$("<div>").appendTo(this.uiDialogButtonPane),this._addClass(this.uiButtonSet,"ui-dialog-buttonset"),this._createButtons()},_createButtons:function(){var that=this,buttons=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),$.isEmptyObject(buttons)||$.isArray(buttons)&&!buttons.length?void this._removeClass(this.uiDialog,"ui-dialog-buttons"):($.each(buttons,function(name,props){var click,buttonOptions;props=$.isFunction(props)?{click:props,text:name}:props,props=$.extend({type:"button"},props),click=props.click,buttonOptions={icon:props.icon,iconPosition:props.iconPosition,showLabel:props.showLabel,icons:props.icons,text:props.text},delete props.click,delete props.icon,delete props.iconPosition,delete props.showLabel,delete props.icons,"boolean"==typeof props.text&&delete props.text,$("<button></button>",props).button(buttonOptions).appendTo(that.uiButtonSet).on("click",function(){click.apply(that.element[0],arguments)})}),this._addClass(this.uiDialog,"ui-dialog-buttons"),void this.uiDialogButtonPane.appendTo(this.uiDialog))},_makeDraggable:function(){function filteredUi(ui){return{position:ui.position,offset:ui.offset}}var that=this,options=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(event,ui){that._addClass($(this),"ui-dialog-dragging"),that._blockFrames(),that._trigger("dragStart",event,filteredUi(ui))},drag:function(event,ui){that._trigger("drag",event,filteredUi(ui))},stop:function(event,ui){var left=ui.offset.left-that.document.scrollLeft(),top=ui.offset.top-that.document.scrollTop();options.position={my:"left top",at:"left"+(left>=0?"+":"")+left+" top"+(top>=0?"+":"")+top,of:that.window},that._removeClass($(this),"ui-dialog-dragging"),that._unblockFrames(),that._trigger("dragStop",event,filteredUi(ui))}})},_makeResizable:function(){function filteredUi(ui){return{originalPosition:ui.originalPosition,originalSize:ui.originalSize,position:ui.position,size:ui.size}}var that=this,options=this.options,handles=options.resizable,position=this.uiDialog.css("position"),resizeHandles="string"==typeof handles?handles:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:options.maxWidth,maxHeight:options.maxHeight,minWidth:options.minWidth,minHeight:this._minHeight(),handles:resizeHandles,start:function(event,ui){that._addClass($(this),"ui-dialog-resizing"),that._blockFrames(),that._trigger("resizeStart",event,filteredUi(ui))},resize:function(event,ui){that._trigger("resize",event,filteredUi(ui))},stop:function(event,ui){var offset=that.uiDialog.offset(),left=offset.left-that.document.scrollLeft(),top=offset.top-that.document.scrollTop();options.height=that.uiDialog.height(),options.width=that.uiDialog.width(),options.position={my:"left top",at:"left"+(left>=0?"+":"")+left+" top"+(top>=0?"+":"")+top,of:that.window},that._removeClass($(this),"ui-dialog-resizing"),that._unblockFrames(),that._trigger("resizeStop",event,filteredUi(ui))}}).css("position",position)},_trackFocus:function(){this._on(this.widget(),{focusin:function(event){this._makeFocusTarget(),this._focusedElement=$(event.target)}})},_makeFocusTarget:function(){this._untrackInstance(),this._trackingInstances().unshift(this)},_untrackInstance:function(){var instances=this._trackingInstances(),exists=$.inArray(this,instances);-1!==exists&&instances.splice(exists,1)},_trackingInstances:function(){var instances=this.document.data("ui-dialog-instances");return instances||(instances=[],this.document.data("ui-dialog-instances",instances)),instances},_minHeight:function(){var options=this.options;return"auto"===options.height?options.minHeight:Math.min(options.minHeight,options.height)},_position:function(){var isVisible=this.uiDialog.is(":visible");isVisible||this.uiDialog.show(),this.uiDialog.position(this.options.position),isVisible||this.uiDialog.hide()},_setOptions:function(options){var that=this,resize=!1,resizableOptions={};$.each(options,function(key,value){that._setOption(key,value),key in that.sizeRelatedOptions&&(resize=!0),key in that.resizableRelatedOptions&&(resizableOptions[key]=value)}),resize&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",resizableOptions)},_setOption:function(key,value){var isDraggable,isResizable,uiDialog=this.uiDialog;"disabled"!==key&&(this._super(key,value),"appendTo"===key&&this.uiDialog.appendTo(this._appendTo()),"buttons"===key&&this._createButtons(),"closeText"===key&&this.uiDialogTitlebarClose.button({label:$("<a>").text(""+this.options.closeText).html()}),"draggable"===key&&(isDraggable=uiDialog.is(":data(ui-draggable)"),isDraggable&&!value&&uiDialog.draggable("destroy"),!isDraggable&&value&&this._makeDraggable()),"position"===key&&this._position(),"resizable"===key&&(isResizable=uiDialog.is(":data(ui-resizable)"),isResizable&&!value&&uiDialog.resizable("destroy"),isResizable&&"string"==typeof value&&uiDialog.resizable("option","handles",value),isResizable||value===!1||this._makeResizable()),"title"===key&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var nonContentHeight,minContentHeight,maxContentHeight,options=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),options.minWidth>options.width&&(options.width=options.minWidth),nonContentHeight=this.uiDialog.css({height:"auto",width:options.width}).outerHeight(),minContentHeight=Math.max(0,options.minHeight-nonContentHeight),maxContentHeight="number"==typeof options.maxHeight?Math.max(0,options.maxHeight-nonContentHeight):"none","auto"===options.height?this.element.css({minHeight:minContentHeight,maxHeight:maxContentHeight,height:"auto"}):this.element.height(Math.max(0,options.height-nonContentHeight)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var iframe=$(this);return $("<div>").css({position:"absolute",width:iframe.outerWidth(),height:iframe.outerHeight()}).appendTo(iframe.parent()).offset(iframe.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(event){return $(event.target).closest(".ui-dialog").length?!0:!!$(event.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var isOpening=!0;this._delay(function(){isOpening=!1}),this.document.data("ui-dialog-overlays")||this._on(this.document,{focusin:function(event){isOpening||this._allowInteraction(event)||(event.preventDefault(),this._trackingInstances()[0]._focusTabbable())}}),this.overlay=$("<div>").appendTo(this._appendTo()),this._addClass(this.overlay,null,"ui-widget-overlay ui-front"),this._on(this.overlay,{mousedown:"_keepFocus"}),this.document.data("ui-dialog-overlays",(this.document.data("ui-dialog-overlays")||0)+1)}},_destroyOverlay:function(){if(this.options.modal&&this.overlay){var overlays=this.document.data("ui-dialog-overlays")-1;overlays?this.document.data("ui-dialog-overlays",overlays):(this._off(this.document,"focusin"),this.document.removeData("ui-dialog-overlays")),this.overlay.remove(),this.overlay=null}}}),$.uiBackCompat!==!1&&$.widget("ui.dialog",$.ui.dialog,{options:{dialogClass:""},_createWrapper:function(){this._super(),this.uiDialog.addClass(this.options.dialogClass)},_setOption:function(key,value){"dialogClass"===key&&this.uiDialog.removeClass(this.options.dialogClass).addClass(value),this._superApply(arguments)}}),$.ui.dialog});