!function(factory){"function"==typeof define&&define.amd?define(["jquery","./version"],factory):factory(jQuery)}(function($){return $.fn.scrollParent=function(includeHidden){var position=this.css("position"),excludeStaticParent="absolute"===position,overflowRegex=includeHidden?/(auto|scroll|hidden)/:/(auto|scroll)/,scrollParent=this.parents().filter(function(){var parent=$(this);return excludeStaticParent&&"static"===parent.css("position")?!1:overflowRegex.test(parent.css("overflow")+parent.css("overflow-y")+parent.css("overflow-x"))}).eq(0);return"fixed"!==position&&scrollParent.length?scrollParent:$(this[0].ownerDocument||document)}});