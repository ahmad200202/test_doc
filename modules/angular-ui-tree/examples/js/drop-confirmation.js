!function(){"use strict";angular.module("demoApp").controller("DropConfirmationCtrl",function($scope,$modal,$q){$scope.toggle=function(scope){scope.toggle()},$scope.data=[{value:10,nodes:[{value:5,nodes:[]}]},{value:20,nodes:[]},{value:30,nodes:[{value:25,nodes:[]}]},{value:40,nodes:[]}],$scope.treeOptions={beforeDrop:function(e){var modalInstance,sourceValue=e.source.nodeScope.$modelValue.value,destValue=e.dest.nodesScope.node?e.dest.nodesScope.node.value:void 0;return sourceValue>destValue?(modalInstance=$modal.open({templateUrl:"drop-modal.html"}),e.source.nodeScope.$treeScope.usePromise?modalInstance.result.then(function(allowDrop){return allowDrop?allowDrop:$q.reject()}):modalInstance.result):void 0}}})}();