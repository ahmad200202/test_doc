!function(factory){"function"==typeof define&&define.amd?define(["jquery","./mouse","../version","../widget"],factory):factory(jQuery)}(function($){return $.widget("ui.selectable",$.ui.mouse,{version:"1.12.1",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var that=this;this._addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){that.elementPos=$(that.element[0]).offset(),that.selectees=$(that.options.filter,that.element[0]),that._addClass(that.selectees,"ui-selectee"),that.selectees.each(function(){var $this=$(this),selecteeOffset=$this.offset(),pos={left:selecteeOffset.left-that.elementPos.left,top:selecteeOffset.top-that.elementPos.top};$.data(this,"selectable-item",{element:this,$element:$this,left:pos.left,top:pos.top,right:pos.left+$this.outerWidth(),bottom:pos.top+$this.outerHeight(),startselected:!1,selected:$this.hasClass("ui-selected"),selecting:$this.hasClass("ui-selecting"),unselecting:$this.hasClass("ui-unselecting")})})},this.refresh(),this._mouseInit(),this.helper=$("<div>"),this._addClass(this.helper,"ui-selectable-helper")},_destroy:function(){this.selectees.removeData("selectable-item"),this._mouseDestroy()},_mouseStart:function(event){var that=this,options=this.options;this.opos=[event.pageX,event.pageY],this.elementPos=$(this.element[0]).offset(),this.options.disabled||(this.selectees=$(options.filter,this.element[0]),this._trigger("start",event),$(options.appendTo).append(this.helper),this.helper.css({left:event.pageX,top:event.pageY,width:0,height:0}),options.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var selectee=$.data(this,"selectable-item");selectee.startselected=!0,event.metaKey||event.ctrlKey||(that._removeClass(selectee.$element,"ui-selected"),selectee.selected=!1,that._addClass(selectee.$element,"ui-unselecting"),selectee.unselecting=!0,that._trigger("unselecting",event,{unselecting:selectee.element}))}),$(event.target).parents().addBack().each(function(){var doSelect,selectee=$.data(this,"selectable-item");return selectee?(doSelect=!event.metaKey&&!event.ctrlKey||!selectee.$element.hasClass("ui-selected"),that._removeClass(selectee.$element,doSelect?"ui-unselecting":"ui-selected")._addClass(selectee.$element,doSelect?"ui-selecting":"ui-unselecting"),selectee.unselecting=!doSelect,selectee.selecting=doSelect,selectee.selected=doSelect,doSelect?that._trigger("selecting",event,{selecting:selectee.element}):that._trigger("unselecting",event,{unselecting:selectee.element}),!1):void 0}))},_mouseDrag:function(event){if(this.dragged=!0,!this.options.disabled){var tmp,that=this,options=this.options,x1=this.opos[0],y1=this.opos[1],x2=event.pageX,y2=event.pageY;return x1>x2&&(tmp=x2,x2=x1,x1=tmp),y1>y2&&(tmp=y2,y2=y1,y1=tmp),this.helper.css({left:x1,top:y1,width:x2-x1,height:y2-y1}),this.selectees.each(function(){var selectee=$.data(this,"selectable-item"),hit=!1,offset={};selectee&&selectee.element!==that.element[0]&&(offset.left=selectee.left+that.elementPos.left,offset.right=selectee.right+that.elementPos.left,offset.top=selectee.top+that.elementPos.top,offset.bottom=selectee.bottom+that.elementPos.top,"touch"===options.tolerance?hit=!(offset.left>x2||offset.right<x1||offset.top>y2||offset.bottom<y1):"fit"===options.tolerance&&(hit=offset.left>x1&&offset.right<x2&&offset.top>y1&&offset.bottom<y2),hit?(selectee.selected&&(that._removeClass(selectee.$element,"ui-selected"),selectee.selected=!1),selectee.unselecting&&(that._removeClass(selectee.$element,"ui-unselecting"),selectee.unselecting=!1),selectee.selecting||(that._addClass(selectee.$element,"ui-selecting"),selectee.selecting=!0,that._trigger("selecting",event,{selecting:selectee.element}))):(selectee.selecting&&((event.metaKey||event.ctrlKey)&&selectee.startselected?(that._removeClass(selectee.$element,"ui-selecting"),selectee.selecting=!1,that._addClass(selectee.$element,"ui-selected"),selectee.selected=!0):(that._removeClass(selectee.$element,"ui-selecting"),selectee.selecting=!1,selectee.startselected&&(that._addClass(selectee.$element,"ui-unselecting"),selectee.unselecting=!0),that._trigger("unselecting",event,{unselecting:selectee.element}))),selectee.selected&&(event.metaKey||event.ctrlKey||selectee.startselected||(that._removeClass(selectee.$element,"ui-selected"),selectee.selected=!1,that._addClass(selectee.$element,"ui-unselecting"),selectee.unselecting=!0,that._trigger("unselecting",event,{unselecting:selectee.element})))))}),!1}},_mouseStop:function(event){var that=this;return this.dragged=!1,$(".ui-unselecting",this.element[0]).each(function(){var selectee=$.data(this,"selectable-item");that._removeClass(selectee.$element,"ui-unselecting"),selectee.unselecting=!1,selectee.startselected=!1,that._trigger("unselected",event,{unselected:selectee.element})}),$(".ui-selecting",this.element[0]).each(function(){var selectee=$.data(this,"selectable-item");that._removeClass(selectee.$element,"ui-selecting")._addClass(selectee.$element,"ui-selected"),selectee.selecting=!1,selectee.selected=!0,selectee.startselected=!0,that._trigger("selected",event,{selected:selectee.element})}),this._trigger("stop",event),this.helper.remove(),!1}})});