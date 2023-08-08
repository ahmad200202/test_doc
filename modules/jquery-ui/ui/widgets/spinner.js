!function(factory){"function"==typeof define&&define.amd?define(["jquery","./button","../version","../keycode","../safe-active-element","../widget"],factory):factory(jQuery)}(function($){function spinnerModifer(fn){return function(){var previous=this.element.val();fn.apply(this,arguments),this._refresh(),previous!==this.element.val()&&this._trigger("change")}}return $.widget("ui.spinner",{version:"1.12.1",defaultElement:"<input>",widgetEventPrefix:"spin",options:{classes:{"ui-spinner":"ui-corner-all","ui-spinner-down":"ui-corner-br","ui-spinner-up":"ui-corner-tr"},culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),""!==this.value()&&this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var options=this._super(),element=this.element;return $.each(["min","max","step"],function(i,option){var value=element.attr(option);null!=value&&value.length&&(options[option]=value)}),options},_events:{keydown:function(event){this._start(event)&&this._keydown(event)&&event.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(event){return this.cancelBlur?void delete this.cancelBlur:(this._stop(),this._refresh(),void(this.previous!==this.element.val()&&this._trigger("change",event)))},mousewheel:function(event,delta){if(delta){if(!this.spinning&&!this._start(event))return!1;this._spin((delta>0?1:-1)*this.options.step,event),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(event)},100),event.preventDefault()}},"mousedown .ui-spinner-button":function(event){function checkFocus(){var isActive=this.element[0]===$.ui.safeActiveElement(this.document[0]);isActive||(this.element.trigger("focus"),this.previous=previous,this._delay(function(){this.previous=previous}))}var previous;previous=this.element[0]===$.ui.safeActiveElement(this.document[0])?this.previous:this.element.val(),event.preventDefault(),checkFocus.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,checkFocus.call(this)}),this._start(event)!==!1&&this._repeat(null,$(event.currentTarget).hasClass("ui-spinner-up")?1:-1,event)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(event){return $(event.currentTarget).hasClass("ui-state-active")?this._start(event)===!1?!1:void this._repeat(null,$(event.currentTarget).hasClass("ui-spinner-up")?1:-1,event):void 0},"mouseleave .ui-spinner-button":"_stop"},_enhance:function(){this.uiSpinner=this.element.attr("autocomplete","off").wrap("<span>").parent().append("<a></a><a></a>")},_draw:function(){this._enhance(),this._addClass(this.uiSpinner,"ui-spinner","ui-widget ui-widget-content"),this._addClass("ui-spinner-input"),this.element.attr("role","spinbutton"),this.buttons=this.uiSpinner.children("a").attr("tabIndex",-1).attr("aria-hidden",!0).button({classes:{"ui-button":""}}),this._removeClass(this.buttons,"ui-corner-all"),this._addClass(this.buttons.first(),"ui-spinner-button ui-spinner-up"),this._addClass(this.buttons.last(),"ui-spinner-button ui-spinner-down"),this.buttons.first().button({icon:this.options.icons.up,showLabel:!1}),this.buttons.last().button({icon:this.options.icons.down,showLabel:!1}),this.buttons.height()>Math.ceil(.5*this.uiSpinner.height())&&this.uiSpinner.height()>0&&this.uiSpinner.height(this.uiSpinner.height())},_keydown:function(event){var options=this.options,keyCode=$.ui.keyCode;switch(event.keyCode){case keyCode.UP:return this._repeat(null,1,event),!0;case keyCode.DOWN:return this._repeat(null,-1,event),!0;case keyCode.PAGE_UP:return this._repeat(null,options.page,event),!0;case keyCode.PAGE_DOWN:return this._repeat(null,-options.page,event),!0}return!1},_start:function(event){return this.spinning||this._trigger("start",event)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(i,steps,event){i=i||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,steps,event)},i),this._spin(steps*this.options.step,event)},_spin:function(step,event){var value=this.value()||0;this.counter||(this.counter=1),value=this._adjustValue(value+step*this._increment(this.counter)),this.spinning&&this._trigger("spin",event,{value:value})===!1||(this._value(value),this.counter++)},_increment:function(i){var incremental=this.options.incremental;return incremental?$.isFunction(incremental)?incremental(i):Math.floor(i*i*i/5e4-i*i/500+17*i/200+1):1},_precision:function(){var precision=this._precisionOf(this.options.step);return null!==this.options.min&&(precision=Math.max(precision,this._precisionOf(this.options.min))),precision},_precisionOf:function(num){var str=num.toString(),decimal=str.indexOf(".");return-1===decimal?0:str.length-decimal-1},_adjustValue:function(value){var base,aboveMin,options=this.options;return base=null!==options.min?options.min:0,aboveMin=value-base,aboveMin=Math.round(aboveMin/options.step)*options.step,value=base+aboveMin,value=parseFloat(value.toFixed(this._precision())),null!==options.max&&value>options.max?options.max:null!==options.min&&value<options.min?options.min:value},_stop:function(event){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",event))},_setOption:function(key,value){var prevValue,first,last;return"culture"===key||"numberFormat"===key?(prevValue=this._parse(this.element.val()),this.options[key]=value,void this.element.val(this._format(prevValue))):(("max"===key||"min"===key||"step"===key)&&"string"==typeof value&&(value=this._parse(value)),"icons"===key&&(first=this.buttons.first().find(".ui-icon"),this._removeClass(first,null,this.options.icons.up),this._addClass(first,null,value.up),last=this.buttons.last().find(".ui-icon"),this._removeClass(last,null,this.options.icons.down),this._addClass(last,null,value.down)),void this._super(key,value))},_setOptionDisabled:function(value){this._super(value),this._toggleClass(this.uiSpinner,null,"ui-state-disabled",!!value),this.element.prop("disabled",!!value),this.buttons.button(value?"disable":"enable")},_setOptions:spinnerModifer(function(options){this._super(options)}),_parse:function(val){return"string"==typeof val&&""!==val&&(val=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(val,10,this.options.culture):+val),""===val||isNaN(val)?null:val},_format:function(value){return""===value?"":window.Globalize&&this.options.numberFormat?Globalize.format(value,this.options.numberFormat,this.options.culture):value},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},isValid:function(){var value=this.value();return null===value?!1:value===this._adjustValue(value)},_value:function(value,allowAny){var parsed;""!==value&&(parsed=this._parse(value),null!==parsed&&(allowAny||(parsed=this._adjustValue(parsed)),value=this._format(parsed))),this.element.val(value),this._refresh()},_destroy:function(){this.element.prop("disabled",!1).removeAttr("autocomplete role aria-valuemin aria-valuemax aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:spinnerModifer(function(steps){this._stepUp(steps)}),_stepUp:function(steps){this._start()&&(this._spin((steps||1)*this.options.step),this._stop())},stepDown:spinnerModifer(function(steps){this._stepDown(steps)}),_stepDown:function(steps){this._start()&&(this._spin((steps||1)*-this.options.step),this._stop())},pageUp:spinnerModifer(function(pages){this._stepUp((pages||1)*this.options.page)}),pageDown:spinnerModifer(function(pages){this._stepDown((pages||1)*this.options.page)}),value:function(newVal){return arguments.length?void spinnerModifer(this._value).call(this,newVal):this._parse(this.element.val())},widget:function(){return this.uiSpinner}}),$.uiBackCompat!==!1&&$.widget("ui.spinner",$.ui.spinner,{_enhance:function(){this.uiSpinner=this.element.attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml())},_uiSpinnerHtml:function(){return"<span>"},_buttonHtml:function(){return"<a></a><a></a>"}}),$.ui.spinner});