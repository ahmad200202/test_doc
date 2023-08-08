!function(factory){"function"==typeof define&&define.amd?define(["jquery","../escape-selector","../form-reset-mixin","../labels","../widget"],factory):factory(jQuery)}(function($){return $.widget("ui.checkboxradio",[$.ui.formResetMixin,{version:"1.12.1",options:{disabled:null,label:null,icon:!0,classes:{"ui-checkboxradio-label":"ui-corner-all","ui-checkboxradio-icon":"ui-corner-all"}},_getCreateOptions:function(){var disabled,labels,that=this,options=this._super()||{};return this._readType(),labels=this.element.labels(),this.label=$(labels[labels.length-1]),this.label.length||$.error("No label found for checkboxradio widget"),this.originalLabel="",this.label.contents().not(this.element[0]).each(function(){that.originalLabel+=3===this.nodeType?$(this).text():this.outerHTML}),this.originalLabel&&(options.label=this.originalLabel),disabled=this.element[0].disabled,null!=disabled&&(options.disabled=disabled),options},_create:function(){var checked=this.element[0].checked;this._bindFormResetHandler(),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled),this._setOption("disabled",this.options.disabled),this._addClass("ui-checkboxradio","ui-helper-hidden-accessible"),this._addClass(this.label,"ui-checkboxradio-label","ui-button ui-widget"),"radio"===this.type&&this._addClass(this.label,"ui-checkboxradio-radio-label"),this.options.label&&this.options.label!==this.originalLabel?this._updateLabel():this.originalLabel&&(this.options.label=this.originalLabel),this._enhance(),checked&&(this._addClass(this.label,"ui-checkboxradio-checked","ui-state-active"),this.icon&&this._addClass(this.icon,null,"ui-state-hover")),this._on({change:"_toggleClasses",focus:function(){this._addClass(this.label,null,"ui-state-focus ui-visual-focus")},blur:function(){this._removeClass(this.label,null,"ui-state-focus ui-visual-focus")}})},_readType:function(){var nodeName=this.element[0].nodeName.toLowerCase();this.type=this.element[0].type,"input"===nodeName&&/radio|checkbox/.test(this.type)||$.error("Can't create checkboxradio on element.nodeName="+nodeName+" and element.type="+this.type)},_enhance:function(){this._updateIcon(this.element[0].checked)},widget:function(){return this.label},_getRadioGroup:function(){var group,name=this.element[0].name,nameSelector="input[name='"+$.ui.escapeSelector(name)+"']";return name?(group=this.form.length?$(this.form[0].elements).filter(nameSelector):$(nameSelector).filter(function(){return 0===$(this).form().length}),group.not(this.element)):$([])},_toggleClasses:function(){var checked=this.element[0].checked;this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",checked),this.options.icon&&"checkbox"===this.type&&this._toggleClass(this.icon,null,"ui-icon-check ui-state-checked",checked)._toggleClass(this.icon,null,"ui-icon-blank",!checked),"radio"===this.type&&this._getRadioGroup().each(function(){var instance=$(this).checkboxradio("instance");instance&&instance._removeClass(instance.label,"ui-checkboxradio-checked","ui-state-active")})},_destroy:function(){this._unbindFormResetHandler(),this.icon&&(this.icon.remove(),this.iconSpace.remove())},_setOption:function(key,value){return"label"!==key||value?(this._super(key,value),"disabled"===key?(this._toggleClass(this.label,null,"ui-state-disabled",value),void(this.element[0].disabled=value)):void this.refresh()):void 0},_updateIcon:function(checked){var toAdd="ui-icon ui-icon-background ";this.options.icon?(this.icon||(this.icon=$("<span>"),this.iconSpace=$("<span> </span>"),this._addClass(this.iconSpace,"ui-checkboxradio-icon-space")),"checkbox"===this.type?(toAdd+=checked?"ui-icon-check ui-state-checked":"ui-icon-blank",this._removeClass(this.icon,null,checked?"ui-icon-blank":"ui-icon-check")):toAdd+="ui-icon-blank",this._addClass(this.icon,"ui-checkboxradio-icon",toAdd),checked||this._removeClass(this.icon,null,"ui-icon-check ui-state-checked"),this.icon.prependTo(this.label).after(this.iconSpace)):void 0!==this.icon&&(this.icon.remove(),this.iconSpace.remove(),delete this.icon)},_updateLabel:function(){var contents=this.label.contents().not(this.element[0]);this.icon&&(contents=contents.not(this.icon[0])),this.iconSpace&&(contents=contents.not(this.iconSpace[0])),contents.remove(),this.label.append(this.options.label)},refresh:function(){var checked=this.element[0].checked,isDisabled=this.element[0].disabled;this._updateIcon(checked),this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",checked),null!==this.options.label&&this._updateLabel(),isDisabled!==this.options.disabled&&this._setOptions({disabled:isDisabled})}}]),$.ui.checkboxradio});