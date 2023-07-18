!function(angular){"use strict";var controllers=angular.module(window.AppName+".documentationControllers");controllers.controller(composeConsts.DocumentationCtrls.ModelTreeCtrl,["$scope",function($scope){$scope.onNodeClick=function(node,$parentNodeScope,$event){$scope.show_MODEL_SelectedNode(node,$parentNodeScope),$scope.setSelectedNode(node,$parentNodeScope,$event)}}]),controllers.controller(composeConsts.DocumentationCtrls.EtlTreeCtrl,["$scope",function($scope){$scope.onNodeClick=function(node,$parentNodeScope,$event){$scope.show_ETLS_SelectedNode(node,$parentNodeScope),$scope.setSelectedNode(node,$parentNodeScope,$event)}}]),controllers.controller(composeConsts.DocumentationCtrls.DataMartTreeCtrl,["$scope",function($scope){$scope.onNodeClick=function(node,$parentNodeScope,$event){$scope.show_DATAMART_SelectedNode(node,$parentNodeScope),$scope.setSelectedNode(node,$parentNodeScope,$event)}}]),controllers.controller(composeConsts.DocumentationCtrls.AppendixTreeCtrl,["$scope",function($scope){$scope.onNodeClick=function(node,$parentNodeScope,$event){$scope.show_APPENDIX_SelectedNode(node,$parentNodeScope),$scope.setSelectedNode(node,$parentNodeScope,$event)}}]),controllers.controller(composeConsts.DocumentationCtrls.TreeController,["$scope","$filter","$location","$state","$timeout",composeConsts.DocumentationSrvcs.DisplayService,composeConsts.Srvcs.composeUtils,function($scope,$filter,$location,$state,$timeout,DisplayService){$scope.tree_search_term="",DisplayService.getRepository()&&($scope.TreeIds=DisplayService.data.TreeIds,$scope.dataForModelTree=DisplayService.getModelRootNode()?[DisplayService.getModelRootNode()]:null,$scope.dataForETLsTree=DisplayService.getETLSetsRootNode()?[DisplayService.getETLSetsRootNode()]:null,$scope.dataForDataMartsTree=DisplayService.getDataMartsRootNode()?[DisplayService.getDataMartsRootNode()]:null,$scope.dataForAppendixTree=DisplayService.getAppendixRootNode()?[DisplayService.getAppendixRootNode()]:null),$scope.setSelectedNode=function(node,$parentNodeScope,$event){DisplayService.data.current_item_name=node.name;var state=DisplayService.getStateNameByNodeName(node.name);DisplayService.setSelectedNavItemByState(state),$event&&($("div.tree-node").removeClass("selected"),$($event.currentTarget).parents("div.tree-node").first().addClass("selected"))},$scope.nodeVisible=function(item){return $scope.filterTree(item,$scope.filter_predicate)},$scope.filter_predicate=function(item){var name_match=null!=item.name&&null!=$scope.tree_search_term&&item.name.toLowerCase().indexOf($scope.tree_search_term.toLowerCase())>=0;return name_match},$scope.filterTree=function(item,filter_predicate){var ret_predicate=!1;if(filter_predicate&&(ret_predicate=filter_predicate(item)),ret_predicate)return ret_predicate;if(item.children){for(var res=!1,i=0;i<item.children.length;i++)res=res||$scope.filterTree(item.children[i],filter_predicate);return res}return!1},$scope.onExpandAll=function(){$scope.$broadcast("angular-ui-tree:expand-all")},$scope.onCollapseAll=function(){$scope.$broadcast("angular-ui-tree:collapse-all")},$scope.show_MODEL_SelectedNode=function(node,$parentNodeScope){var parent_node=$parentNodeScope?$parentNodeScope.node:null;switch(node.name){case composeConsts.documentation_tree_nodes.MODEL_NODE.node_name:DisplayService.setNavigationItems(node,parent_node),$state.transitionTo(composeConsts.documentation_tree_nodes.MODEL_NODE.state_name);break;case composeConsts.documentation_tree_nodes.ENTITIES_NODE.node_name:DisplayService.setEntities(),$state.transitionTo(composeConsts.documentation_tree_nodes.ENTITIES_NODE.state_name);break;case composeConsts.documentation_tree_nodes.ATTRIBUTES_DOMAIN_NODE.node_name:DisplayService.setAttributesDomain(),$state.transitionTo(composeConsts.documentation_tree_nodes.ATTRIBUTES_DOMAIN_NODE.state_name);break;case composeConsts.documentation_tree_nodes.TRANSFORMATION_NODE.node_name:DisplayService.setTransformations(),$state.transitionTo(composeConsts.documentation_tree_nodes.TRANSFORMATION_NODE.state_name);break;case composeConsts.documentation_tree_nodes.ERD_NODE.node_name:DisplayService.setDiagramData(),$state.transitionTo(composeConsts.documentation_tree_nodes.ERD_NODE.state_name);break;case composeConsts.documentation_tree_nodes.ENTITY_ATTRIBUTES_NODE.node_name:DisplayService.setEntityAttributesData(parent_node?parent_node.name:""),$state.transitionTo(composeConsts.documentation_tree_nodes.ENTITY_ATTRIBUTES_NODE.state_name,{entityName:parent_node?parent_node.name:""});break;case composeConsts.documentation_tree_nodes.ENTITY_RELATIONSHIPS_NODE.node_name:DisplayService.setEntityRelationShipData(parent_node?parent_node.name:""),$state.transitionTo(composeConsts.documentation_tree_nodes.ENTITY_RELATIONSHIPS_NODE.state_name,{entityName:parent_node?parent_node.name:""}),$timeout(function(){null!=$scope.data.model_erd_data&&null!=$scope.data.model_erd_data.api&&$scope.data.model_erd_data.api.selectNode($scope.data.current_model_entity_attributes.name)},1e3);break;case composeConsts.documentation_tree_nodes.ENTITY_LINEAGE_NODE.node_name:DisplayService.setLineageData(parent_node?parent_node.object.name:"",parent_node?parent_node.object.id:""),$state.transitionTo(composeConsts.documentation_tree_nodes.ENTITY_LINEAGE_NODE.state_name,{entityName:parent_node?parent_node.name:""});break;default:parent_node&&parent_node.name==composeConsts.documentation_tree_nodes.ENTITIES_NODE.node_name&&(DisplayService.setNavigationItems(node,parent_node),$state.transitionTo(composeConsts.documentation_tree_nodes.ENTITY_ROOT_NODE.state_name,{entityName:node.name}))}},$scope.show_ETLS_SelectedNode=function(node,$parentNodeScope){var parent_node=$parentNodeScope?$parentNodeScope.node:null,parent_parent_node=$parentNodeScope&&$parentNodeScope.$parent&&$parentNodeScope.$parent.$parent?$parentNodeScope.$parent.$parent.node:null;switch(node.name){case composeConsts.documentation_tree_nodes.ETL_SETS_NODE.node_name:DisplayService.setNavigationItems(node,parent_node),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_SETS_NODE.state_name);break;case composeConsts.documentation_tree_nodes.ETL_SETS_LIST_NODE.node_name:DisplayService.setETLSetsList(),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_SETS_LIST_NODE.state_name);break;case composeConsts.documentation_tree_nodes.MAPPINGS_NODE.node_name:DisplayService.setMappings(),$state.transitionTo(composeConsts.documentation_tree_nodes.MAPPINGS_NODE.state_name);break;default:if(parent_node.name===composeConsts.documentation_tree_nodes.ETL_SETS_LIST_NODE.node_name&&(DisplayService.setNavigationItems(node,parent_node),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_ITEM.state_name,{entityName:node.name})),node.name===composeConsts.documentation_tree_nodes.ETL_ACTIVE_MAPPING_ROOT_NODE.node_name&&(DisplayService.setETLMappingList(parent_node.name),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_ACTIVE_MAPPING_ROOT_NODE.state_name,{entityName:node.name})),-1!==DisplayService.data.CUSTOM_ETL_NODES_DISPLAY_NAMES.indexOf(node.name))node.name===composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.SINGLE_TABLE_ETL?(DisplayService.setEntitiesSingleTableCustomETL(parent_node.name,node.name),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_CUSTOM_ETL_SINGLE_TABLE_NODE.state_name,{entityName:node.name})):(DisplayService.setCustomETLList(parent_node.name,node.name),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_CUSTOM_ETL_ROOT_NODE.state_name,{entityName:node.name}));else if(-1!==DisplayService.data.CUSTOM_ETL_NODES_DISPLAY_NAMES.indexOf(parent_node.name)){var etl=DisplayService.getETL(parent_parent_node.name),custom_etl=DisplayService.getCustomEtls(etl.name,parent_node.name),custom_etl_item=_.find(custom_etl,function(it){return it.name===node.name});DisplayService.setCurrentCustomETL(custom_etl_item),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_CUSTOM_ETL_NODE.state_name,{entityName:custom_etl_item.name})}else{var entity_name="";if(parent_parent_node&&parent_parent_node.name==composeConsts.documentation_tree_nodes.ETL_SETS_NODE.node_name){entity_name=node.name;var mappings=DisplayService.repoGetMappings();if(parent_node.name==composeConsts.documentation_tree_nodes.MAPPINGS_NODE.node_name){var etl_entity_item_mappings_list=_.find(mappings,function(it){return it.name==entity_name});DisplayService.data.etl_entity_item_mappings_list=etl_entity_item_mappings_list.children,$state.transitionTo(composeConsts.documentation_tree_nodes.ENTITY_MAPPINGS_NODE.state_name,{entityName:node.name})}}else if(parent_parent_node&&parent_parent_node.name==composeConsts.documentation_tree_nodes.MAPPINGS_NODE.node_name){entity_name=parent_node.name;var mapping_name=node.name;DisplayService.setETLMappingItem(entity_name,mapping_name),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_ENTITY_MAPPING_ITEM_NODE.state_name,{entityName:mapping_name})}}}},$scope.show_DATAMART_SelectedNode=function(node,$parentNodeScope){var parent_node=$parentNodeScope?$parentNodeScope.node:null,parent_parent_node=$parentNodeScope&&$parentNodeScope.$parent&&$parentNodeScope.$parent.$parent?$parentNodeScope.$parent.$parent.node:null;switch(node.name){case composeConsts.documentation_tree_nodes.DATA_MARTS_SETS_NODE.node_name:DisplayService.setNavigationItems(node,parent_node),$state.transitionTo(composeConsts.documentation_tree_nodes.DATA_MARTS_SETS_NODE.state_name);break;case composeConsts.documentation_tree_nodes.DATA_MARTS_SETS_LIST_NODE.node_name:DisplayService.setDataMartsList(),$state.transitionTo(composeConsts.documentation_tree_nodes.DATA_MARTS_SETS_LIST_NODE.state_name);break;case composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_SCHEMAS_ROOT_NODE.node_name:case composeConsts.documentation_tree_nodes.DATA_MARTS_DIMENSIONS_ROOT_NODE.node_name:DisplayService.setCurrentFactDimList(node.name,parent_node.name),$state.transitionTo(DisplayService.getStateNameByNodeName(node.name));break;default:if(-1!=DisplayService.data.CUSTOM_ETL_NODES_DISPLAY_NAMES.indexOf(node.name))DisplayService.getDataMartCustomETLs(parent_node.name,node.name),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_CUSTOM_ETL_ROOT_NODE.state_name);else if(-1!=DisplayService.data.CUSTOM_ETL_NODES_DISPLAY_NAMES.indexOf(parent_node.name)){var dm=DisplayService.getDataMart(parent_parent_node.name),custom_etl=DisplayService.getDataMartCustomETLs(dm.name,parent_node.name),custom_etl_item=_.find(custom_etl.children,function(it){return it.name==node.name});DisplayService.setCurrentCustomETL(custom_etl_item),$state.transitionTo(composeConsts.documentation_tree_nodes.ETL_CUSTOM_ETL_NODE.state_name,{entityName:custom_etl_item.name})}else if(node.name==composeConsts.documentation_tree_nodes.DATA_MARTS_DIMENSIONS_ROOT_NODE.node_name)DisplayService.data.facts_dims_list=DisplayService.getDataMartDimensions(parent_parent_node.name),DisplayService.data.current_fact_dim_item.fact_dim=node,$state.transitionTo(composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_DIMENSION_ITEM_NODE.state_name,{entityName:node.name});else if(parent_node.name==composeConsts.documentation_tree_nodes.DATA_MARTS_SETS_LIST_NODE.node_name)DisplayService.setNavigationItems(node,parent_node),$state.transitionTo(composeConsts.documentation_tree_nodes.DATA_MART_ITEM_NODE.state_name,{entityName:node.name});else if(parent_node.name==composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_SCHEMAS_ROOT_NODE.node_name||parent_node.name==composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_DIMENSION_ITEM_NODE.node_name){DisplayService.setCurrentFactDimItem(parent_node.name,parent_parent_node.name,node.name,node.id);var state=null;state=parent_node.name==composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_SCHEMAS_ROOT_NODE.node_name?composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_SCHEMA_ITEM_NODE.state_name:composeConsts.documentation_tree_nodes.DATA_MARTS_STAR_DIMENSION_ITEM_NODE.state_name,$state.transitionTo(state,{entityName:node.name})}}},$scope.show_APPENDIX_SelectedNode=function(node,$parentNodeScope){function handleNode(){null!=parent_node&&(parent_node.name===composeConsts.documentation_tree_nodes.APPENDIX_SOURCE_DATABASES_NODE.node_name?(state_name=composeConsts.documentation_tree_nodes.APPENDIX_DATABASE_ITEM_NODE.state_name,DisplayService.setCurrentSourceDatabase(node.id)):parent_node.name===composeConsts.documentation_tree_nodes.APPENDIX_DWH_DATABASES_NODE.node_name&&(state_name=composeConsts.documentation_tree_nodes.APPENDIX_DATABASE_ITEM_NODE.state_name,DisplayService.setCurrentDwhDatabase(node.id)))}var parent_node=$parentNodeScope?$parentNodeScope.node:null,state_name=DisplayService.getStateNameByNodeName(node.name);if(null==state_name&&(state_name=DisplayService.getStateNameByNodeName(parent_node?parent_node.name:"")),parent_node&&node.name==parent_node.name)handleNode();else switch(node.name){case composeConsts.documentation_tree_nodes.APPENDIX_NODE.node_name:case composeConsts.documentation_tree_nodes.APPENDIX_DATABASES_NODE.node_name:case composeConsts.documentation_tree_nodes.APPENDIX_SOURCE_DATABASES_NODE.node_name:case composeConsts.documentation_tree_nodes.APPENDIX_DWH_DATABASES_NODE.node_name:DisplayService.setNavigationItems(node,null);break;case composeConsts.documentation_tree_nodes.APPENDIX_GLOBAL_SETTINGS_NODE.node_name:break;default:null!=parent_node&&handleNode()}$state.transitionTo(state_name,{entityName:node.name})}}])}(angular);