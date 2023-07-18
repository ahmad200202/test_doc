!function(angular){"use strict";var resolutionSelectorModule=angular.module("attResolutionSelector",[]);resolutionSelectorModule.directive("attResolutionSelector",["$compile","GlobalEvents",function($compile,GlobalEvents){return{restrict:"E",scope:{resolutionLevels:"=",methodToCall:"&",aggregationLevel:"="},templateUrl:"scripts/angular.common/attCharts/attResolutionSelector/attResolutionSelector.html",link:function(scope,element){scope.renderAggregationButtons=function(){var div=element.find(".attResolutionSelector");scope.wrappedCallMethod=function(aggregationLevel){GlobalEvents.trigger("attResolutionSelector:clicked",""+element[0].parentElement.id),scope.methodToCall(aggregationLevel)},angular.forEach(scope.resolutionLevels,function(value){div.append($compile("<button ng-class=\"{selectedBtn : aggregationLevel === '"+value+'\'}" class="aggregationBtn attBtn" ng-click="aggregationLevel=\''+value+"'; wrappedCallMethod({aggregationLevel: '"+value+"'})\">"+value+"</button>")(scope))}),GlobalEvents.trigger("attResolutionSelector:render:id="+element[0].parentElement.id,"attResolutionSelector rendered.")},scope.renderAggregationButtons(),scope.$watch(scope.resolutionLevels,function(newVals,oldVals){newVals!=oldVals&&scope.renderAggregationButtons()})}}}])}(angular);