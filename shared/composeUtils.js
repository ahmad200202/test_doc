!function(angular){"use strict";var composeCommonServices=angular.module(window.AppName+".commonServices");composeCommonServices.factory(composeConsts.Srvcs.composeUtils,["$filter","$timeout",function($filter,$timeout){var composeUtils={treeControlOptions:{nodeChildren:"children",dirSelectable:!0,expandedProp:"isExpanded",idProp:"node_id",injectClasses:{ul:"a1",li:"a2",liSelected:"a7",iExpanded:"a3",iCollapsed:"a4",iLeaf:"a5",label:"a6",labelSelected:"none"}},isCtrlPressed:function($event){return $event&&$event.ctrlKey||Utils.isDebugMode()},handleMenuNotClosing:function($event){null!=$event&&null!=$event.currentTarget&&$timeout(function(){angular.element($event.currentTarget).parents("ul").trigger("click")},100)},removeUndefinedItemsFromArray:function(arr){return null==arr&&(arr=[]),arr.filter(function(it){return null!=it&&void 0!=it})},getIsDWHEtl:function(etl_type){return etl_type==DO.ETLType.DataWarehouse||etl_type==DO.ETLType.DataWarehouse_CDC},getDataMartTypes:function(){return angular.copy(DO.DmTableType)},getStarSchemaDimensionType:function(fact_dim){if(null==fact_dim)return null;var fact_dim_type=composeConsts.StarSchemaTypes.TRANSACTIONAL,is_dimension=fact_dim[DO.FactDimDto.type]==DO.DmTableType.DIMENSION,is_virtual=fact_dim[DO.FactDimDto.is_virtual],ret_type=null;return is_dimension?fact_dim[DO.TreeNode.history_type]==DO.HistoryType.S?fact_dim_type=composeConsts.DimensionsTypes.TYPE_1:fact_dim[DO.TreeNode.history_type]==DO.HistoryType.N&&(fact_dim_type=composeConsts.DimensionsTypes.TYPE_2):fact_dim_type=fact_dim[DO.TreeNode.is_aggregated_fact]?composeConsts.StarSchemaTypes.AGGREGATED:fact_dim[DO.TreeNode.history_type]==DO.FactType.T?composeConsts.StarSchemaTypes.TRANSACTIONAL:composeConsts.StarSchemaTypes.STATE_ORIENTED,is_dimension?ret_type=$filter("filter")(angular.copy(composeConsts.DimensionsTypesObjects),{type:fact_dim_type},!0):(ret_type=$filter("filter")(angular.copy(composeConsts.StarSchemaObjects),{type:fact_dim_type},!0),is_virtual&&(ret_type[0][DO.FactDimDto.display_name]=ret_type[0][DO.FactDimDto.display_name]+" (Virtual Fact)")),ret_type[0]},getPropFromFactDim:function(one_fact_dim,prop){var ret=null;return null!=one_fact_dim&&(ret=one_fact_dim[prop]),ret},getFactDimFormFactsDimsArrayByIndex:function(facts_dims_array,index){var ret=null;return facts_dims_array&&facts_dims_array.length>0&&index<=facts_dims_array.length&&(ret=facts_dims_array[index]),ret},getFactDimData:function(one_fact_dim){var ret=[];return null!=one_fact_dim&&(ret=composeUtils.getPropFromFactDim(one_fact_dim,DO.FactDimInfo.fact_dim_data)),ret},getFactDimDataType:function(fact_dim){return fact_dim[DO.FactDimDto.type]},getFactDimColumns:function(one_fact_dim){var columns=composeUtils.getFactDimData(one_fact_dim)[DO.FactDimDto.fact_dim_columns];return ArrayUtils.each(columns,function(col){composeUtils.addUIDataTypeField(col)}),columns},getPhysicalProperties:function(one_fact_dim){return composeUtils.getFactDimData(one_fact_dim)[DO.FactDimDto.physical_properties]},getIsAggregated:function(fact_dim){return null!=fact_dim&&(fact_dim[DO.FactDimDto.type]===DO.DmTableType.AGGREGATED_FACT||fact_dim[DO.FactDimDto.is_aggregated_fact])},getIsFact:function(fact_dim){return null!=fact_dim&&(fact_dim[DO.FactDimDto.type]===DO.DmTableType.FACT||fact_dim[DO.FactDimDto.type]===DO.DmTableType.AGGREGATED_FACT)},getIsDimension:function(fact_dim){return null!=fact_dim&&fact_dim[DO.FactDimDto.type]===DO.DmTableType.DIMENSION},getFactDimID:function(fact_dim){var ret=0;return ret=null!=fact_dim?fact_dim[DO.FactDimDto.id]:0},getFactPath:function(fact_dim){var path="";return null!=fact_dim&&fact_dim[DO.FactDimInfo.fact_dim_data]&&(path=fact_dim[DO.FactDimInfo.fact_dim_data][DO.FactDimDto.txdate_path]),path},getFactKey:function(fact_dim){var key=DO.FactDimDto_Defaults.datamart_id;return null!=fact_dim&&fact_dim[DO.FactDimInfo.fact_dim_data]&&(key=fact_dim[DO.FactDimInfo.fact_dim_data][DO.FactDimDto.id]),key},getIsHistoryType1:function(fact_dim){return null!=fact_dim&&fact_dim[DO.FactDimDto.history_type]==DO.HistoryType.N},isOIDAtt:function(node_name){return""!=node_name&&node_name.toLowerCase().indexOf(composeConsts.SpecialColumn_OID.toLowerCase())>-1},isVIDAtt:function(node_name){return""!=node_name&&node_name.toLowerCase().indexOf(composeConsts.SpecialColumn_VID.toLowerCase())>-1},isSpecialAttribute:function(node_name){return!composeUtils.isOIDAtt(node_name)&&!composeUtils.isVIDAtt(node_name)},getFactFromFactsDimArray:function(facts_dims){var facts=[];return facts_dims&&(facts=facts_dims.filter(function(it){return composeUtils.getIsFact(it[DO.FactDimInfo.fact_dim_data])})),facts.forEach(function(fact){fact.ui_prop_fact_dim_type=composeUtils.getStarSchemaDimensionType(composeUtils.getFactDimData(fact))}),facts},getDimensionFromFactsDimArray:function(facts_dims){var dimensions=[];return facts_dims&&(dimensions=facts_dims.filter(function(it){return composeUtils.getIsDimension(it[DO.FactDimInfo.fact_dim_data])})),dimensions},getFactDisplayName:function(fact_dim,default_name){var ret="";return null==fact_dim?ret:(fact_dim[DO.FactDimDto.type]==DO.DmTableType.FACT||fact_dim[DO.FactDimDto.type]==DO.DmTableType.AGGREGATED_FACT?""!=fact_dim[DO.FactDimDto.view_name]&&null!=fact_dim[DO.FactDimDto.view_name]?ret=fact_dim[DO.FactDimDto.view_name]:""!=default_name&&null!=default_name&&(ret=default_name):ret=fact_dim[DO.FactDimDto.display_name],(""==ret||null==ret)&&(ret=fact_dim[DO.FactDimDto.name]),ret)},createDisplayNode:function(display_name,type,id,data){return{display_name:display_name,id:id,type:type,data:data}},addUIDataTypeField:function(col){col[composeConsts.UI_PROPS2.ui_prop_data_type]=$filter("columnTypeDisplayFilterByProps")(col.data_type,col.size,col.scale)},getWorkFlowTaskHasDwhFullLoad:function(task_obj,searchCallback){var full_load=!1;if(task_obj&&task_obj[composeConsts.UI_PROPS.__FULL_TASK__]&&task_obj[composeConsts.UI_PROPS.__FULL_TASK__][DO.TaskMonitorData.executor_status]&&task_obj[composeConsts.UI_PROPS.__FULL_TASK__][DO.TaskMonitorData.executor_status][DO.FlowExecutorDetailedStatus.light_flow_definition]&&task_obj[composeConsts.UI_PROPS.__FULL_TASK__][DO.TaskMonitorData.executor_status][DO.FlowExecutorDetailedStatus.light_flow_definition][DO.FlowDto.flow_nodes]){var flow_nodes=task_obj[composeConsts.UI_PROPS.__FULL_TASK__][DO.TaskMonitorData.executor_status][DO.FlowExecutorDetailedStatus.light_flow_definition][DO.FlowDto.flow_nodes],etls=Object.keys(flow_nodes).map(function(it){return flow_nodes[it]});full_load=etls.filter(function(it){var task_has_dwh_full_load=!1;return searchCallback&&(task_has_dwh_full_load=searchCallback(it.id)),task_has_dwh_full_load}).length>0}return full_load},getNodesAndEdges:function(retData,landing_info,attribute_name,internal_name,initial_entity){return null==retData&&(retData={nodes:[],edges:[],node_id_counter:0}),retData.nodes.push(initial_entity),ArrayUtils.each(landing_info,function(item){var source_node=null,mapping_node=null,landings_node=null,task_node=null;if(null!=item.replicate_source&&""!=item.replicate_source&&(source_node=composeUtils.createDisplayNode(item.replicate_source,Lineage.LineageTypes.ReplicateSource.type,++retData.node_id_counter,{replicate_source:item.replicate_source}),retData.nodes.push(source_node)),null!=item.replicate_task&&""!=item.replicate_task&&(task_node=composeUtils.createDisplayNode(item.replicate_task,Lineage.LineageTypes.ReplicateTask.type,++retData.node_id_counter,{replicate_task:item.replicate_task}),retData.nodes.push(task_node)),null!=item.landing_db&&""!=item.landing_db){var schema=null!=item.mapping_info&&""!=item.mapping_info.schema?item.mapping_info.schema+".":"",landing_attribute_name=attribute_name;if(item.mapping_info&&item.mapping_info.mapping_fields){var node=ArrayUtils.find(item.mapping_info.mapping_fields,function(it){return it.staging_col_name_int===internal_name});node&&(landing_attribute_name=node.source_col_name)}var name=item.landing_db+Lineage.NodeDisplayNameSeperator+schema+item.mapping_info.table_name+Lineage.NodeDisplayNameSeperator+landing_attribute_name;landings_node=composeUtils.createDisplayNode(name,Lineage.LineageTypes.Landing.type,++retData.node_id_counter,{database_id:item.original_source_db_id,table_name:item.mapping_info.table_name,name:item.landing_db}),retData.nodes.push(landings_node)}null!=item.mapping_info&&""!=item.mapping_info.name&&(mapping_node=composeUtils.createDisplayNode(item.mapping_info.name,Lineage.LineageTypes.Mappings.type,++retData.node_id_counter,item.mapping_info),mapping_node.clickable=item.mapping_info.id>0,retData.nodes.push(mapping_node)),source_node&&task_node&&retData.edges.push({source:source_node,target:task_node}),task_node&&landings_node&&retData.edges.push({source:task_node,target:landings_node}),landings_node&&mapping_node&&retData.edges.push({source:landings_node,target:mapping_node}),mapping_node&&initial_entity&&retData.edges.push({source:mapping_node,target:initial_entity})}),retData},convertCustomETLNameToType:function(name){switch(name){case composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.MULTI_TABLE_ETL:return DO.CustomeETLType.PreStaging;case composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.PRE_LOADING_ETL:return DO.CustomeETLType.PreDWH;case composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.SINGLE_TABLE_ETL:return DO.CustomeETLType.PostStaging;case composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.POST_LOADING_ETL:return DO.CustomeETLType.PostDWH;case composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.PRE_LOADING:return DO.CustomeETLType.PreDataMart;case composeConsts.ETL_CUSTOM_ETL_NODES_NAMES.POST_LOADING:return DO.CustomeETLType.PostDataMart}},getDMLineageDisplayData:function(data,dm){var display_name_title=null!=dm.display_name&&""!=dm.display_name?dm.display_name:"",table_name_title=null!=dm.table_name&&""!=dm.table_name?dm.table_name:"",attribute_name_title=null!=dm.attribute_name&&""!=dm.attribute_name?dm.attribute_name:"",attribute_internal_name=data.attribute_internal_name,data_attribute_name=null!=dm.attribute_name&&""!=dm.attribute_name?dm.attribute_name:"",title=String.format("{0}{1}{2}",table_name_title,Lineage.TitleDisplayNameSeperator,attribute_name_title),nodesAndEdges={nodes:[],edges:[],node_id_counter:0,title:title};if(ArrayUtils.each(data,function(item_data){var attribute_name=null!=item_data&&""!=item_data.attribute_name&&null!=item_data.attribute_name?Lineage.NodeDisplayNameSeperator+item_data.attribute_name:"",entityName=null!=item_data?item_data.entity_name:"",entity=composeUtils.createDisplayNode(entityName+attribute_name,Lineage.LineageTypes.Entity.type,++nodesAndEdges.node_id_counter,{entity_name:entityName,attribute_name:null!=item_data?item_data.attribute_name:""});composeUtils.getNodesAndEdges(nodesAndEdges,item_data[DO.DWHLineageInfo.landing_info],attribute_name,attribute_internal_name,entity)}),""!=dm.data_mart_name){var display_name_arr=[data_attribute_name,display_name_title,table_name_title,attribute_name_title],dm_node=composeUtils.createDisplayNode(display_name_arr.join(Lineage.NodeDisplayNameSeperator),Lineage.LineageTypes.DataMarts.type,++nodesAndEdges.node_id_counter,{data_mart_name:dm.data_mart_name,data_mart_id:dm.data_mart_id,data_mart_type:dm.data_mart_type,table_name:dm.display_name});dm_node.clickable=dm.data_mart_id>0,dm_node.is_virtual=dm.is_virtual,nodesAndEdges.nodes.push(dm_node);var entities=ArrayUtils.filter(nodesAndEdges.nodes,function(item){return item.type==Lineage.LineageTypes.Entity.type});ArrayUtils.each(entities,function(item){nodesAndEdges.edges.push({source:item,target:dm_node})})}return nodesAndEdges},getDWHLineageDisplayData:function(data,entity_name){var nodesAndEdges={nodes:[],edges:[],node_id_counter:0,title:entity_name},attribute_name=null!=data.attribute_name&&""!=data.attribute_name?Lineage.NodeDisplayNameSeperator+data.attribute_name:"",attribute_internal_name=data.attribute_internal_name,entity=composeUtils.createDisplayNode(data.entity_name+attribute_name,Lineage.LineageTypes.Entity.type,++nodesAndEdges.node_id_counter,{entity_name:data.entity_name,attribute_name:data.attribute_name});return composeUtils.getNodesAndEdges(nodesAndEdges,data[DO.DWHLineageInfo.landing_info],attribute_name,attribute_internal_name,entity),ArrayUtils.each(data[DO.DWHLineageInfo.datamarts],function(dm){var node=null;if(""!=dm.data_mart_name){var display_name_arr=[dm.data_mart_name,dm.display_name,dm.table_name,dm.attribute_name];node=composeUtils.createDisplayNode(display_name_arr.join(Lineage.NodeDisplayNameSeperator),Lineage.LineageTypes.DataMarts.type,++nodesAndEdges.node_id_counter,{data_mart_name:dm.data_mart_name,data_mart_id:dm.data_mart_id,data_mart_type:dm.data_mart_type,table_name:dm.display_name}),node.clickable=dm.data_mart_id>0,node.is_virtual=dm.is_virtual,nodesAndEdges.nodes.push(node),nodesAndEdges.edges.push({source:entity,target:node})}}),nodesAndEdges},createStarSchemaDisplayNodes:function(facts,dimensions,name_prop,id_prop){var star_schemas=[],node_idx=0,date_and_time_dims=$filter("filter")(dimensions,{is_date_checked:!0,is_time_checked:!0}),grouped_date_time_dims=$filter("groupBy")(date_and_time_dims,name_prop),date_dims=dimensions.filter(function(it){return it.is_date_checked&&-1==date_and_time_dims.indexOf(it)}),time_dims=dimensions.filter(function(it){return it.is_time_checked&&-1==date_and_time_dims.indexOf(it)});return angular.forEach(grouped_date_time_dims,function(val){2==val.length&&(val[0][DO.TreeNode.caption]=String.format("{0} {1}",val[0][DO.TreeNode.caption],composeConsts.DateTimeDimenstionPostFix.Time),val[1][DO.TreeNode.caption]=String.format("{0} {1}",val[1][DO.TreeNode.caption],composeConsts.DateTimeDimenstionPostFix.Date))}),angular.forEach(date_dims,function(item){item[DO.TreeNode.caption]=String.format("{0} {1}",item[DO.TreeNode.caption],composeConsts.DateTimeDimenstionPostFix.Date)}),angular.forEach(time_dims,function(item){item[DO.TreeNode.caption]=String.format("{0} {1}",item[DO.TreeNode.caption],composeConsts.DateTimeDimenstionPostFix.Time)}),ArrayUtils.each(facts,function(item){var nodes=[],edges=[],fact_id=id_prop&&item[id_prop]?item[id_prop]:++node_idx,fact_node=composeUtils.createDisplayNode(item[name_prop],item.type,fact_id,item);fact_node.class="starSchemaFact",fact_node.width=265,fact_node.height=60,fact_node.shape=AttuGraph.shapes.StarSchemaFact,nodes.push(fact_node),ArrayUtils.each(dimensions,function(dim_item){var dim_id=id_prop&&dim_item[id_prop]?dim_item[id_prop]:++node_idx,dimension_node=composeUtils.createDisplayNode(dim_item[name_prop],dim_item.type,dim_id,dim_item);dimension_node.class="starSchemaDimension",dimension_node.width=265,dimension_node.height=60,dimension_node.is_shared=null!=dim_item.linked_entities&&dim_item.linked_entities.length>1,dimension_node.linked_entities=dim_item.linked_entities||[],dimension_node.de_normalized_entities=[];var de_normalized_entities=[];try{composeUtils.getNodesByCategories(dim_item,[DO.TreeNodeCategory.DENORMALIZED,DO.TreeNodeCategory.INDEPENDENT_AND_DENORMALIZED],de_normalized_entities);var self_node=de_normalized_entities.filter(function(it){return it.node_id==dimension_node.data.node_id});1==self_node.length&&de_normalized_entities.splice(de_normalized_entities.indexOf(self_node[0],1))}catch(err){dimension_node.de_normalized_entities=de_normalized_entities}dimension_node.de_normalized_entities=de_normalized_entities.filter(function(dim){return dim.is_checked&&dim.is_dimension}),dimension_node.shape=AttuGraph.shapes.StarSchemaDimension,nodes.push(dimension_node),edges.push({source:fact_node,target:dimension_node})}),star_schemas.push({nodes:nodes,edges:edges})}),star_schemas},getNodesByCategories:function(tree,catgories,result){if(null==catgories||0==catgories.length)return result;if(catgories.indexOf(tree.category)>-1&&tree.type.indexOf("TV_TBL")>-1&&result.push(tree),tree.children)for(var k=0;k<tree.children.length;k++)composeUtils.getNodesByCategories(tree.children[k],catgories,result)},prepareDataForGraphDisplay:function(data){var converted_data=[];try{angular.forEach(data.entities,function(item){var entTables=$filter("filter")(item.table_columns_ext,{is_fk:!0},!0),itemData={node_id:item.name,node_name:item.name,item_id:item.id,is_self_ref:entTables.length>0&&$filter("filter")(item.attributes,{name:item.name},!0).length>0,time_model_entity_id:item.time_model_entity_id,is_reference_entity:item.is_reference_entity,attributes:item.attributes,table_columns_ext:item.table_columns_ext,foreign_keys:$filter("filter")(item.table_columns_ext,{is_fk:!0,is_primary:!1},!0),primary_keys:$filter("filter")(item.table_columns_ext,{is_primary:!0},!0),children:[]};angular.forEach(entTables,function(table_item){itemData.children.push(table_item.entity.name)}),converted_data.push(itemData)}),angular.forEach(converted_data,function(item){angular.forEach(item.foreign_keys,function(fk_item){fk_item[composeConsts.UI_PROPS.ui_prop_display_name]="("+composeConsts.FK_Prefix+") "+fk_item.entity.name,fk_item[composeConsts.UI_PROPS_FOR_DISPLAY.ui_prop_attribute_with_prefix_display_name]=fk_item.entity.name}),angular.forEach(item.primary_keys,function(pk_item){var filtered_item=$filter("filter")(data.entities,{id:pk_item.pbe}),name="";name=null==pk_item.domainAttribute&&null==pk_item.entity?filtered_item[0].name:null==pk_item.domainAttribute||""==pk_item.domainAttribute.name?pk_item.entity.name:pk_item.domainAttribute.name;var pk_str=pk_item.is_primary?"("+composeConsts.PK_Prefix+") ":"",fk_str=pk_item.is_fk?"("+composeConsts.FK_Prefix+") ":"";pk_item[composeConsts.UI_PROPS.ui_prop_display_name]=pk_str+fk_str+name,pk_item[composeConsts.UI_PROPS_FOR_DISPLAY.ui_prop_attribute_with_prefix_display_name]=name})})}catch(err){converted_data=[]}return converted_data},recurseTree:function(tree,pridecate,paths,ids){if(tree&&(pridecate(tree,paths,ids),tree.children))for(var i=0;i<tree.children.length;i++)composeUtils.recurseTree(tree.children[i],pridecate,paths+"::"+tree.children[i].caption,ids+"::"+tree.children[i].node_id)},filterTree:function(item,filter_predicate){var ret_predicate=!1;if(filter_predicate&&(ret_predicate=filter_predicate(item)),ret_predicate)return ret_predicate;if(item.children){for(var res=!1,i=0;i<item.children.length;i++)res=res||composeUtils.filterTree(item.children[i],filter_predicate);return res}return!1},getEntitiesRelationsByEntity:function(root_entity,entities){var erd_entities=[],recurse=function(ent_ent){return erd_entities.push(ent_ent),angular.forEach(ent_ent.table_columns_ext,function(att){if(att.is_fk){var the_table=entities.filter(function(ent){return ent.id==att.entity.id&&-1==erd_entities.indexOf(ent)});the_table&&1==the_table.length&&recurse(the_table[0])}}),null};return recurse(root_entity),erd_entities},getDimensionSharedStarSchemas:function(linked_entities,star_schemas){var ret=[];return angular.forEach(linked_entities,function(linked_entity_id){var used_in=star_schemas.filter(function(star){return star.id==linked_entity_id});1==used_in.length&&star_schemas.length>1&&ret.push(used_in[0])}),ret},getGeneratedScripsFromResp:function(resp){var created_scripts=[];return null!=resp&&resp.hasOwnProperty(DO.BaseDDLResp.generated_scripts)&&(created_scripts=resp[DO.BaseDDLResp.generated_scripts]),created_scripts},getReusableTransformationsUsage:function(usage_list){var ret=[];return angular.forEach(usage_list,function(item){var item_obj={entity:"",attribute:"",object_name:"",object_type:"",expression:item.expression,item_data:item};switch(item.$type){case DO.Objects.UsageInDerivedAttribute:var attr_name=item.table_column_ext.domainAttribute.name;""!=item.table_column_ext.attribute_name&&null!=item.table_column_ext.attribute_name&&(attr_name+=String.format(" ({0})",item.table_column_ext.attribute_name)),item_obj.entity=item.entity.name,item_obj.attribute=attr_name,item_obj.object_type=composeConsts.DocumentationTexts.Derived_Attribute_Text;break;case DO.Objects.UsageInMappingFilter:case DO.Objects.UsageInMappingColumnLookup:case DO.Objects.UsageInMappingColumnExpression:item.$type==DO.Objects.UsageInMappingColumnExpression?item_obj.object_type=composeConsts.DocumentationTexts.Column_Mapping_Text:item.$type==DO.Objects.UsageInMappingColumnLookup?(item_obj.object_type=composeConsts.DocumentationTexts.Mapping_Lookup_Text,item_obj.object_type+=item.is_condition?String.format(" ({0})",composeConsts.DocumentationTexts.Condition_Text):String.format(" ({0})",composeConsts.DocumentationTexts.ResultColumn_Text)):item.$type==DO.Objects.UsageInMappingFilter&&(item_obj.object_type=composeConsts.DocumentationTexts.Mapping_Filter_Text),item_obj.object_name=item[DO.UsageInMapping.mapping][DO.MappingDto.name],item_obj.entity=item[DO.UsageInMapping.entity][DO.EntityDto.name],(item.$type==DO.Objects.UsageInMappingColumnExpression||item.$type==DO.Objects.UsageInMappingColumnLookup)&&(item_obj.attribute=item[DO.UsageInMappingColumnExpression.column_display_name]);break;case DO.Objects.UsageInMappingDataQuality:case DO.Objects.UsageInMappingDataCleansing:item.$type==DO.Objects.UsageInMappingDataQuality?item_obj.object_type=String.format("{0} {1}",composeConsts.DocumentationTexts.Mapping_Text,composeConsts.DocumentationTexts.Data_Validation_Rules_Text):item.$type==DO.Objects.UsageInMappingDataCleansing&&(item_obj.object_type=String.format("{0} {1}",composeConsts.DocumentationTexts.Mapping_Text,composeConsts.DocumentationTexts.Data_Cleansing_Rules_Text),item_obj.object_type+=item.is_condition?String.format(" ({0})",composeConsts.DocumentationTexts.Condition_Text):String.format(" ({0})",composeConsts.DocumentationTexts.Correction_Text)),item_obj.object_name=String.format("{0}.{1}",item[DO.UsageInMapping.mapping][DO.MappingDto.name],item[DO.UsageInMappingDataCleansing.rule_name]),item_obj.entity=item[DO.UsageInMapping.entity][DO.EntityDto.name];break;case DO.Objects.UsageInDataMartStarSchemaColumn:case DO.Objects.UsageInDataMartStarSchemaFilter:case DO.Objects.UsageInDataMartStarSchemaAggregateFilter:item_obj.object_name=String.format("{0}.{1}",item[DO.UsageInDataMartBase.datamart_info][DO.DataMartInfoDto.name],item[DO.UsageInDataMartBase.fact_dim][DO.FactDimDto.display_name]),item_obj.entity=item[DO.UsageInDataMartBase.fact_dim][DO.FactDimDto.name];var used_in_star_schema="",fact_type=composeUtils.getStarSchemaDimensionType(item[DO.UsageInDataMartBase.fact_dim]);item.$type==DO.Objects.UsageInDataMartStarSchemaColumn?(item_obj.entity=item[DO.UsageInDataMartBase.fact_dim][DO.FactDimDto.name],item_obj.attribute=item[DO.UsageInDataMartStarSchemaColumn.column_name],used_in_star_schema=composeConsts.DocumentationTexts.Column_Text):item.$type==DO.Objects.UsageInDataMartStarSchemaFilter?used_in_star_schema=composeConsts.DocumentationTexts.Filter_Text:item.$type==DO.Objects.UsageInDataMartStarSchemaAggregateFilter&&(used_in_star_schema=composeConsts.DocumentationTexts.Aggregation_Filter_Text),item_obj.object_type=String.format("{0} - {1} ({2}) {3}",composeConsts.DocumentationTexts.DataMart_Text,composeConsts.DocumentationTexts.Star_Schema_Text,fact_type.display_name,used_in_star_schema);break;case DO.Objects.UsageInDataMartDimensionFilter:case DO.Objects.UsageInDataMartDimensionColumn:item_obj.object_name=String.format("{0}.{1}",item[DO.UsageInDataMartBase.datamart_info][DO.DataMartInfoDto.name],item[DO.UsageInDataMartBase.fact_dim][DO.FactDimDto.display_name]),item_obj.entity=item[DO.UsageInDataMartBase.fact_dim][DO.FactDimDto.display_name];var dim_type=composeUtils.getStarSchemaDimensionType(item[DO.UsageInDataMartBase.fact_dim]),used_in_dimension="";item.$type==DO.Objects.UsageInDataMartDimensionColumn?(item_obj.attribute=item[DO.UsageInDataMartDimensionColumn.column_name],used_in_dimension=composeConsts.DocumentationTexts.Column_Text):item.$type==DO.Objects.UsageInDataMartDimensionFilter&&(used_in_dimension=composeConsts.DocumentationTexts.Filter_Text),item_obj.object_type=String.format("{0} - {1} ({2}) {3}",composeConsts.DocumentationTexts.DataMart_Text,composeConsts.DocumentationTexts.Dimension_Text,dim_type.display_name,used_in_dimension);break;case DO.Objects.UsageInTransformation:item_obj.object_name=item[DO.UsageInTransformation.transformation_name],item_obj.object_type=composeConsts.DocumentationTexts.Transformation_Text}ret.push(item_obj)}),ret},createReusableTransformationGroupForExpressionBuilder:function(reusable_transformation_list){ArrayUtils.sort(reusable_transformation_list,function(x,y){return x.name<y.name?-1:x.name>y.name?1:0});var grouped=$filter("groupBy")(reusable_transformation_list,DO.ReusableTransformation.category),ReusableTransformationCategory=Utils.mergeValuedObjToDefaultValuedObj({},DO.Objects.expression_editor_category);return ReusableTransformationCategory[DO.expression_editor_category.name]=composeConsts.ManipulationFilters.ReusableTransformations.name,angular.forEach(grouped,function(val,key){var grp=Utils.mergeValuedObjToDefaultValuedObj({},DO.Objects.expression_editor_group);grp[DO.expression_editor_group.name]=key,angular.forEach(val,function(item){if(""!=item[DO.ReusableTransformation.expression_statement]){var name=String.format("{0}{1}{2}{3}",composeConsts.REUSABLE_TRANSFORMATIONS_PREFIX,"{",item[DO.ReusableTransformation.name],"}"),aliasParams="";angular.forEach(item[DO.ReusableTransformation.params],function(ap){aliasParams+=String.format("{0}{1}{2}{3}","${",ap[DO.ReusableTransformationParam.alias_name],"}",",")}),aliasParams=aliasParams.trim(),1==Utils.strEndsWith(aliasParams,",")&&(aliasParams=aliasParams.substring(0,aliasParams.length-1)+"");var grp_item=Utils.mergeValuedObjToDefaultValuedObj({},DO.Objects.expression_editor_item);grp_item[DO.expression_editor_item.name]=String.format("{0}({1})",name,item[DO.ReusableTransformation.params].length>0?aliasParams:""),grp_item[DO.expression_editor_item.description]=item[DO.ReusableTransformation.description],grp[DO.expression_editor_group.items].push(grp_item)}}),ReusableTransformationCategory[DO.expression_editor_category.groups].push(grp)}),ReusableTransformationCategory},setItemsInEditMode:function(items,full_edit,partial_edit){null!=items&&angular.forEach(items,function(item){item[composeConsts.UI_PROPS2.ui_prop_is_full_edit_mode]=full_edit,item[composeConsts.UI_PROPS2.ui_prop_is_partial_edit_mode]=partial_edit})},focusOnFirstInput:function(selector){},setAsNewItem:function(items,is_new){null!=items&&angular.forEach(items,function(item){item[composeConsts.UI_PROPS2.ui_prop_is_new_item]=is_new})},getEntityNameFromPath:function(attribute_name,table_path){var ret={ui_prop_name:"",ui_prop_entity_name:"",ui_prop_path:""};ret.ui_prop_name=attribute_name,ret.ui_prop_entity_name=table_path?ArrayUtils.last(table_path.split(".")):"";var tablePathArr=table_path.split("."),idx=tablePathArr.indexOf(ret.ui_prop_entity_name);return idx>-1&&tablePathArr.splice(idx,1),ret.ui_prop_path=tablePathArr.join("."),ret},getHistoryTypes:function(is_primary,current_history_type,current_block_number){var ret={history_types:[],history_type:current_history_type,block_number:current_block_number};return is_primary?ArrayUtils.appendArrayToArray(ret.history_types,[{type:DO.HistoryType.N,name:DO.HistoryType_displayNames[DO.HistoryType.N]}]):ret.history_types=Object.keys(DO.HistoryType_displayNames).map(function(key){return{type:key,name:DO.HistoryType_displayNames[key]}}),is_primary&&(ret.history_type=DO.HistoryType.N),ret.history_type==DO.HistoryType.N&&(ret.block_number=0),ret},getBlockNumberAfterHistoryTypeChanged:function(type){var block=0;switch(type){case DO.HistoryType.N:block=0;break;case DO.HistoryType.S:block=1}return block},getSelectedAttributeDomainFromTableColumn:function(attributes_domain,table_column_ext){var att=null,filtered=$filter("filter")(attributes_domain,{id:table_column_ext[DO.TableColumnExtended.pbe]});return filtered&&filtered.length>0&&(att=ArrayUtils.first(filtered)),att},exportToCSV:function(file_name,items,csv_props){var csv_data=[];return csv_data.push(csv_props.map(function(it){return it.display_name})),angular.forEach(items,function(item){for(var temp_row=[],i=0;i<csv_props.length;i++){var prop=csv_props[i],ret="";angular.isFunction(prop.convertFunc)&&prop.convertFunc?ret=prop.convertFunc(item):(ret=ObjectUtils.propsByString(item,prop.csvProps.join(".")),(void 0==ret||null==ret)&&(ret="")),temp_row.push(ret)}csv_data.push(temp_row)}),$timeout(function(){Utils.exportToCsv(file_name,csv_data)},0),csv_data},isDefaultWorkFlow:function(workflow_name){return null!=workflow_name&&(workflow_name.toLowerCase()===composeConsts.DEFAULT_WORKFLOW_NAME.toLocaleLowerCase()||workflow_name.toLowerCase()===composeConsts.DEFAULT_CDC_WORKFLOW_NAME.toLocaleLowerCase())},deleteUIProps:function(items){if(null!=items){var props=Object.keys(composeConsts.UI_PROPS);angular.forEach(composeUtils.removeUndefinedItemsFromArray(items),function(item){angular.forEach(props,function(prop){delete item[composeConsts.UI_PROPS[prop]]})})}},deleteUIProps2:function(items){if(null!=items){var props=Object.keys(composeConsts.UI_PROPS2);angular.forEach(composeUtils.removeUndefinedItemsFromArray(items),function(item){angular.forEach(props,function(prop){delete item[composeConsts.UI_PROPS2[prop]]})})}},getNewOrdinal:function(att_list,selected_item,arrangeList,custom_ordinal_prop){var selected_ordinal=0,ordinal_number=0,ordinal_prop="ordinal";if(null!=custom_ordinal_prop&&""!=custom_ordinal_prop&&(ordinal_prop=custom_ordinal_prop),null!=selected_item&&(selected_ordinal=selected_item[ordinal_prop]),0==selected_ordinal){ordinal_number=consts.OrdinalSpace;for(var i=0;i<att_list.length;i++)att_list[i][ordinal_prop]>=ordinal_number&&(ordinal_number=att_list[i][ordinal_prop]+consts.OrdinalSpace)}else{var index=att_list.indexOf(selected_item);ordinal_number=att_list[index][ordinal_prop]+consts.OrdinalSpace,1==arrangeList&&this.arrangeList(att_list,index,custom_ordinal_prop)}return ordinal_number},arrangeList:function(att_list,index,custom_ordinal_prop,arrange_all){var ordinal_prop="ordinal";if(null!=custom_ordinal_prop&&""!=custom_ordinal_prop&&(ordinal_prop=custom_ordinal_prop),null==arrange_all||1!=arrange_all)for(var i=index+1;i<att_list.length;i++)att_list[i][ordinal_prop]=att_list[i][ordinal_prop]+consts.OrdinalSpace;else for(var start_ordinal=consts.OrdinalSpace,i=0;i<att_list.length;i++)att_list[i][ordinal_prop]=start_ordinal,start_ordinal+=consts.OrdinalSpace},canChangeItemsOrder:function(full_list,selected_item,direction,prop_name_to_compare){var row_idx=-1;return direction==consts.Directions.UP||direction==consts.Directions.FIRST?(angular.forEach(full_list,function(item,idx){item[prop_name_to_compare]==selected_item[0][prop_name_to_compare]&&(row_idx=idx)}),0!=row_idx):(angular.forEach(full_list,function(item,idx){selected_item.length>1?item[prop_name_to_compare]==selected_item[selected_item.length-1][prop_name_to_compare]&&(row_idx=idx):item[prop_name_to_compare]==selected_item[0][prop_name_to_compare]&&(row_idx=idx)}),row_idx!=full_list.length-1)},changeItemsOrder:function(full_list,selected_items,direction,prop_name_to_compare,prop_name_to_order,find_index_func){var continueLoop=!0,row=null,index=0,temp_order="";if(direction==consts.Directions.UP){row=selected_items[0];for(var i=0;i<full_list.length&&continueLoop;i++)if(null!=full_list[i+1]&&full_list[i+1][prop_name_to_compare]==row[prop_name_to_compare]){for(var tempRow=full_list[i],j=0;j<selected_items.length;j++)full_list[i]=selected_items[j],i++;full_list[i]=tempRow,continueLoop=!1}if(""!=prop_name_to_order)for(var ordering=0,i=0;i<full_list.length;i++)ordering+=consts.OrdinalSpace,full_list[i][prop_name_to_order]=ordering}if(direction==consts.Directions.DOWN){row=selected_items[selected_items.length-1];for(var i=full_list.length;i>0&&continueLoop;i--)if(null!=full_list[i-2]&&full_list[i-2][prop_name_to_compare]==row[prop_name_to_compare]){for(var tempRow=full_list[i-1],j=selected_items.length;j>0;j--)full_list[i-1]=selected_items[j-1],i--;full_list[i-1]=tempRow,continueLoop=!1}if(""!=prop_name_to_order)for(var ordering=0,i=0;i<full_list.length;i++)ordering+=consts.OrdinalSpace,full_list[i][prop_name_to_order]=ordering
}if(direction==consts.Directions.FIRST){var row_order=0;if(1==selected_items.length){row=full_list[0],""!=prop_name_to_order&&(row_order=full_list[0][prop_name_to_order]),index=null!=find_index_func?find_index_func(selected_items[0]):full_list.indexOf(selected_items[0]),full_list[0]=angular.copy(selected_items[0]),""!=prop_name_to_order&&(full_list[0][prop_name_to_order]=row_order);for(var i=1;index+1>i;i++){var tempRow=full_list[i];""!=prop_name_to_order&&(temp_order=full_list[i][prop_name_to_order]),full_list[i]=row,""!=prop_name_to_order&&(full_list[i][prop_name_to_order]=temp_order),row=tempRow}}else{for(var multiple_index=[],first_items=[],i=0;i<selected_items.length;i++)index=null!=find_index_func?find_index_func(selected_items[i]):full_list.indexOf(selected_items[i]),multiple_index.push(index),first_items.push(full_list[index]);for(var last_items=[],i=0;i<full_list.length;i++){for(var found=!1,j=0;j<multiple_index.length;j++)multiple_index[j]==i&&(found=!0);0==found&&last_items.push(full_list[i])}for(var ordinal=consts.OrdinalSpace,i=0;i<first_items.length;i++)full_list[i]=angular.copy(first_items[i]),""!=prop_name_to_order&&(full_list[i][prop_name_to_order]=ordinal,ordinal+=consts.OrdinalSpace);for(var i=first_items.length,j=0;j<last_items.length;i++,j++)full_list[i]=angular.copy(last_items[j]),""!=prop_name_to_order&&(full_list[i][prop_name_to_order]=ordinal,ordinal+=consts.OrdinalSpace)}}if(direction==consts.Directions.LAST){var row_order=0;if(1==selected_items.length){row=full_list[full_list.length-1],""!=prop_name_to_order&&(row_order=full_list[full_list.length-1][prop_name_to_order]),index=null!=find_index_func?find_index_func(selected_items[0]):full_list.indexOf(selected_items[0]),full_list[full_list.length-1]=angular.copy(selected_items[0]),""!=prop_name_to_order&&(full_list[full_list.length-1][prop_name_to_order]=row_order);for(var i=full_list.length-2;i>index-1;i--){var tempRow=full_list[i];""!=prop_name_to_order&&(temp_order=full_list[i][prop_name_to_order]),full_list[i]=row,""!=prop_name_to_order&&(full_list[i][prop_name_to_order]=temp_order),row=tempRow}}else{for(var multiple_index=[],last_items=[],i=0;i<selected_items.length;i++)index=null!=find_index_func?find_index_func(selected_items[i]):full_list.indexOf(selected_items[i]),multiple_index.push(index),last_items.push(full_list[index]);for(var first_items=[],i=0;i<full_list.length;i++){for(var found=!1,j=0;j<multiple_index.length;j++)multiple_index[j]==i&&(found=!0);0==found&&first_items.push(full_list[i])}for(var ordinal=consts.OrdinalSpace,i=0;i<first_items.length;i++)full_list[i]=angular.copy(first_items[i]),""!=prop_name_to_order&&(full_list[i][prop_name_to_order]=ordinal,ordinal+=consts.OrdinalSpace);for(var i=0,j=first_items.length;i<last_items.length;i++,j++)full_list[j]=angular.copy(last_items[i]),""!=prop_name_to_order&&(full_list[j][prop_name_to_order]=ordinal,ordinal+=consts.OrdinalSpace)}}return full_list}};return composeUtils}])}(angular);