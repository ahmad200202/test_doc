!function(angular){"use strict";var commonDirectives=angular.module("attCommon.commonDirectives");commonDirectives.directive("attDetailedProgressBar",[function(){return{scope:{showTextualData:"=",showTopTitle:"@",showBottomTitle:"@",topTitle:"@",bottomTitle:"@",rowOneText:"@",rowTwoText:"@",rowThreeText:"@",isVertical:"=",fillColor:"@",progressValue:"@",progressText:"@",onClickFnc:"&",onTitle2ClickFnc:"&"},restrict:"E",replace:!0,templateUrl:"scripts/angular.common/attProgressBar/detailedProgress/detailedProgressBar.html",link:function(scope){scope.showBottomTitle=!0,scope.onBarClick=function($event){scope.onClickFnc&&scope.onClickFnc($event)},scope.onProgressTitle2Click=function($event){scope.onTitle2ClickFnc&&scope.onTitle2ClickFnc($event)}}}}])}(angular);