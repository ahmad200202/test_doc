!function(factory){"function"==typeof define&&define.amd?define(["jquery","../widget"],factory):factory(jQuery)}(function($){var controlgroupCornerRegex=/ui-corner-([a-z]){2,6}/g;return $.widget("ui.controlgroup",{version:"1.12.1",defaultElement:"<div>",options:{direction:"horizontal",disabled:null,onlyVisible:!0,items:{button:"input[type=button], input[type=submit], input[type=reset], button, a",controlgroupLabel:".ui-controlgroup-label",checkboxradio:"input[type='checkbox'], input[type='radio']",selectmenu:"select",spinner:".ui-spinner-input"}},_create:function(){this._enhance()},_enhance:function(){this.element.attr("role","toolbar"),this.refresh()},_destroy:function(){this._callChildMethod("destroy"),this.childWidgets.removeData("ui-controlgroup-data"),this.element.removeAttr("role"),this.options.items.controlgroupLabel&&this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()},_initWidgets:function(){var that=this,childWidgets=[];$.each(this.options.items,function(widget,selector){var labels,options={};return selector?"controlgroupLabel"===widget?(labels=that.element.find(selector),labels.each(function(){var element=$(this);element.children(".ui-controlgroup-label-contents").length||element.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")}),that._addClass(labels,null,"ui-widget ui-widget-content ui-state-default"),void(childWidgets=childWidgets.concat(labels.get()))):void($.fn[widget]&&(options=that["_"+widget+"Options"]?that["_"+widget+"Options"]("middle"):{classes:{}},that.element.find(selector).each(function(){var element=$(this),instance=element[widget]("instance"),instanceOptions=$.widget.extend({},options);if("button"!==widget||!element.parent(".ui-spinner").length){instance||(instance=element[widget]()[widget]("instance")),instance&&(instanceOptions.classes=that._resolveClassesValues(instanceOptions.classes,instance)),element[widget](instanceOptions);var widgetElement=element[widget]("widget");$.data(widgetElement[0],"ui-controlgroup-data",instance?instance:element[widget]("instance")),childWidgets.push(widgetElement[0])}}))):void 0}),this.childWidgets=$($.unique(childWidgets)),this._addClass(this.childWidgets,"ui-controlgroup-item")},_callChildMethod:function(method){this.childWidgets.each(function(){var element=$(this),data=element.data("ui-controlgroup-data");data&&data[method]&&data[method]()})},_updateCornerClass:function(element,position){var remove="ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all",add=this._buildSimpleOptions(position,"label").classes.label;this._removeClass(element,null,remove),this._addClass(element,null,add)},_buildSimpleOptions:function(position,key){var direction="vertical"===this.options.direction,result={classes:{}};return result.classes[key]={middle:"",first:"ui-corner-"+(direction?"top":"left"),last:"ui-corner-"+(direction?"bottom":"right"),only:"ui-corner-all"}[position],result},_spinnerOptions:function(position){var options=this._buildSimpleOptions(position,"ui-spinner");return options.classes["ui-spinner-up"]="",options.classes["ui-spinner-down"]="",options},_buttonOptions:function(position){return this._buildSimpleOptions(position,"ui-button")},_checkboxradioOptions:function(position){return this._buildSimpleOptions(position,"ui-checkboxradio-label")},_selectmenuOptions:function(position){var direction="vertical"===this.options.direction;return{width:direction?"auto":!1,classes:{middle:{"ui-selectmenu-button-open":"","ui-selectmenu-button-closed":""},first:{"ui-selectmenu-button-open":"ui-corner-"+(direction?"top":"tl"),"ui-selectmenu-button-closed":"ui-corner-"+(direction?"top":"left")},last:{"ui-selectmenu-button-open":direction?"":"ui-corner-tr","ui-selectmenu-button-closed":"ui-corner-"+(direction?"bottom":"right")},only:{"ui-selectmenu-button-open":"ui-corner-top","ui-selectmenu-button-closed":"ui-corner-all"}}[position]}},_resolveClassesValues:function(classes,instance){var result={};return $.each(classes,function(key){var current=instance.options.classes[key]||"";current=$.trim(current.replace(controlgroupCornerRegex,"")),result[key]=(current+" "+classes[key]).replace(/\s+/g," ")}),result},_setOption:function(key,value){return"direction"===key&&this._removeClass("ui-controlgroup-"+this.options.direction),this._super(key,value),"disabled"===key?void this._callChildMethod(value?"disable":"enable"):void this.refresh()},refresh:function(){var children,that=this;this._addClass("ui-controlgroup ui-controlgroup-"+this.options.direction),"horizontal"===this.options.direction&&this._addClass(null,"ui-helper-clearfix"),this._initWidgets(),children=this.childWidgets,this.options.onlyVisible&&(children=children.filter(":visible")),children.length&&($.each(["first","last"],function(index,value){var instance=children[value]().data("ui-controlgroup-data");if(instance&&that["_"+instance.widgetName+"Options"]){var options=that["_"+instance.widgetName+"Options"](1===children.length?"only":value);options.classes=that._resolveClassesValues(options.classes,instance),instance.element[instance.widgetName](options)}else that._updateCornerClass(children[value](),value)}),this._callChildMethod("refresh"))}})});