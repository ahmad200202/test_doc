!function(angular){"use strict";var controllers=angular.module(window.AppName+".documentationControllers");controllers.controller(composeConsts.DocumentationCtrls.DisplayController,["$scope","$http","$timeout","treeConfig",composeConsts.DocumentationSrvcs.DisplayService,function($scope,$http,$timeout,treeConfig,DisplayService){function getRootNodesScope(treeId){return angular.element(document.getElementById(treeId)).scope().$nodesScope.childNodes()[0]}function expandNode(treeId,nodeName){for(var parentScopes=getScopePath(treeId,nodeName),i=0;i<parentScopes.length;i++)parentScopes[i].expand(),i===parentScopes.length-1&&(parentScopes[i].onNodeClick(parentScopes[i].$modelValue,parentScopes[i-1]),$("div.tree-node").removeClass("selected"),$(parentScopes[i].$element).children("div.tree-node").addClass("selected"))}function getScopePath(treeId,nodeName){return getScopePathIter(nodeName,getRootNodesScope(treeId),[])}function getScopePathIter(nodeName,scope,parentScopeList){if(!scope)return null;var newParentScopeList=parentScopeList.slice();if(newParentScopeList.push(scope),scope.$modelValue&&scope.$modelValue.name===nodeName)return newParentScopeList;for(var foundScopesPath=null,childNodes=scope.childNodes()||[],i=0;null===foundScopesPath&&i<childNodes.length;i++)foundScopesPath=getScopePathIter(nodeName,childNodes[i],newParentScopeList);return foundScopesPath}$scope.INIT=function(){$scope.search_props={search:""},$scope.COMPOSE_CONSTS=composeConsts,$scope.data=DisplayService.data,$scope.DO=DO,$scope.left_nav_open=null!=amplify.store(window.AppName+"_left_nav_open")?amplify.store(window.AppName+"_left_nav_open"):!0},$scope.INIT(),$scope.expandCollapseLeftNav=function(){$scope.left_nav_open=!$scope.left_nav_open,amplify.store(window.AppName+"_left_nav_open",$scope.left_nav_open)},$scope.onNavClick=function(t){DisplayService.data.SELECTED_TREE_NAV_ITEM=t,$timeout(function(){$("span.treeNodeItem:contains("+t.route.node_name+")").first().trigger("click")},100)},$scope.onClickState=function(item){if(null!=item&&""!=item.name&&void 0!=item.name){DisplayService.setSelectedNavItemByState(item.state_name);var nodeClassName="."+treeConfig.nodeClass.replaceAll("angular-ui-",""),selectedNodeClassName=nodeClassName+".selected";$timeout(function(){$(selectedNodeClassName).parents("li").first().scope().collapsed=!1;var n=$(selectedNodeClassName).parents("li").first().find("ol").find("li").filter(function(){return $(this).find(".treeNodeItem").text().trim()===item.name});n&&n.find(".treeNodeItem").trigger("click"),angular.element($(selectedNodeClassName).parents("li").first().find("span.treeNodeItem:contains("+item.name+")").first()).scope().toggle()},100)}},$scope.onLineageNodeClick=function(node){$timeout(function(){node.type===Lineage.LineageTypes.Landing.type?expandNode(DisplayService.data.TreeIds.Appendix,node.data.name):node.type===Lineage.LineageTypes.Mappings.type&&expandNode(DisplayService.data.TreeIds.Etl,node.data.name)},100)}}])}(angular);