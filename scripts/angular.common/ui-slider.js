angular.module("ui.slider",[]).value("uiSliderConfig",{}).directive("uiSlider",["uiSliderConfig","$timeout",function(uiSliderConfig,$timeout){return uiSliderConfig=uiSliderConfig||{},{require:"ngModel",compile:function(){var preLink=function(scope,elm,attrs,ngModel){function parseNumber(n,decimals){return decimals?parseFloat(n):parseInt(n,10)}function destroy(){try{elm.slider("destroy")}catch(e){}}var options=angular.extend(scope.$eval(attrs.uiSlider)||{},uiSliderConfig),prevRangeValues={min:null,max:null},properties=["min","max","step"],useDecimals=angular.isUndefined(attrs.useDecimals)?!1:!0,init=function(){angular.isArray(ngModel.$viewValue)&&options.range!==!0&&(console.warn("Change your range option of ui-slider. When assigning ngModel an array of values then the range option should be set to true."),options.range=!0),angular.forEach(properties,function(property){angular.isDefined(attrs[property])&&(options[property]=parseNumber(attrs[property],useDecimals))}),elm.slider(options),init=angular.noop};angular.forEach(properties,function(property){attrs.$observe(property,function(newVal){newVal&&(init(),options[property]=parseNumber(newVal,useDecimals),elm.slider("option",property,parseNumber(newVal,useDecimals)),ngModel.$render())})}),attrs.$observe("disabled",function(newVal){init(),elm.slider("option","disabled",!!newVal)}),scope.$watch(attrs.uiSlider,function(newVal){init(),void 0!==newVal&&elm.slider("option",newVal)},!0),$timeout(init,0,!0),elm.bind("slide",function(event,ui){ngModel.$setViewValue(ui.values||ui.value),scope.$apply()}),ngModel.$render=function(){init();var method=options.range===!0?"values":"value";options.range||!isNaN(ngModel.$viewValue)||ngModel.$viewValue instanceof Array?options.range&&!angular.isDefined(ngModel.$viewValue)&&(ngModel.$viewValue=[0,0]):ngModel.$viewValue=0,options.range===!0&&(angular.isDefined(options.min)&&options.min>ngModel.$viewValue[0]&&(ngModel.$viewValue[0]=options.min),angular.isDefined(options.max)&&options.max<ngModel.$viewValue[1]&&(ngModel.$viewValue[1]=options.max),ngModel.$viewValue[0]>ngModel.$viewValue[1]&&(prevRangeValues.min>=ngModel.$viewValue[1]&&(ngModel.$viewValue[0]=prevRangeValues.min),prevRangeValues.max<=ngModel.$viewValue[0]&&(ngModel.$viewValue[1]=prevRangeValues.max)),prevRangeValues.min=ngModel.$viewValue[0],prevRangeValues.max=ngModel.$viewValue[1]),elm.slider(method,ngModel.$viewValue)},scope.$watch(attrs.ngModel,function(){options.range===!0&&ngModel.$render()},!0),scope.$on("$destroy",function(){destroy()})},postLink=function(scope,element,attrs){var options=angular.extend({},scope.$eval(attrs.uiSlider)),properties=["max","step","tick"];if(angular.forEach(properties,function(property){angular.isDefined(attrs[property])&&(options[property]=attrs[property])}),angular.isDefined(options.tick)&&angular.isDefined(options.step))for(var total=parseInt(parseInt(options.max)/parseInt(options.step)),i=total;i>=0;i--){var left=i/total*100+"%";$("<div/>").addClass("ui-slider-tick").appendTo(element).css({left:left})}};return{pre:preLink,post:postLink}}}}]);