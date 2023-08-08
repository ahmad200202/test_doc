angular.module("ui.bootstrap.pager",["ui.bootstrap.paging","ui.bootstrap.tabindex"]).controller("UibPagerController",["$scope","$attrs","uibPaging","uibPagerConfig",function($scope,$attrs,uibPaging,uibPagerConfig){$scope.align=angular.isDefined($attrs.align)?$scope.$parent.$eval($attrs.align):uibPagerConfig.align,uibPaging.create(this,$scope,$attrs)}]).constant("uibPagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("uibPager",["uibPagerConfig",function(uibPagerConfig){return{scope:{totalItems:"=",previousText:"@",nextText:"@",ngDisabled:"="},require:["uibPager","?ngModel"],restrict:"A",controller:"UibPagerController",controllerAs:"pager",templateUrl:function(element,attrs){return attrs.templateUrl||"uib/template/pager/pager.html"},link:function(scope,element,attrs,ctrls){element.addClass("pager");var paginationCtrl=ctrls[0],ngModelCtrl=ctrls[1];ngModelCtrl&&paginationCtrl.init(ngModelCtrl,uibPagerConfig)}}}]);