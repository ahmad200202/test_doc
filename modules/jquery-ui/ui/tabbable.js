!function(factory){"function"==typeof define&&define.amd?define(["jquery","./version","./focusable"],factory):factory(jQuery)}(function($){return $.extend($.expr[":"],{tabbable:function(element){var tabIndex=$.attr(element,"tabindex"),hasTabindex=null!=tabIndex;return(!hasTabindex||tabIndex>=0)&&$.ui.focusable(element,hasTabindex)}})});