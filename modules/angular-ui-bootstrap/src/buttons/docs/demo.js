angular.module("ui.bootstrap.demo").controller("ButtonsCtrl",function($scope){$scope.singleModel=1,$scope.radioModel="Middle",$scope.checkModel={left:!1,middle:!0,right:!1},$scope.checkResults=[],$scope.$watchCollection("checkModel",function(){$scope.checkResults=[],angular.forEach($scope.checkModel,function(value,key){value&&$scope.checkResults.push(key)})})});