!function(angular){"use strict";var selectionService=angular.module("attChartSelectionService",[]);selectionService.service("attChartSelectionService",["GlobalEvents",function(GlobalEvents){var AttChartSelectionService={notifyChartsSelected:function(changeInfo){GlobalEvents.trigger("attChartSelection:change",changeInfo)}};return AttChartSelectionService}])}(angular);