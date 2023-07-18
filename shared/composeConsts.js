window.composeConsts||(window.composeConsts={}),composeConsts.Ctrls={ManageDatabaseCtrl:"ManageDatabaseCtrl",ManageLogicalModelCtrl:"ManageLogicalModelCtrl",ManagePhysicalModelCtrl:"ManagePhysicalModelCtrl",ManageDWHCtrl:"ManageDWHCtrl",ManageDataMartCtrl:"ManageDataMartCtrl",ManageCommandTasksCtrl:"ManageCommandTasksCtrl",ManagePhysicalTablesCtrl:"ManagePhysicalTablesCtrl",DatabaseThumbActionCtrl:"DatabaseThumbActionCtrl",DataModelThumbActionCtrl:"DataModelThumbActionCtrl",DwhThumbActionCtrl:"DwhThumbActionCtrl",DataMartThumbActionCtrl:"DataMartThumbActionCtrl",MainProjectCtrl:"MainProjectCtrl",ProjectDesignerCtrl:"ProjectDesignerCtrl",ProjectMonitorCtrl:"ProjectMonitorCtrl",WorkFlowCtrl:"WorkFlowCtrl",WorkflowPopupCtrl:"WorkflowPopupCtrl",AppHeaderCtrl:"AppHeaderCtrl",AppCtrl:"AppCtrl",ETLEngineSettingsCtrl:"ETLEngineSettingsCtrl",LicenseCtrl:"LicenseCtrl",DeployCtrl:"DeployCtrl",ReportResultCtrl:"ReportResultCtrl",ProgressPopupCtrl:"ProgressPopupCtrl",ColumnsSelectionCtrl:"ColumnsSelectionCtrl",ComputedColumnsCtrl:"ComputedColumnsCtrl",DataMartCtrl:"DataMartCtrl",LookupCtrl:"LookupCtrl",DataQualityCtrl:"DataQualityCtrl",CustomETLEditorCtrl:"CustomETLEditorCtrl",MappingQueryEditorCtrl:"MappingQueryEditorCtrl",TableSelectionCtrl:"TableSelectionCtrl",MappingsCtrl:"MappingsCtrl",AttributesDomainCtrl:"AttributesDomainCtrl",GlobalMappingCtrl:"GlobalMappingCtrl",ReusableTransformationsCtrl:"ReusableTransformationsCtrl",ImportEntitiesCtrl:"ImportEntitiesCtrl",EngineMonitorCtrl:"EngineMonitorCtrl",ETLLoggingCtrl:"ETLLoggingCtrl",TaskHistoryCtrl:"TaskHistoryCtrl",ReplicateServersCtrl:"ReplicateServersCtrl",ManageDistributionKeysCtrl:"ManageDistributionKeysCtrl"},composeConsts.Srvcs={composeHttpInterceptor:"composeHttpInterceptor",composeUtils:"composeUtils",popupService:"popupService",ProjectService:"ProjectService",MainApplicationService:"MainApplicationService",AppSettingsService:"AppSettingsService",AppLicenseService:"AppLicenseService",AppSessionService:"AppSessionService",DatabaseService:"DatabaseService",DataModelService:"DataModelService",DataWarehouseService:"DataWarehouseService",DataMartService:"DataMartService",DataMartWizardService:"DataMartWizardService",MonitorService:"MonitorService",InspectService:"InspectService",ProgressMessagesService:"ProgressMessagesService",TableSelectionService:"TableSelectionService",MappingService:"MappingService",ETLService:"ETLService",LineageService:"LineageService",ExpressionBuilderWrapService:"ExpressionBuilderWrapService",SchedulerWrapService:"SchedulerWrapService",MappingDirectiveService:"mappingDirectiveService",WorkFlowServiceCoordinator:"WorkFlowServiceCoordinator"},composeConsts.DataMartSpecialColumns=[composeConsts.SpecialColumn_FROM_DATE,composeConsts.SpecialColumn_TO_DATE,composeConsts.SpecialColumn_VERSION_ID,composeConsts.SpecialColumn_OBJECT_ID,composeConsts.SpecialColumn_RUNNR,composeConsts.SpecialColumn_OBSOLETE,composeConsts.SpecialColumn_VID,composeConsts.SpecialColumn_OID],composeConsts.none={display_name:"",type:"",full_display_name:""},composeConsts.Bigint_type={display_name:DO.ACDataType_displayNames.Bigint,type:DO.ACDataType.Bigint,full_display_name:""},composeConsts.Byte_type={display_name:DO.ACDataType_displayNames.Byte,type:DO.ACDataType.Byte,full_display_name:""},composeConsts.Date_type={display_name:DO.ACDataType_displayNames.Date,type:DO.ACDataType.Date,full_display_name:""},composeConsts.DateTime_type={display_name:DO.ACDataType_displayNames.DateTime,type:DO.ACDataType.DateTime,full_display_name:""},composeConsts.Time_type={display_name:DO.ACDataType_displayNames.Time,type:DO.ACDataType.Time,full_display_name:""},composeConsts.Decimal_type={display_name:DO.ACDataType_displayNames.Decimal,type:DO.ACDataType.Decimal,full_display_name:""},composeConsts.GUID_type={display_name:DO.ACDataType_displayNames.GUID,type:DO.ACDataType.GUID,full_display_name:""},composeConsts.Integer_type={display_name:DO.ACDataType_displayNames.Integer,type:DO.ACDataType.Integer,full_display_name:""},composeConsts.Varchar_type={display_name:DO.ACDataType_displayNames.Varchar,type:DO.ACDataType.Varchar,full_display_name:""},composeConsts.NVarchar_type={display_name:DO.ACDataType_displayNames.NVarchar,type:DO.ACDataType.NVarchar,full_display_name:""},composeConsts.BigintAutoInc_type={display_name:DO.ACDataType_displayNames.Bigint,type:DO.ACDataType.BigIntAutoInc,full_display_name:""},composeConsts.String_type={display_name:DO.ACDataType_displayNames.String,type:DO.ACDataType.String,full_display_name:""},composeConsts.XML_type={display_name:DO.ACDataType_displayNames.XML,type:DO.ACDataType.XML,full_display_name:""},composeConsts.JSON_type={display_name:DO.ACDataType_displayNames.JSON,type:DO.ACDataType.JSON,full_display_name:""},composeConsts.All_Data_Types=[composeConsts.Bigint_type,composeConsts.Byte_type,composeConsts.Date_type,composeConsts.DateTime_type,composeConsts.Time_type,composeConsts.Decimal_type,composeConsts.GUID_type,composeConsts.Integer_type,composeConsts.Varchar_type,composeConsts.NVarchar_type,composeConsts.BigintAutoInc_type,composeConsts.String_type,composeConsts.XML_type,composeConsts.JSON_type],composeConsts.ComposeDataTypes=[{name:composeConsts.none.display_name,type:composeConsts.none.type,default_length:0,default_scale:0,max_length:0,max_scale:0},{name:composeConsts.Bigint_type.display_name,type:composeConsts.Bigint_type.type,default_length:0,default_scale:0,max_length:9999999,max_scale:0},{name:composeConsts.Byte_type.display_name,type:composeConsts.Byte_type.type,default_length:1,default_scale:-1,max_length:9999999,max_scale:0},{name:composeConsts.Date_type.display_name,type:composeConsts.Date_type.type,default_length:0,default_scale:0,max_length:0,max_scale:0},{name:composeConsts.DateTime_type.display_name,type:composeConsts.DateTime_type.type,default_length:0,default_scale:6,max_length:0,max_scale:9},{name:composeConsts.Time_type.display_name,type:composeConsts.Time_type.type,default_length:0,default_scale:0,max_length:0,max_scale:0},{name:composeConsts.Decimal_type.display_name,type:composeConsts.Decimal_type.type,default_length:18,default_scale:2,max_length:9999999,max_scale:999},{name:composeConsts.GUID_type.display_name,type:composeConsts.GUID_type.type,default_length:0,default_scale:0,max_length:0},{name:composeConsts.Integer_type.display_name,type:composeConsts.Integer_type.type,default_length:0,default_scale:0,max_length:9999999,max_scale:0},{name:composeConsts.Varchar_type.display_name,type:composeConsts.Varchar_type.type,default_length:50,default_scale:0,max_length:8e3,max_scale:0},{name:composeConsts.NVarchar_type.display_name,type:composeConsts.NVarchar_type.type,default_length:50,default_scale:0,max_length:4e3,max_scale:0},{name:composeConsts.String_type.display_name,type:composeConsts.String_type.type,default_length:50,default_scale:-1,max_length:8e3,max_scale:0},{name:composeConsts.XML_type.display_name,type:composeConsts.XML_type.type,default_length:50,default_scale:-1,max_length:8e3,max_scale:0},{name:composeConsts.JSON_type.display_name,type:composeConsts.JSON_type.type,default_length:0,default_scale:-1,max_length:8e3,max_scale:0}],composeConsts.ReplicateTaskURLFormat="https://{0}:{1}/attunityreplicate/#!/taskMonitoring/{2}",composeConsts.ProjectTimers={messages_interval:"MESSAGES_INTERVAL",project_status_interval:"PROJECT_STATUS_INTERVAL",project_monitor_status_interval:"PROJECT_MONITOR_STATUS_INTERVAL",task_monitor_interval:"TASK_MONITOR_INTERVAL",workflow_monitor_interval:"WORKFLOW_MONITOR_INTERVAL",project_task_history:"PROJECT_TASK_HISTORY",etl_logging:"ETL_LOGGING"},composeConsts.INSPECT_ITEM_COUNT=[{name:"10",count:10},{name:"100",count:100},{name:"1000",count:1e3},{name:"10000",count:1e4},{name:"All Rows",count:0}],composeConsts.REVISION_HISTORY_ITEM_COUNT=[{name:"Last 10 Revisions",count:10},{name:"Last 100 Revisions",count:100},{name:"All Revisions",count:0}],composeConsts.DEFAULT_INSPECT_ITEMS_COUNT=composeConsts.INSPECT_ITEM_COUNT[1],composeConsts.SpecialColumn_FROM_DATE="FROM_DATE",composeConsts.SpecialColumn_TO_DATE="TO_DATE",composeConsts.SpecialColumn_FD="FD",composeConsts.SpecialColumn_TD="TD",composeConsts.SpecialColumn_VERSION_ID="VERSION_ID",composeConsts.SpecialColumn_OBJECT_ID="OBJECT_ID",composeConsts.SpecialColumn_RUNNR="RUNNR",composeConsts.SpecialColumn_OBSOLETE="OBSOLETE",composeConsts.SpecialColumn_VID="_VID",composeConsts.SpecialColumn_OID="_OID",composeConsts.UI_PROPS={__FULL_TASK__:"__FULL_TASK__",__UNIQUE_ID__:"__UNIQUE_ID__",ui_prop_display_name:"ui_prop_display_name",ui_prop_statuses:"ui_prop_statuses",ui_prop_entity_status:"ui_prop_entity_status",ui_prop_task_id:"ui_prop_task_id",ui_prop_runtime_id:"ui_prop_runtime_id",ui_prop_task_state:"ui_prop_task_state",ui_prop_task_name:"ui_prop_task_name",ui_prop_task_type:"ui_prop_task_type",ui_prop_task_type_display_name:"ui_prop_task_type_display_name",ui_prop_secondary_task_type:"ui_prop_secondary_task_type",ui_prop_total_inserts:"ui_prop_total_inserts",ui_prop_total_updates:"ui_prop_total_updates",ui_prop_total_error_rows:"ui_prop_total_error_rows",ui_prop_total_tables_updated:"ui_prop_total_tables_updated",ui_prop_can_populate:"ui_prop_can_populate",ui_prop_dwh_full_load:"ui_prop_dwh_full_load",ui_prop_can_populate_message:"ui_prop_can_populate_message",ui_prop_progress_percentage:"ui_prop_progress_percentage",ui_prop_full_load_completed:"ui_prop_full_load_completed",ui_prop_replicate_cdc_mode:"ui_prop_replicate_cdc_mode",ui_prop_replicate_server_name:"ui_prop_replicate_server_name",ui_prop_replicate_task_name:"ui_prop_replicate_task_name",ui_prop_scheduling_str:"ui_prop_scheduling_str",ui_prop_scheduling_enabled:"ui_prop_scheduling_enabled",ui_prop_scheduled_job:"ui_prop_scheduled_job",ui_prop_local_next_run_date:"ui_prop_local_next_run_date",ui_prop_elapsed_time_str:"ui_prop_elapsed_time_str",ui_prop_start_time:"ui_prop_start_time",ui_prop_local_start_time:"ui_prop_local_start_time",ui_prop_end_time:"ui_prop_end_time",ui_prop_local_end_time:"ui_prop_local_end_time",ui_prop_elapsed_time_num:"ui_prop_elapsed_time_num",ui_prop_message:"ui_prop_message",ui_prop_errors_mart_list:"ui_prop_errors_mart_list",ui_prop_etl_commands_count:"ui_prop_etl_commands_count",ui_prop_max_running_threads:"ui_prop_max_running_threads",ui_prop_etl_commands_status:"ui_prop_etl_commands_status"},composeConsts.UI_PROPS2={ui_prop_unique_node_id:"ui_prop_unique_node_id",ui_prop_data_type:"ui_prop_data_type",ui_prop_data_type_obj:"ui_prop_data_type_obj",ui_prop_original_name:"ui_prop_original_name",ui_prop_source_col_display_name:"ui_prop_source_col_display_name",ui_prop_is_new_item:"ui_prop_is_new_item",ui_prop_is_full_edit_mode:"ui_prop_is_full_edit_mode",ui_prop_is_partial_edit_mode:"ui_prop_is_partial_edit_mode",ui_prop_can_edit_history_type:"ui_prop_can_edit_history_type",ui_prop_can_edit_name:"ui_prop_can_edit_name",ui_prop_is_checked:"ui_prop_is_checked",ui_prop_save_in_progress:"ui_prop_save_in_progress",ui_prop_entity_modified:"ui_prop_entity_modified",ui_prop_attribute_modified:"ui_prop_attribute_modified",ui_prop_attribute_name_modified_by_user:"ui_prop_attribute_name_modified_by_user",ui_prop_original_data:"ui_prop_original_data",ui_prop_attribute_name:"ui_prop_attribute_name"},composeConsts.UI_PROPS_FOR_DISPLAY={ui_prop_attribute_display_name:"ui_prop_attribute_display_name",ui_prop_attribute_with_prefix_display_name:"ui_prop_attribute_with_prefix_display_name",ui_prop_attribute_without_prefix_display_name:"ui_prop_attribute_without_prefix_display_name",ui_prop_attribute_domain_attribute:"ui_prop_attribute_domain_attribute",ui_prop_attribute_data_type:"ui_prop_attribute_data_type",ui_prop_attribute_history_type:"ui_prop_attribute_history_type",ui_prop_display_name_for_view:"ui_prop_display_name_for_view",ui_prop_attribute_block:"ui_prop_attribute_block"},composeConsts.USER_DATA_PROPS={last_imported_project_name:"last_imported_project_name"},composeConsts.CURRENT_MONITORED_TASK_PROPS={ui_prop_task_id:-1,ui_prop_task_name:"",ui_prop_task_type:""},composeConsts.DISTRIBUTION_KEY_ITEM_PROPS={ui_prop_name:"ui_prop_name",ui_prop_data_type:"ui_prop_data_type",ui_prop_ordinal:"ui_prop_ordinal",ui_prop_level:"ui_prop_level",ui_prop_is_full_edit_mode:"ui_prop_is_full_edit_mode"},composeConsts.DISTRIBUTION_KEY_ITEM={ui_prop_name:"",ui_prop_data_type:"",ui_prop_ordinal:0,ui_prop_level:0},composeConsts.DATE_TIME_ENTITY_IDS={DATE:{id:100,type:"Date",display_name:"Date"},TIME:{id:140,type:"Time",display_name:"Time"}},composeConsts.DateTimeDimenstionPostFix={Date:"("+composeConsts.DATE_TIME_ENTITY_IDS.DATE.display_name+")",Time:"("+composeConsts.DATE_TIME_ENTITY_IDS.TIME.display_name+")"},composeConsts.EditModelTabTypes={LOGICAL:"LOGICAL",PHYSICAL:"PHYSICAL"},composeConsts.StarSchemaTypes={TRANSACTIONAL:"TRANSACTIONAL",AGGREGATED:"AGGREGATED",STATE_ORIENTED:"STATE_ORIENTED"},composeConsts.StarSchemaTypes_display_names={TRANSACTIONAL:"Transactional",AGGREGATED:"Aggregated",STATE_ORIENTED:"State Oriented"},composeConsts.StarSchemaTypesDescription={TRANSACTIONAL:"A star schema with a transactional fact table allows you to retrieve the desired data, even if a dimension table contains multiple versions of the same record. To use an example from the automotive industry, selecting “OrderDate” as the Transaction Date would allow you to generate a report for the number of customers who bought cars in New York between 2013 and 2016, even if a customer moved to a different city (which would also result in a new record being added to the Customers dimension).",AGGREGATED:"A star schema with an aggregated fact table allows you to make aggregate calculations based on the fact table attributes. For instance, you could create an aggregated fact that shows the total freight costs per shipping region and product category. Additionally, the presence of a transaction date in the fact table makes it possible to retrieve the desired data, even if a dimension contains multiple versions of the same record. To use an example from the shipping industry, a shipper could use an aggregated fact to generate a report for the total cost of shipping rice to Australia from 2015-2016. ",STATE_ORIENTED:"A star schema with a state oriented fact supports Type 2 columns in the fact table. This is useful in cases where the fact is not a singular event in time, but rather, consists of multiple “states” or events that occur over time. Typical example of facts with multiple states are insurance claims or flight reservations. There are also cases when the same entity is treated as both a fact and a dimension – for example, Customers. In such cases, a report could be generated that relates to the state of the fact, such as the time a claim was submitted to the time it was approved. "},composeConsts.StarSchemaObjects=[{type:composeConsts.StarSchemaTypes.TRANSACTIONAL,display_name:composeConsts.StarSchemaTypes_display_names.TRANSACTIONAL,description:composeConsts.StarSchemaTypesDescription.TRANSACTIONAL},{type:composeConsts.StarSchemaTypes.AGGREGATED,display_name:composeConsts.StarSchemaTypes_display_names.AGGREGATED,description:composeConsts.StarSchemaTypesDescription.AGGREGATED},{type:composeConsts.StarSchemaTypes.STATE_ORIENTED,display_name:composeConsts.StarSchemaTypes_display_names.STATE_ORIENTED,description:composeConsts.StarSchemaTypesDescription.STATE_ORIENTED}],composeConsts.DimensionsTypes={TYPE_1:"TYPE_1",TYPE_2:"TYPE_2",TYPE_3:"TYPE_3"},composeConsts.DimensionsTypes_display_names={TYPE_1:"Type 1",TYPE_2:"Type 2",TYPE_3:"Type 3"},composeConsts.DimensionsTypesObjects=[{type:composeConsts.DimensionsTypes.TYPE_1,display_name:composeConsts.DimensionsTypes_display_names.TYPE_1,description:composeConsts.DimensionsTypes_display_names.TYPE_1},{type:composeConsts.DimensionsTypes.TYPE_2,display_name:composeConsts.DimensionsTypes_display_names.TYPE_2,description:composeConsts.DimensionsTypes_display_names.TYPE_2}],composeConsts.sideBarQueryString={name:"sb",openVal:"1",closeVal:"2"},composeConsts.monitorStatusFilter={name:"sf"},composeConsts.ItemNameValidationPattern=/^[A-Za-z-][A-Za-z0-9-_ ]*(?:_[A-Za-z0-9-]+)*$/,composeConsts.DefaultNewItemSeperator="_",composeConsts.NewMappingPrefix="Map_",composeConsts.default_sender_address="",composeConsts.licenseCheckInterval=36e5,composeConsts.monitorInterval=2e3,composeConsts.ETLMonitorInterval=1e3,composeConsts.ProjectRefreshInterval=1e3,composeConsts.GetMessagesInterval=500,composeConsts.minWidth=660,composeConsts.minHeight=440,composeConsts.ZOOM_DURATION=0,composeConsts.UserAcknowledgementText="confirm",composeConsts.STAR_SCHMEA="*",composeConsts.DEFAULT_WORKFLOW_NAME="Default Workflow",composeConsts.DEFAULT_CDC_WORKFLOW_NAME="Default CDC Workflow",composeConsts.Business_Key="Business Key",composeConsts.NA_TEXT="N/A",composeConsts.UNKNOWN="Unknown",composeConsts.FK_Prefix="FK",composeConsts.PK_Prefix="PK",composeConsts.DASH="-",composeConsts.ExpressionBuilderFilterOperators=["+","-","*","/","%","!=","=","||","AND","OR"],composeConsts.ExpressionBuilder_Prefix_Dollar="${",composeConsts.ExpressionBuilder_Postfix_Dollar="}",composeConsts.ExpressionBuilder_Prefix_Slash='"',composeConsts.ExpressionBuilder_Postfix_Slash='"',composeConsts.DataProfilerInternalColumns={ALL:"All",BusinessKey:composeConsts.Business_Key},composeConsts.LoggersAsSliderValues={DEFAULT:-1,ERROR:0,WARNING:1,INFO:2,DEBUG:3,DETAILED_DEBUG:4},composeConsts.projectModes={DESIGNER:DO.Product.Design,MONITOR:DO.Product.Monitor},composeConsts.projectSubModes={STANDARD:"Standard",WORKFLOW:"Workflow"},composeConsts.ViewModes={DESIGNER:"Designer",MONITOR:"Monitor"},composeConsts.DISPLAY_MODEL_TYPES={ERD:"ERD",ERD_DETAILED:"ERD_DETAILED",TREE_BASIC:"TREE_BASIC"},composeConsts.ValidationTypes={MODEL:"MODEL",DATAMART:"DATAMART",ETL:"ETL"},composeConsts.REUSABLE_TRANSFORMATIONS_PREFIX="$$",composeConsts.ListTypes={grid:"grid",double_grid:"double_grid",split_list:"split_list",single_list:"single_list"},composeConsts.ManipulationFilters={ReusableTransformations:{name:"Transformations",glyph_image:"att-glyph icon-gl-global-transformation",view_type:composeConsts.ListTypes.split_list},InputColumns:{name:"Input Columns",glyph_image:"att-glyph icon-gl-global-transformation",view_type:composeConsts.ListTypes.grid},HeaderColumns:{name:"Header Columns",glyph_image:"att-glyph icon-gl-global-transformation",view_type:composeConsts.ListTypes.grid},Operators:{name:"Operators",glyph_image:"att-glyph icon-gl-RestoreZoom",view_type:composeConsts.ListTypes.split_list},Functions:{name:"Functions",glyph_image:"att-glyph icon-gl-Log",view_type:composeConsts.ListTypes.split_list}},composeConsts.CodeMirrorOptions={mode:"text/x-mysql",lineNumbers:!0,lineWrapping:!0,matchBrackets:!0,extraKeys:{"Ctrl-Space":"autocomplete"},autofocus:!0,smartIndent:!0},composeConsts.StarSchemaTreeNode={name:"Star Schemas"},composeConsts.DimensionTreeNode={name:"Dimensions"},composeConsts.DataMartWizardSteps={GENERAL:"General",FACTS:"Facts",DIMENSIONS:"Dimensions",TRANSACTION_DATE:"Transaction Date",AGGREGATED_FACT:"Aggregated Fact"},composeConsts.EditDataMartTabs={GENERAL:"General",LOGICAL_ATTRIBUTES:"Logical Attributes",PHYSICAL_TABLE:"Physical Table",TRANSACTION_DATE:"Transaction Date"},composeConsts.PhysicalPropertiesTabs={DISTRIBUTION_KEY:"Distribution key",SORT_KEY:"Sort key"},composeConsts.LookupModes={BASIC:"BASIC",ADVANCED:"ADVANCED"},composeConsts.LookupInternalTableTypes={LOOKUP:"Lookup",LANDING:"Landing",STRING_FORMAT:"${0}$ {1}"},composeConsts.PhysicalTablesType={MODEL:"Model",DATAMART:"Datamart"},composeConsts.DOCUMENTATION_EMPTY_TEMPLATE_URL="partials/rootNodeView.html",composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE="partials/rootNodeView2.html",composeConsts.REPOSITORY_FILE_NAME="Repository.js",composeConsts.ETL_CUSTOM_ETL_NODES_NAMES={MULTI_TABLE_ETL:"Multi Table ETL",SINGLE_TABLE_ETL:"Single Table ETL",POST_LOADING_ETL:"Post Loading ETL",PRE_LOADING:"Pre Loading",PRE_LOADING_ETL:"Pre Loading ETL",POST_LOADING:"Post Loading"},composeConsts.documentation_tree_nodes={MODEL_NODE:{state_name:"ModelState",display_name:"Model",node_name:"Model",url:"/model",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},ENTITIES_NODE:{state_name:"EntitiesState",display_name:"Entities",node_name:"Entities",url:"/entities",templateUrl:"partials/entitiesListView.html"},ENTITY_ROOT_NODE:{state_name:"EntityRootNodeState",display_name:"{{data.current_item_name}}",node_name:"Entity",url:"/entityItem/{entityName}",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},ATTRIBUTES_DOMAIN_NODE:{state_name:"AttributesDomainState",display_name:"Attributes Domain",node_name:"Attributes Domain",url:"/attributesDomain",templateUrl:"partials/attributesDomainListView.html"},TRANSFORMATION_NODE:{state_name:"TransformationsState",display_name:"Transformations",node_name:"Transformations",url:"/transformations",templateUrl:"partials/transformationsView.html"},ENTITY_ATTRIBUTES_NODE:{state_name:"EntityAttributesState",display_name:"Attributes",node_name:"Attributes",url:"/attributes/{entityName}",templateUrl:"partials/attributesListView.html"},ENTITY_RELATIONSHIPS_NODE:{state_name:"EntityRelationshipsState",display_name:"Relationships",node_name:"Relationships",url:"/relationships/{entityName}",templateUrl:"partials/relationsView.html"},ENTITY_LINEAGE_NODE:{state_name:"EntityLineageState",display_name:"Lineage",node_name:"Lineage",url:"/lineage/{entityName}",templateUrl:"partials/lineageView.html"},ERD_NODE:{state_name:"ERDState",display_name:"Diagram",node_name:"Diagram",url:"/erd",templateUrl:"partials/relationsView.html"},ETL_SETS_NODE:{state_name:"EtlSetsState",display_name:"Tasks",node_name:"Tasks",url:"/etlSets",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},ETL_SETS_LIST_NODE:{state_name:"EtlSetsListState",display_name:"Task List",node_name:"Task List",url:"/etlSetsList",templateUrl:"partials/etlNameDescriptionListView.html"},ETL_ITEM:{state_name:"EtlItemState",display_name:"{{data.current_item_name}}",node_name:"",url:"/etlItem/{entityName}",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},ETL_ACTIVE_MAPPING_ROOT_NODE:{state_name:"EtlMappingsState",display_name:"{{data.current_item_name}}",node_name:"Active Mappings",url:"/{entityName}/etlMapping",templateUrl:"partials/etlItemActiveMappingsList.html"},ETL_ENTITY_MAPPING_ITEM_NODE:{state_name:"EtlMappingItemState",display_name:"{{data.current_item_name}}",node_name:"MappingItem",url:"/etlEntityMappingItem/{entityName}",templateUrl:"partials/etlEntityMappingItemView.html"},ETL_CUSTOM_ETL_ROOT_NODE:{state_name:"CustomEtlState",display_name:"{{data.current_item_name}}",node_name:"",url:"/customETL/{entityName}",templateUrl:"partials/customETLItemListView.html"},ETL_CUSTOM_ETL_NODE:{state_name:"CustomEtlItemState",display_name:"{{data.current_item_name}}",node_name:"",url:"/customEtlItem/{entityName}",templateUrl:"partials/customETLItemView.html"},ETL_CUSTOM_ETL_SINGLE_TABLE_NODE:{state_name:"SingleTableCustomEtlItemState",display_name:"{{data.current_item_name}}",node_name:"",url:"/customEtlItem/{entityName}",templateUrl:"partials/singleTableCustomETLTableView.html"},MAPPINGS_NODE:{state_name:"MappingsState",display_name:"Mappings",node_name:"Mappings",url:"/mappings",templateUrl:"partials/etlMappingsListView.html"},ENTITY_MAPPINGS_NODE:{state_name:"EntityMappingsState",display_name:"{{data.current_item_name}}",node_name:"",url:"/entityMappings",templateUrl:"partials/etlEntityItemMappingListView.html"},DATA_MARTS_SETS_NODE:{state_name:"DataMartSetsState",display_name:"Data Marts Sets",node_name:"Data Marts Sets",url:"/dataMartsSets",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},DATA_MARTS_SETS_LIST_NODE:{state_name:"DataMartsSetsListState",display_name:"Data Marts List",node_name:"Data Marts List",url:"/dataMartsList",templateUrl:"partials/dataMartNameDescriptionListView.html"},DATA_MART_ITEM_NODE:{state_name:"DataMartItemState",display_name:"{{data.current_item_name}}",node_name:"",url:"/dataMartItem",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},DATA_MARTS_STAR_SCHEMAS_ROOT_NODE:{state_name:"StarSchemasRootState",display_name:"Star Schemas",node_name:"Star Schemas",url:"/starSchemas",templateUrl:"partials/factDimsListView.html"},DATA_MARTS_DIMENSIONS_ROOT_NODE:{state_name:"DimensionsState",display_name:"Dimensions",node_name:"Dimensions",url:"/dimensions",templateUrl:"partials/factDimsListView.html"},DATA_MARTS_STAR_SCHEMA_ITEM_NODE:{state_name:"StarSchemaItemState",display_name:"{{data.current_item_name}}",node_name:"Star Schema",url:"/starSchema/{entityName}",templateUrl:"partials/starSchemaItemView.html"},DATA_MARTS_STAR_DIMENSION_ITEM_NODE:{state_name:"DimensionItemState",display_name:"{{data.current_item_name}}",node_name:"Dimensions",url:"/dimension/{entityName}",templateUrl:"partials/starSchemaItemView.html"},APPENDIX_NODE:{state_name:"AppendixState",display_name:"Appendix",node_name:"Appendix",url:"/appendix",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},APPENDIX_DATABASES_NODE:{state_name:"AppendixDatabasesState",display_name:"Databases",node_name:"Databases",url:"/databases",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},APPENDIX_DATABASE_ITEM_NODE:{state_name:"AppendixDatabaseItemState",display_name:"{{data.current_item_name}}",node_name:"Database",url:"/databaseDetails/{entityName}",templateUrl:"partials/dataBaseDetails.html"},APPENDIX_SOURCE_DATABASES_NODE:{state_name:"AppendixSourceDatabasesState",display_name:"Source Databases",node_name:"Source Databases",url:"/sourceDatabases",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},APPENDIX_DWH_DATABASES_NODE:{state_name:"AppendixDwhDatabasesState",display_name:"Data Warehouse",node_name:"Data Warehouse",url:"/dataWarehouse",templateUrl:composeConsts.DOCUMENTATION_NAVIGATION_ITEM_TEMPLATE},APPENDIX_GLOBAL_SETTINGS_NODE:{state_name:"AppendixGlobalSettingsState",display_name:"Global Project Settings",node_name:"Global Project Settings",url:"/globalProjectSettings",templateUrl:composeConsts.DOCUMENTATION_EMPTY_TEMPLATE_URL}},composeConsts.DocumentationCtrls={DocumentationAppCtrl:"documentationAppCtrl",DisplayController:"displayController",RootNodeDisplayController:"rootNodeDisplayController",TreeController:"treeController",ModelTreeCtrl:"modelTreeCtrl",EtlTreeCtrl:"etlTreeCtrl",DataMartTreeCtrl:"dataMartTreeCtrl",AppendixTreeCtrl:"appendixTreeCtrl"},composeConsts.DocumentationSrvcs={DisplayService:"displayService",PrintService:"printService"},composeConsts.ComposeLogsTypes={server:"Server",dataProcessManager:"DataProcessManager"},composeConsts.LogsTypes=[{type:composeConsts.ComposeLogsTypes.server,name:"Server"},{type:composeConsts.ComposeLogsTypes.dataProcessManager,name:"Compose Agent"}],composeConsts.DocumentationTexts={Title:"Project Documentation",Documentation_Was_Generated_At:"Documentation was generated at:",Project_Documentation_Text:"Project documentation",Entities_Text:"Entities",Entity_Text:"Entity",Name_Text:"Name",UseBackdating_Text:"Backdating",UsePreCurseRows_Text:"Precursor Rows",SaveHistory_Text:"Save history",Attribute_Domain_RelatedEntity_Text:"Attribute Domain/Related Entity",Attribute_Domain_Text:"Attribute Domain",Category_Text:"Category",Description_Text:"Description",Attributes_Domain_Text:"Attributes Domain",Attributes_Text:"Attributes",Attribute_Text:"Attribute",Lineage_Text:"Lineage",DataWarehouse_Model_Text:"Data Warehouse Model",Used_In_These_Entities_Text:"Used in these Entities",Unknown_Value_Text:"Unknown Value",Type_Text:"Type",Length_Text:"Length",Scale_Text:"Scale",Group_By_Text:"Group By",Aggregations_Text:"Aggregations",Relationship_Text:"Relationship",Type_1_Text:"Type 1",Type_2_Text:"Type 2",Key_Text:"Key",Prefix_Text_Text:"Prefix",Data_Type_Text:"Data Type",Aggregation_Text:"Aggregation",Aggregation_Filter_Text:"Aggregation Filter",History_Text:"History",Satellite_Text:"Satellite",Expression_Text:"Expression",Condition_Text:"Condition",Condition_False_Text:"If Condition is False",Correction_Text:"Correction",ResultColumn_Text:"Result Column",ETL_Sets_List_Text:"Task List",Handle_Duplicates_Text:"Handle Duplicates",Mappings_Text:"Mappings",Landing_Area_Database_Text:"Landing Area Database:",Schema_Text:"Schema",Source_Text:"Source:",Filter_Text:"Filter",Landing_Area_Mapping_Columns_Text:"Landing Area Mapping Columns",Staging_Area_Columns_Text:"Staging Area Columns",Data_Validation_Rules_Text:"Data Validation Rules",Data_Cleansing_Rules_Text:"Data Cleansing Rules",Action_Text:"Action",Enabled_Text:"Enabled",Sequence_Number_Text:"Sequence Number",Used_In_These_ETLS_Text:"Used in these ETLS",Mapping_Name_Text:"Mapping Name",DataMart_Text:"Data Mart",DataMarts_Text:"Data Marts",Star_Schemas_Text:"Star Schemas",Dimension_Type_Text:"Dimension Type:",Star_Schema_Text:"Star Schema",Star_Schema_Type_Text:"Star Schema Type:",History_Type_Text:"History Type:",Transaction_Date_Text:"Transaction Date:",Dimension_Table_Name_Text:"Dimension Table Name:",Fact_Table_Name_Text:"Fact Table Name:",Dimension_View_Name_Text:"Dimension View Name:",Fact_View_Name_Text:"Fact View Name:",Dimensions_Text:"Dimensions",Dimension_Text:"Dimension",Dimension_DWH_Model_Text:"Dimension  (Data Warehouse Model)",Dimension_DM_Model_Text:"Star Schema  (Data Mart Model)",User_Defined_ETL_Text:"User Defined ETL",Column_Text:"Column",Role_Text:"Role",Data_Warehouse_Text:"Data Warehouse",Landing_Area_Settings_Text:"Landing Area Settings",Content_Type_Text:"Content Type",Designated_By_Text:"Designated By",Database_Name_Text:"Database name",SID_Text:"SID",Schema_Name_Text:"Schema name",Error_Mart_Schema_Name_Text:"Error Mart Schema Name",Source_Database_Connection_Text:"Source database connection",Source_Database_Text:"Source Database",DataWarehouse_Database_Text:"Data Warehouse Database",Server_Name_Text:"Server Name",Port_Text:"Port",User_Name_Text:"User Name",Data_Warehouse_Schema_Text:"Data Warehouse Schema",Data_Mart_Schema_Text:"Data Mart Schema",Derived_Attribute_Text:"Derived Attribute",Column_Mapping_Text:"Mapping Expression",Mapping_Text:"Mapping",Mapping_Lookup_Text:"Mapping Lookup",Mapping_Filter_Text:"Mapping Filter",Column_Staging_Name_Text:"Column Staging Name",Rule_Text:"Rule",Rule_Name_Text:"Rule Name",Transformation_Text:"Transformation",Transformations_Text:"Transformations",Transformation_Usage_Text:"Usage",Reusable_Transformations_Text:"Reusable Transformations",Process_Number_Text:"Process Number",Entity_Name_Text:"Entity Name",Runtime_Clause_Text:"Runtime Clause",Process_Type_Text:"Process Type",Process_Step_Text:"Process Step",Parameter_Text:"Parameter",SQL_Statement_Text:"SQL Statement",RowAffected_Text:"Rows Affected",Status_Text:"Status",Reason_Text:"Reason",Start_Time_Text:"Start Time",End_Time_Text:"End Time",ElapsedTime_Text:"Elapsed Time",Process_Name_Text:"Process Name"},composeConsts.MONITOR_TABLES_STATUS={COMPLETED:"Completed",LOADING:"Loading",QUEUED:"Queued",ERROR:"Error",SHOW_ALL:"Show All"};