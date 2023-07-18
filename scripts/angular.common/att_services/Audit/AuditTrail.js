!function(angular){"use strict";var attAuditTrailService=angular.module("attAuditService",[]);attAuditTrailService.factory("AuditTrailService",["InvokerService","modalService","locale","TimeFrameService",function(InvokerService,modalService,locale,TimeFrameService){locale.ready("common.messageCenter").then(function(){}),locale.ready("common.audit").then(function(){});var AuditTrailService={GetAuditTrail:function(ctx,format,start,end){ctx.GetAuditTrail.params.format=format,ctx.GetAuditTrail.params.start=start,ctx.GetAuditTrail.params.end=end,InvokerService.invokeServiceMethod(ctx,"GetAuditTrail")},GetAuditTrailPayload:function(ctx){InvokerService.invokeServiceMethod(ctx,"GetAuditTrailPayload")},openAuditTrailPopup:function(ctx){var fromDate=new Date;fromDate.setHours(fromDate.getHours()-6);var model={};model.fromDate=fromDate,model.toDate=new Date,modalService.showModal({contentTemplate:"scripts/angular.common/att_services/Audit/AuditTrailPopup.html",headerText:locale.getString("common.audit.AuditTrialHeader"),resizable:!1,actionButtonText:locale.getString("common.audit.Generate"),model:model},{windowClass:"AuditTrailPopup"}).then(function(vm){var time=AuditTrailService.getTimeFromTimeFrameSelection(vm);AuditTrailService.GetAuditTrail(ctx,"csv",time.from,time.to)})},getTimeFromTimeFrameSelection:function(vm){var toDate=new Date,fromDate=new Date;switch(vm.timeFrame.name){case"last6Hours":fromDate.setHours(fromDate.getHours()-6);break;case"last12Hours":fromDate.setHours(fromDate.getHours()-12);break;case"last24Hours":fromDate.setHours(fromDate.getHours()-24);break;case"last72Hours":fromDate.setHours(fromDate.getHours()-72);break;case"lastWeek":fromDate.setHours(fromDate.getHours()-168);break;case"custom":toDate=vm.toDate,fromDate=vm.fromDate}return{from:fromDate.toISOString(),to:toDate.toISOString()}},getTimeFrameList:function(){var list=TimeFrameService.getBaseValuesTimeFrameList();return list.push({name:consts.MessagesCenter.timeFrameNames.custom,displayName:locale.getString("common.messageCenter.custom"),lowerCaseName:locale.getString("common.messageCenter.custom").toLowerCase()}),list}};return AuditTrailService}]),attAuditTrailService.controller("AuditTrailPopupCtrl",["$scope","AuditTrailService",function($scope,AuditTrailService){$scope.vm=$scope.vm||{},$scope.vm.timeFrameList=AuditTrailService.getTimeFrameList(),$scope.vm.timeFrame=$scope.vm.timeFrameList[0];var minDate=new Date;minDate.setFullYear(minDate.getFullYear()-20),minDate.setHours(0),minDate.setMinutes(0),$scope.vm.minFromDate=minDate,$scope.vm.maxDate=new Date,$scope.timeFrameSelected=function(){}}])}(angular);