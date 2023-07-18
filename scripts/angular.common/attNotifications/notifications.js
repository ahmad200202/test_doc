(function (angular) {
    "use strict";
    var attNotificationsModule = angular.module('attNotificationsModule', []);

    attNotificationsModule.factory('attMailServerService', ["InvokerService", "modalService", "locale", "GlobalMessagesService", "ValidationService", "AclService",
        function ( InvokerService, modalService, locale, GlobalMessagesService, ValidationService, AclService) {
            var _mailAppCtx = null;
            var attMailServerService = {
                data:{
                    DO_MailServerSettings :{
                        metadata:"metadata",
                        name:"name",
                        version:"version",
                        host:"host",
                        port:"port",
                        username:"username",
                        password:"password",
                        use_ssl:"use_ssl",
                        default_recipients:"default_recipients",
                        sender_address:"sender_address"
                    },
                    callbacks:{
                        getUserRole:null,
                        userNameChange:null,
                        passwordChange:null
                    }
                },
                setAppMailServerContext:function (appContextObject, getUserRoleCallback) {
                    _mailAppCtx = appContextObject;
                    attMailServerService.data.callbacks.getUserRole = getUserRoleCallback;
                },
                isSetContextApp:function(){
                    return ( !ObjectUtils.isEmpty( _mailAppCtx) );
                },
                isSetContextMethod:function (methodKey) {
                    return attMailServerService.isSetContextApp() && !ObjectUtils.isEmpty( methodKey) && !ObjectUtils.isEmpty( _mailAppCtx[methodKey]);
                },
                getContextMethodName:function (methodKey) {
                    return _mailAppCtx[methodKey].method;
                },
                isUserAllowByConstMethodCallerRole:function (constMethod, callerRole) {
                    if(callerRole == null && attMailServerService.data.callbacks.getUserRole != null){
                        callerRole = attMailServerService.data.callbacks.getUserRole();
                    }
                    var appMethodName = attMailServerService.getContextMethodName(constMethod);
                    return AclService.isUserAllowToDoAction(appMethodName, callerRole);
                },
                isUserAllowToDoAction_GetMailServer:function (callerRole) {
                    return attMailServerService.isUserAllowByConstMethodCallerRole(consts.MailServer.Methods.GetMailServer, callerRole);
                },
                isUserAllowToDoAction_PutMailServer:function (callerRole) {
                    return attMailServerService.isUserAllowByConstMethodCallerRole(consts.MailServer.Methods.PutMailServer, callerRole);
                },
                isUserAllowToDoAction_SendTestMail:function (callerRole) {
                    return attMailServerService.isUserAllowByConstMethodCallerRole(consts.MailServer.Methods.SendTestMail, callerRole);
                },
                getContextObjectByMethodKey:function (methodKey, putData, params, postData) {
                    var ctx = {};
                    ctx[methodKey] = ObjectUtils.deepClone( _mailAppCtx[methodKey] );
                    if( !ObjectUtils.isEmpty( putData) ){
                        ctx[methodKey][consts.params][consts.putData] = putData;
                    }
                    if( !ObjectUtils.isEmpty( postData) ){
                        ctx[methodKey][consts.params][consts.postData] = postData;
                    }
                    if( !ObjectUtils.isEmpty( params) ){
                        ObjectUtils.forOwn(params, function (paramKey, paramValue) {
                            ctx[methodKey][consts.params][paramKey] = paramValue;
                        });
                    }
                    return ctx;
                },
                getMailServerReq:function (onSuccess, onError) {
                    //attMailServerService.data.callbacks.getUserRole
                    if( attMailServerService.isSetContextMethod( consts.MailServer.Methods.GetMailServer) && attMailServerService.isUserAllowToDoAction_GetMailServer() ){
                        var currentCallObjectCtx = attMailServerService.getContextObjectByMethodKey(consts.MailServer.Methods.GetMailServer, null);
                        InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.MailServer.Methods.GetMailServer, onSuccess, onError);
                    }
                },
                putMailServerReq:function (mailServerObject, onSuccess, onError) {
                    if( attMailServerService.isSetContextMethod( consts.MailServer.Methods.PutMailServer) && attMailServerService.isUserAllowToDoAction_PutMailServer()){
                        var currentCallObjectCtx = attMailServerService.getContextObjectByMethodKey(consts.MailServer.Methods.PutMailServer, mailServerObject);
                        InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.MailServer.Methods.PutMailServer, onSuccess, onError);
                    }
                },
                sendTestMailReq:function (mailServerObject, testMailAddress, onSuccess, onError) {
                    if( attMailServerService.isSetContextMethod( consts.MailServer.Methods.SendTestMail) && attMailServerService.isUserAllowToDoAction_SendTestMail() ){
                        //NotificationSendTestMailReq
                        //Using "PostData"
                        var sendTestMailObject = {
                            mail_server_settings:null,
                            recipient:null
                        };
                        sendTestMailObject.mail_server_settings = mailServerObject;
                        sendTestMailObject.recipient = testMailAddress;
                        var currentCallObjectCtx = attMailServerService.getContextObjectByMethodKey(consts.MailServer.Methods.SendTestMail, null, null, sendTestMailObject);
                        InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.MailServer.Methods.SendTestMail, onSuccess, onError);
                    }
                },
                getValidationOverrideMailServerSettingsObject: function () {
                    // var NotControlCharacterPattern = /^[\x20-\x7E]+$/;
                    return {
                        host: {required: true, maxlength: 64, validcharacters: consts.ValidCharactersMailServerHost},
                        // port:{min: 0, max: 65535},
                        username: {
                            maxlength: 64,
                            pattern: consts.NotControlCharacterPattern
                        },
                        password: {
                            maxlength: 64,
                            pattern: consts.NotControlCharacterPattern
                        },
                        sender_address: {email: true}
                    };
                },
                prepMailServerDataFromServer:function (dataMailServerObject) {
                    dataMailServerObject.anonymous_login = (dataMailServerObject.username == "");
                    return dataMailServerObject;
                },
                showMailServerPopup: function (onSuccess) {
                    var popupVm = {};
                    popupVm.FormNameMailServerSettings = "MailServerSettingsForm";
                    popupVm.mailServerObject = {};
                    popupVm.testMailAddress = "";
                    popupVm.testMailAddressValid = false;
                    popupVm.testMailIsSendingNow = false;
                    popupVm.testMailAddressErrMsg = "";
                    popupVm.validationOverrideMailServer = attMailServerService.getValidationOverrideMailServerSettingsObject();

                    attMailServerService.getMailServerReq(
                        function (dataMailServerObject) {

                            popupVm.mailServerObject = attMailServerService.prepMailServerDataFromServer(dataMailServerObject);

                            modalService.showModal(
                                {
                                    contentTemplate: 'scripts/angular.common/attNotifications/mailServerSettingsPopup.html',
                                    headerText: locale.getString('common.notifications.MailServerSettingsPopupTitle'),
                                    resizable: true,
                                    actionButtonText: locale.getString('common.base.Save'),
                                    minWidth: 570,
                                    minHeight: 570,
                                    model: popupVm,
                                    closeOnRoute : true,
                                    okDisabledProp: function (vm) {
                                        return ( !ValidationService.isValid(popupVm.FormNameMailServerSettings)
                                            || ( !vm.mailServerObject.anonymous_login
                                                && (ObjectUtils.isEmpty(vm.mailServerObject.username) || ObjectUtils.isEmpty(vm.mailServerObject.password) ) )   );
                                    }
                                },
                                {windowClass: 'mailServerSettingsConfigurationFormPopup'}
                            ).then(function (vm) {
                                attMailServerService.putMailServerReq(vm.mailServerObject, onSuccess);
                            },function () {
                                // GlobalMessagesService.clearDockedErrorFadeOutInterval();
                            });
                        },
                        function (message) {
                            GlobalMessagesService.setMessages(true, consts.errorModes.error, false, message);
                        }
                    );
                },
                doUsernameChange:function (popupVm) {
                    if(attMailServerService.data.callbacks.userNameChange != null){
                        attMailServerService.data.callbacks.userNameChange(popupVm);
                    }
                },
                doPasswordChange:function (popupVm) {
                    if(attMailServerService.data.callbacks.passwordChange != null){
                        attMailServerService.data.callbacks.passwordChange(popupVm);
                    }
                }
            };
            return attMailServerService;
        }]);

    attNotificationsModule.controller("mailServerPopupCtrl", ["$scope", "attMailServerService", "attUtilsService", "ValidationService", "locale", "GlobalMessagesService",
        function ($scope, attMailServerService, attUtilsService, ValidationService, locale, GlobalMessagesService) {

            $scope.sendTestMail = function () {
                $scope.vm.testMailIsSendingNow = true;
                attMailServerService.sendTestMailReq($scope.vm.mailServerObject, $scope.vm.testMailAddress,  function () {
                    $scope.vm.testMailIsSendingNow = false;
                    GlobalMessagesService.setMessages(true, consts.errorModes.success, true, locale.getString("common.notifications.SendTestMailSucceeded") );
                },function (message, info) {
                    $scope.vm.testMailIsSendingNow = false;
                    return true;
                });
            };

            $scope.onAnonymousLoginChanged = function () {
                if($scope.vm.mailServerObject.anonymous_login){
                    $scope.usernameErrMsg = $scope.passwordErrMsg = "";
                }
            };

            $scope.onUsernameChanged = function () {
                attMailServerService.doUsernameChange($scope.vm);

                $scope.usernameErrMsg = "";
                if($scope.vm.mailServerObject.anonymous_login == false){
                    if($scope.vm.mailServerObject.username == ""){
                        $scope.usernameErrMsg = locale.getString('common.notifications.MailServerSettings_missingUsername');
                    }
                }
            };

            $scope.sslCheckboxClick = function () {
                if(!$scope.vm.mailServerObject.use_ssl){
                    $scope.vm.mailServerObject.ssl_verify_peer = false;
                    $scope.vm.mailServerObject.ssl_verify_host = false;
                }
            };

            $scope.onPasswordChanged = function () {
                attMailServerService.doPasswordChange($scope.vm);

                $scope.passwordErrMsg = "";
                if($scope.vm.mailServerObject.anonymous_login == false){
                    if($scope.vm.mailServerObject.password == ""){
                        $scope.passwordErrMsg = locale.getString('common.notifications.MailServerSettings_missingPassword');
                    }
                }
            };

            $scope.testMailAddressChanged = function () {
                if($scope.vm.testMailAddress != ""){
                    $scope.vm.testMailAddressValid = attUtilsService.isValidEmail($scope.vm.testMailAddress) ? true : false;
                    $scope.vm.testMailAddressErrMsg = ($scope.vm.testMailAddressValid) ? "" : locale.getString('common.notifications.TestEmailDisabled_TestAddressInvalid');
                }
                else{
                    $scope.vm.testMailAddressErrMsg = "";
                }
            };

            $scope.isSendTestMailDisabled = function () {
                if(!$scope.vm.mailServerObject.anonymous_login){
                    if(($scope.vm.mailServerObject.username == "") || ($scope.vm.mailServerObject.password == "")){
                        $scope.sendTestMailTooltip = locale.getString("common.notifications.TestEmailDisabled_Credentials");
                        return true;
                    }
                }

                if(ObjectUtils.isEmpty($scope.vm.testMailAddress)){
                    $scope.sendTestMailTooltip = locale.getString("common.notifications.TestEmailDisabled_TestAddress");
                    return true;
                }

                if(!$scope.vm.testMailAddressValid){
                    $scope.sendTestMailTooltip = locale.getString("common.notifications.TestEmailDisabled_TestAddressInvalid");
                    return true;
                }

                if(!ValidationService.isValid($scope.vm.FormNameMailServerSettings)){
                    $scope.sendTestMailTooltip = locale.getString("common.notifications.TestEmailDisabled_FormInvalid");
                    return true;
                }

                if($scope.vm.testMailIsSendingNow){
                    $scope.sendTestMailTooltip = locale.getString("common.notifications.TestEmailDisabled_TestMailIsBeingSentNow");
                    return true;
                }

                $scope.sendTestMailTooltip = "";
                return false;
            };

        }
    ]);

    attNotificationsModule.factory("attNotificationsService", ["InvokerService", "modalService", "locale", "AclService", "GlobalMessagesService", "$filter", "UserPreferencesService", "attMailServerService", "AttGlobalBatch",
        "AEM_ServersService", "VersionPolicyService",
     function ( InvokerService, modalService, locale, AclService, GlobalMessagesService, $filter, UserPreferencesService, attMailServerService, AttGlobalBatch, AEM_ServersService, VersionPolicyService) {
        var _appCtx = null;
        var NotificationsRulesUserPreferencesKey = "notificationsRules";

        var _variablesWhiteList = {};

        var attNotificationsService = {
            data:{
                callerRole: "NONE",
                productName:"",
                notifications: [],
                notificationsDisplayNames: {},
                notificationGroups: [],
                allEventsDictionary: {},
                preDefinedRules:[],
                stepEventsTemplateUrl: null,
                objectNamesForVariablesInDO:[],
                variablesDictionary:null,
                variablePreFix : "${",
                variablePostFix : "}",
                deliveryDisplayNames: null,
                rulesListSelectedGroupType: angular.copy(consts.Notification.GroupType.SERVER),
		        userPrefs:null,
                displayWithGroupMultiCheckBoxes : false,
                eventcode:[]
            },
            CONSTANTS:{
                EmptyString:"",
                Space:" ",
                Comma:",",
                Semicolon:";",
                DoubleSemicolon:";;",
                SemicolonWithSpace:"; ",
                InitialValue:"[N]",
                NOTIFICATION_THRESHOLD_DEFINED_VALUES:"${NOTIFICATION_THRESHOLD_DEFINED_VALUES}",
                NOTIFICATION_DEFINED_VALUES:"${NOTIFICATION_DEFINED_VALUES}",
                InputPath: "trigger.inputs.0",
                InputPathArray: "trigger.inputs",
                InputPathInnerRule: "trigger.rules.0.inputs.0",
                InputPathInnerRuleArray: "trigger.rules.0.inputs",
                FullTaskName: "FullTaskName()",
                ServerVersion: "server_version",
                joined_server_task: "joined_server_task",
                SEP: "_:ST:_",
                EQUAL_TO: "EQUAL_TO",
                LOGICAL_AND: "LOGICAL_AND",
                LOGICAL_OR: "LOGICAL_OR",
                ONE_OF: "ONE_OF",
                IS_MIN_SERVER_VERSION: "IS_MIN_SERVER_VERSION",
                member_name: "member_name",
                operator: "operator",
                server_name: "server_name",
                task_name: "task_name"
            },
            DO_NOTIFI:{
                NotificationListObjectName: null,
                $type:"$type",
                _Defaults:"_Defaults",
                name:"name",
                enabled:"enabled",
                trigger:"trigger",
                on_set_actions:"on_set_actions",
                on_clear_actions:"on_clear_actions",
                NotificationRuleDto:"NotificationRuleDto",
                NotificationRuleDto_Defaults:"NotificationRuleDto_Defaults",
                NotificationAlarmRuleDto:"NotificationAlarmRuleDto",
                RuleOperators:"RuleOperators",
                RuleDto_Defaults:"RuleDto_Defaults",
                AuditEventTypeOptions: null,
                EventLogNotificationDelivery:"EventLogNotificationDelivery",
                EmailNotificationDelivery:"EmailNotificationDelivery",
                EventLogNotificationDelivery_Defaults:"EventLogNotificationDelivery_Defaults",
                EmailNotificationDelivery_Defaults:"EmailNotificationDelivery_Defaults",
                InternalNotificationDelivery: null,
                InternalNotificationDelivery_Defaults: null,
                message:"message",
                subject:"subject",
                PreDefinedPropertyRules:null
            },
            executeFunctions:{
                getEventsGroupsFunc: null,
                deleteNotificationFunc: null,
                prepDataNewNotification: null,
                prepUiData: null,
                prepGroupType: null,
                prepSelectedEvents: null,
                prepNotificationMessageVariables: null
            },
            callbackFunctions:{
                getNotificationUserCallerRole:null,
                GetNotificationRulesListSuccess: null,
                GetNotificationRulesListError: null,
                applyDataOnGetNotificationsPreDefinedRulesSuccess: null,
                applyDataOnGetNotificationsPreDefinedRulesError: null,
                isAppMailServerDefine:null,
                openEmailSettings:null,
                getAllServers:null,
                getAllTasks:null,
            },
            setAppNotificationContext:function (appContextObject) {
                _appCtx = appContextObject;
            },
            isSetContextApp:function(){
                return ( !ObjectUtils.isEmpty( _appCtx) );
            },
            isSetContextMethod:function (methodKey) {
                return attNotificationsService.isSetContextApp() && !ObjectUtils.isEmpty( methodKey) && !ObjectUtils.isEmpty( _appCtx[methodKey]);
            },
            getContextMethodName:function (methodKey) {
                return _appCtx[methodKey].method;
            },
            isUserAllowByConstMethodCallerRole:function (constMethod, callerRole) {
                if(callerRole == null && attNotificationsService.callbackFunctions.getNotificationUserCallerRole != null){
                    callerRole = attNotificationsService.callbackFunctions.getNotificationUserCallerRole();
                }
                var appMethodName = attNotificationsService.getContextMethodName(constMethod);
                return AclService.isUserAllowToDoAction(appMethodName, callerRole);
            },
            isUserAllowToDoAction_PutNotification:function (callerRole) {
                return attNotificationsService.isUserAllowByConstMethodCallerRole(consts.Notification.Methods.Put_Notification, callerRole);
            },
            isUserAllowToDoAction_EnableNotification:function (callerRole) {
                return attNotificationsService.isUserAllowByConstMethodCallerRole(consts.Notification.Methods.Enable_Notification_Rule, callerRole);
            },
            isUserAllowToDoAction_DeleteNotification:function (callerRole) {
                return attNotificationsService.isUserAllowByConstMethodCallerRole(consts.Notification.Methods.Delete_Notification, callerRole);
            },
            getContextObjectByMethodKey:function (methodKey, putData, params, postData) {
                var ctx = {};
                ctx[methodKey] = ObjectUtils.deepClone( _appCtx[methodKey] );
                if( !ObjectUtils.isEmpty( putData) ){
                    ctx[methodKey][consts.params][consts.putData] = putData;
                }
                if( !ObjectUtils.isEmpty( postData) ){
                    ctx[methodKey][consts.params][consts.postData] = postData;
                }
                if( !ObjectUtils.isEmpty( params) ){
                    ObjectUtils.forOwn(params, function (paramKey, paramValue) {
                        ctx[methodKey][consts.params][paramKey] = paramValue;
                    });
                }
                return ctx;
            },
            getNotificationRulesList: function (putData, params, groupType, onSuccess, onError) {
                if(attNotificationsService.isSetContextMethod( consts.Notification.Methods.Get_Notification_Rules_List) ){
                    var currentCallObjectCtx = attNotificationsService.getContextObjectByMethodKey(consts.Notification.Methods.Get_Notification_Rules_List, putData, params);
                    InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.Notification.Methods.Get_Notification_Rules_List,
                        function (data) {
                            attNotificationsService.applyDataOnGetNotificationRulesList(data, groupType, onSuccess);
                    }, onError);
                }
            },
            applyGroupTypeFilterOnNotificationsList:function (groupType) {
                attNotificationsService.data.rulesListDisplayArray = $filter('filter')( attNotificationsService.data.notifications, {group_type: groupType});
            },
            getEventDescriptionForUnitsValue: function(notificationName, eventKey, inputUnitsValue) {
                var prefsSelectedUnitSize = null;
                var eTempSingleNotificationUserPrefs = attNotificationsService.getUserPrefsForSingleNotification( notificationName);
                if( !ObjectUtils.isEmpty( eTempSingleNotificationUserPrefs) ){
                    prefsSelectedUnitSize = attNotificationsService.getUserPrefsSingleNotificationForProp(eTempSingleNotificationUserPrefs, eventKey, "selectedUnitSize");
                }
                if( !ObjectUtils.isEmpty( prefsSelectedUnitSize) && inputUnitsValue != null && attNotificationsService.data.allEventsDictionary[eventKey] && attNotificationsService.data.allEventsDictionary[eventKey].getDisplayValueFromServerReplayByUnits && !isNaN(Number(inputUnitsValue))){
                    var displayValue = attNotificationsService.data.allEventsDictionary[eventKey].getDisplayValueFromServerReplayByUnits( Number(inputUnitsValue) , prefsSelectedUnitSize);
                    return attNotificationsService.data.allEventsDictionary[eventKey].textLabel + " " + displayValue  + " " + prefsSelectedUnitSize;
                }
                else if(inputUnitsValue != null && attNotificationsService.data.allEventsDictionary[eventKey] && attNotificationsService.data.allEventsDictionary[eventKey].getUnitsDisplayLabel){
                    var displayObj = attNotificationsService.data.allEventsDictionary[eventKey].getUnitsDisplayLabel( Number(inputUnitsValue) );
                    return attNotificationsService.data.allEventsDictionary[eventKey].textLabel + " " + displayObj.val  + " " + displayObj.unitLabel;
                }
                else if(attNotificationsService.data.allEventsDictionary[eventKey] != null && attNotificationsService.data.allEventsDictionary[eventKey].textLabel != null){
                    // return attNotificationsService.data.notificationsDisplayNames[eventKey];
                    return attNotificationsService.data.allEventsDictionary[eventKey].textLabel;
                }
                else{
                    return eventKey;
                }
            },
            getEventDescriptionForListValue: function(eventKey, inputValues, isSummary) {
                var delimiter = (isSummary === true) ? "\r\n" : " ";
                return attNotificationsService.data.allEventsDictionary[eventKey].textLabel + delimiter + inputValues;
            },
            getEventDescriptionForArrayValue: function(eventKey, inputValue, isSummary) {
                var joinedValues = (inputValue) ? inputValue.join(", ") : "";
                var delimiter = (isSummary === true) ? "\r\n" : " ";
                return attNotificationsService.data.allEventsDictionary[eventKey].textLabel + delimiter ;
            },
            getEventDescription:function (notificationName, eventKey, inputValue, isSummary) {
                switch (attNotificationsService.data.eventcode[eventKey]) {
                    case DO.AuditEventTypeOptions.ERROR_GENERAL:
                        return attNotificationsService.getEventDescriptionForListValue(eventKey, inputValue, isSummary);
                        break;

                    case DO.AuditEventTypeOptions.TASK_STOP:
                    case DO.AuditEventTypeOptions.TASK_START:
                    case DO.AuditEventTypeOptions.TASK_FULL_LOAD_STARTED:
                    case DO.AuditEventTypeOptions.TASK_FULL_LOAD_FINISHED:
                        return attNotificationsService.getEventDescriptionForArrayValue(eventKey, inputValue, isSummary);
                        break;
                    default:
                        return attNotificationsService.getEventDescriptionForUnitsValue(notificationName, eventKey, inputValue);
                        break;
                }
            },
            prepNotificationListForDisplay:function (groupType) {
                ArrayUtils.each(attNotificationsService.data.notifications, function (item) {
                    item.name = item.notification.name;
                    item.uiInfo = {
                        eventsNames:[],
                        eventsNamesAsString:"",
                        eventsDescription:[],
                        eventsDescriptionAsString:"",
                        recipients:[],
                        recipientsAsString: "",
                        actions:[],
                        associationType: locale.getString( 'common.notifications.AssociateGroup.N_A')
                    };

                    var uiEventKey = attNotificationsService.getUiEventKeyByNotification(item.notification);
                    var inputValue = attNotificationsService.getValueByInputPath(item.notification, uiEventKey);
                    var eventDescription = attNotificationsService.getEventDescription(item.name, uiEventKey, inputValue);
                    item.uiInfo.eventsNames.push(eventDescription);

                    if( !ObjectUtils.isEmpty(item.notification[attNotificationsService.DO_NOTIFI.on_set_actions]) ){
                        var _addRecipientsGroup = function (recipientsArr, labelKey) {
                            if( !ObjectUtils.isEmpty(recipientsArr) ){
                                var recipientsGroupText = locale.getString(labelKey) + attNotificationsService.CONSTANTS.Space;
                                recipientsGroupText += recipientsArr.join(attNotificationsService.CONSTANTS.SemicolonWithSpace);
                                item.uiInfo.recipients.push(recipientsGroupText);
                            }
                        };
                        ArrayUtils.each(item.notification[attNotificationsService.DO_NOTIFI.on_set_actions], function (deliveryItem) {
                            if(deliveryItem.$type != attNotificationsService.DO_NOTIFI.InternalNotificationDelivery){
                                //actions
                                //item.uiInfo.actions.push(attNotificationsService.data.deliveryDisplayNames[deliveryItem.$type]);

                                //recipients
                                if(deliveryItem.$type != attNotificationsService.DO_NOTIFI.EmailNotificationDelivery){
                                    item.uiInfo.recipients.push(attNotificationsService.data.deliveryDisplayNames[deliveryItem.$type]);
                                }
                                //recipients
                                if(deliveryItem.$type == attNotificationsService.DO_NOTIFI.EmailNotificationDelivery){
                                    _addRecipientsGroup( deliveryItem.to, "common.notifications.ToLabel");
                                    _addRecipientsGroup( deliveryItem.cc, "common.notifications.CcLabel");
                                    _addRecipientsGroup( deliveryItem.bcc, "common.notifications.BccLabel");
                                }
                            }
                        });
                    }

                    if(item.uiInfo.eventsNames.length > 0){
                        item.uiInfo.eventsNamesAsString = item.uiInfo.eventsNames.join("\n");
                    }
                    if(item.uiInfo.recipients.length > 0){
                        item.uiInfo.recipientsAsString = item.uiInfo.recipients.join("\n");
                    }
                    if(item.group_type == consts.Notification.GroupType.TASK ){
                        var cGroup = angular.copy(consts.Notification.Associate.ALL);
                        if(attNotificationsService.isNotificationAssociateWithTasks(item.notification)){
                            cGroup = angular.copy(consts.Notification.Associate.SELECTED);
                        }
                        item.uiInfo.associationType = attNotificationsService.getAssociateGroupLabel(cGroup);
                    }
                });
                attNotificationsService.applyGroupTypeFilterOnNotificationsList(groupType);
            },
            isNotificationAssociateWithTasks:function(notificationRule){
                var wasFound = false;
                var rulesLength = notificationRule[attNotificationsService.DO_NOTIFI.trigger].rules.length;
                for(var index=0; (index<rulesLength)&&(!wasFound);index++){
                    var ruleInTrigger = notificationRule[attNotificationsService.DO_NOTIFI.trigger].rules[index];
                    if(ruleInTrigger.member_name == attNotificationsService.CONSTANTS.FullTaskName && ruleInTrigger.operator == attNotificationsService.CONSTANTS.ONE_OF){
                        wasFound = true;
                    }
                }
                return wasFound;
            },
            applyDataOnGetNotificationRulesList:function (data, groupType, onSuccess) {
                if(attNotificationsService.callbackFunctions.GetNotificationRulesListSuccess){
                    attNotificationsService.callbackFunctions.GetNotificationRulesListSuccess(data, groupType, onSuccess);
                }
                else{
                    if( !ObjectUtils.isEmpty(data) ){
                        if(data && data[attNotificationsService.DO_NOTIFI.NotificationListObjectName] != null){
                            //empty notifications
                            attNotificationsService.data.notifications.length = 0;
                            Array.prototype.push.apply(attNotificationsService.data.notifications, data[attNotificationsService.DO_NOTIFI.NotificationListObjectName]);
                        }
                        else{
                            attNotificationsService.data.notifications = data;
                        }
                    }
                    attNotificationsService.prepNotificationListForDisplay(groupType);
                    if(onSuccess){
                        onSuccess();
                    }
                }
            },
            isDefinePutNotification:function () {
                return attNotificationsService.isSetContextMethod( consts.Notification.Methods.Put_Notification);
            },
            putNotification: function (notification, onSuccess, onError) {
                if( attNotificationsService.isDefinePutNotification() ){
                    var currentCallObjectCtx = attNotificationsService.getContextObjectByMethodKey(consts.Notification.Methods.Put_Notification, notification, {"notification":notification.name});
                    InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.Notification.Methods.Put_Notification, onSuccess, onError);
                }
            },
            enableNotification: function (notificationName, enable, onSuccess, onError) {
                if( attNotificationsService.isSetContextMethod( consts.Notification.Methods.Enable_Notification_Rule) ){
                    var currentCallObjectCtx = attNotificationsService.getContextObjectByMethodKey(consts.Notification.Methods.Enable_Notification_Rule, null, {"notification":notificationName, enable:enable});
                    InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.Notification.Methods.Enable_Notification_Rule, onSuccess, onError);
                }
            },
            applyNotificationRuleState:function (notificationsNamesArray, enabled, onSuccess, onError) {
                //updateCallerRole
                attNotificationsService.updateCallerRole();
                if(notificationsNamesArray.length == 0){
                    if(onSuccess){
                        onSuccess();
                    }
                    return;
                }
                if( attNotificationsService.isUserAllowToDoAction_EnableNotification( attNotificationsService.getCallerRole() ) ){
                    var successMessage = "";
                    if(notificationsNamesArray.length == 1){
                        var singleI18nConst = (enabled === true) ? "common.notifications.EnableSingleNotificationSucceeded" : "common.notifications.DisableSingleNotificationSucceeded";
                        successMessage = locale.getString(singleI18nConst, [ notificationsNamesArray[0] ]);
                    }
                    else{
                        var manyI18nConst = (enabled === true) ? "common.notifications.EnableManyNotificationSucceeded" : "common.notifications.DisableManyNotificationSucceeded";
                        successMessage = locale.getString(manyI18nConst, [notificationsNamesArray.length]);
                    }
                    //CreateBatch - applyNotificationRuleState
                    AttGlobalBatch.Begin();
                    //batch action
                    ArrayUtils.each(notificationsNamesArray, function( iNotificationName){
                        attNotificationsService.enableNotification(iNotificationName, enabled, null, onError);
                    });
                    //SubmitBatch
                    var batchPromise = AttGlobalBatch.Submit();
                    batchPromise.finally(function () {
                        GlobalMessagesService.setMessages(true, consts.errorModes.success, true, successMessage);
                        if(onSuccess){
                            onSuccess();
                        }
                    });
                }
            },
            getNotificationsNamesArrForEnableDisableState:function (dataRowSelection, enabledState) {
                var namesArray = [];
                ArrayUtils.each(dataRowSelection, function( dataRow){
                    if(dataRow.notification.enabled !== enabledState){
                        namesArray.push(dataRow.notification.name);
                    }
                });
                return namesArray;
            },
            deleteNotification: function (notificationsArray, onSuccess, onError) {
                //updateCallerRole
                attNotificationsService.updateCallerRole();
                //CreateBatch - deleteNotification
                AttGlobalBatch.Begin();
                ArrayUtils.each(notificationsArray, function( dataRow){
                    if(attNotificationsService.isSetContextMethod( consts.Notification.Methods.Delete_Notification) ){
                        var currentCallObjectCtx = attNotificationsService.getContextObjectByMethodKey(consts.Notification.Methods.Delete_Notification, null, {"notification":dataRow.notification.name});
                        InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.Notification.Methods.Delete_Notification, null, onError);
                    }
                    else if (attNotificationsService.executeFunctions.deleteNotificationFunc){
                        attNotificationsService.executeFunctions.deleteNotificationFunc(dataRow.notification.name, null, onError);
                    }
                });
                //SubmitBatch
                // AttGlobalBatch.Submit();
                var batchPromise = AttGlobalBatch.Submit();
                batchPromise.finally(function () {
                    if(onSuccess){
                        onSuccess();
                    }
                });
            },

            getNotificationsPreDefinedRules:function (putData, params, onSuccess, onError) {
                if (attNotificationsService.executeFunctions.getNotificationsPreDefinedRules){
                    attNotificationsService.executeFunctions.getNotificationsPreDefinedRules(
                        function (data) {
                            attNotificationsService.applyDataOnGetNotificationsPreDefinedRules(data, onSuccess);
                    }, onError);
                }
                else{
                    if(attNotificationsService.isSetContextMethod( consts.Notification.Methods.Get_Pre_Defined_Rules) ){
                        var currentCallObjectCtx = attNotificationsService.getContextObjectByMethodKey(consts.Notification.Methods.Get_Pre_Defined_Rules, putData, params);
                        InvokerService.invokeServiceMethod(currentCallObjectCtx, consts.Notification.Methods.Get_Pre_Defined_Rules,
                            function (data) {
                                attNotificationsService.applyDataOnGetNotificationsPreDefinedRules(data, onSuccess);
                        }, onError);
                    }
                }
            },
            getMessagesFromGeneralActionArray:function (setOrClearActionsArray) {
                var messagesObject = {console:"", email_subject:"", email_body:""};
                var innerDelivery = attNotificationsService.getInnerDeliveryActionFromArray(setOrClearActionsArray);
                messagesObject.console = innerDelivery["message"];
                var emailDelivery = attNotificationsService.getEmailDeliveryActionFromArray(setOrClearActionsArray);
                messagesObject.email_subject = emailDelivery["subject"];
                messagesObject.email_body = emailDelivery["message"];
                return messagesObject;
            },
            applyDataOnGetNotificationsPreDefinedRules:function (data, onSuccess) {
                if(attNotificationsService.callbackFunctions.applyDataOnGetNotificationsPreDefinedRulesSuccess){
                    attNotificationsService.callbackFunctions.applyDataOnGetNotificationsPreDefinedRulesSuccess(data, onSuccess);
                }
                else{
                    if(data && data[attNotificationsService.DO_NOTIFI.PreDefinedPropertyRules] != null){
                        if( ArrayUtils.isArray(data[attNotificationsService.DO_NOTIFI.PreDefinedPropertyRules]) ){
                            var rulesDictionary = {};
                            ArrayUtils.each(data[attNotificationsService.DO_NOTIFI.PreDefinedPropertyRules], function (preDefineNotification) {
                                // var uiEventKey = preDefineNotification[DO.NotificationRuleDto.ui_event_key];
                                var uiEventKey = preDefineNotification.ui_event_key;
                                var _uiProps = { messages:null, clear_messages: null, inputPath: attNotificationsService.CONSTANTS.InputPathArray};
                                if( attNotificationsService.isThresholdParameterInInnerPath(preDefineNotification)){
                                    //for notifications with more then one inner rule, the input value will be inside
                                    _uiProps.inputPath = attNotificationsService.CONSTANTS.InputPathInnerRule;
                                } else if (attNotificationsService.isDefinedValuesParameterInInnerPath(preDefineNotification)) {
                                    //for notifications with input but with no rules
                                    _uiProps.inputPath = attNotificationsService.CONSTANTS.InputPathInnerRuleArray;
                                }
                                var onSetActionsArray = preDefineNotification[attNotificationsService.DO_NOTIFI.on_set_actions];
                                _uiProps.messages = attNotificationsService.getMessagesFromGeneralActionArray(onSetActionsArray);

                                // not all of notifications have "on_clear_actions" !!!
                                if(  preDefineNotification[attNotificationsService.DO_NOTIFI.on_clear_actions] != null){
                                    var onClearActions = preDefineNotification[attNotificationsService.DO_NOTIFI.on_clear_actions];
                                    _uiProps.clear_messages = attNotificationsService.getMessagesFromGeneralActionArray(onClearActions);
                                }
                                rulesDictionary[uiEventKey] = {preDefine:preDefineNotification, uiProps:_uiProps};
                            });
                            attNotificationsService.data.preDefinedRules = rulesDictionary;
                        }
                        else {
                            attNotificationsService.data.preDefinedRules = data[attNotificationsService.DO_NOTIFI.PreDefinedPropertyRules];
                        }
                    }
                    if(onSuccess){
                        onSuccess(data);
                    }
                }
            },
            getVariablesFromDic: function (auditRecordType) {
                return attNotificationsService.data.variablesDictionary[auditRecordType];
            },
            prepDefAllEventsDictionary:function () {
                attNotificationsService.data.allEventsDictionary = {};
                var newEventsPropDic = {};
                var _applyEventsByGroupType = function (groupType) {
                    var eventsArray = attNotificationsService.executeFunctions.getEventsGroupsFunc(groupType);
                    if( !ObjectUtils.isEmpty(eventsArray) ){
                        ObjectUtils.forOwn(eventsArray, function (groupItemKey, groupItem) {
                            ArrayUtils.each(groupItem.events, function (eventItem) {
                                if( attNotificationsService.isAuditEventTypeExistInDO(attNotificationsService.data.eventcode[eventItem.eventKey]) || eventItem.hasInputValue ){
                                    if(newEventsPropDic[eventItem.eventKey] == null){
                                        newEventsPropDic[eventItem.eventKey] = ObjectUtils.deepClone(eventItem);
                                        newEventsPropDic[eventItem.eventKey].groupItemKey = groupItemKey;
                                        newEventsPropDic[eventItem.eventKey].textLabel = locale.getString(eventItem.label);
                                    }
                                }
                            });
                        });
                    }
                };
                //TASK
                _applyEventsByGroupType( consts.Notification.GroupType.TASK );
                //SERVER
                _applyEventsByGroupType( consts.Notification.GroupType.SERVER );
                //set allEventsDictionary
                attNotificationsService.data.allEventsDictionary = newEventsPropDic;
            },
            calcEventsGroups:function (groupType) {
                if (attNotificationsService.executeFunctions.getEventsGroupsFunc){
                    attNotificationsService.data.notificationGroups = attNotificationsService.executeFunctions.getEventsGroupsFunc(groupType);
                }
            },
            calcVariablesDictionary:function () {
                var dictionaryObject = {};
                if(attNotificationsService.executeFunctions.prepNotificationMessageVariables){
                    attNotificationsService.executeFunctions.prepNotificationMessageVariables(dictionaryObject, attNotificationsService.data.objectNamesForVariablesInDO);
                }
                else {
                    attNotificationsService.prepNotificationMessageVariablesDefault(dictionaryObject, attNotificationsService.data.objectNamesForVariablesInDO);
                }
                attNotificationsService.data.variablesDictionary = dictionaryObject;
            },
            setObjectNamesForVariablesInDO:function (array) {
                attNotificationsService.data.objectNamesForVariablesInDO = array;
            },
            setEventcode:function (array) {
                attNotificationsService.data.eventcode = array;
            },
            prepNotificationMessageVariablesDefault:function (dictionaryObject, doArraysNames) {
                var _getListWithPrefix = function (dicObject, auditRecordType) {
                    if(dicObject[auditRecordType] == null){
                        dicObject[auditRecordType] = [];
                    }
                    if(DO[auditRecordType] == null){
                        console.error("Can not find: '"+auditRecordType+"' in generated objects.");
                        return;
                    }
                    var tKeys = Object.keys(DO[auditRecordType]);
                    if(!ObjectUtils.isEmpty(_variablesWhiteList[auditRecordType])){
                        for(var deleteIndex=(tKeys.length-1); deleteIndex>=0; deleteIndex--){
                            var tKey = tKeys[deleteIndex];
                            if((tKey != null) && (_variablesWhiteList[auditRecordType].indexOf(tKey) == -1)){
                                tKeys.splice(deleteIndex, 1);
                            }
                        }
                    }
                    for(var index=0; index<tKeys.length; index++){
                        var tKey = tKeys[index];
                        if(tKey != null ){
                            var tItem = attNotificationsService.data.variablePreFix +tKey + attNotificationsService.data.variablePostFix;
                            tItem = tItem.toUpperCase();
                            if(dicObject[auditRecordType].indexOf(tItem) == -1){
                                dicObject[auditRecordType].push(tItem);
                            }
                        }
                    }
                    dicObject[auditRecordType].sort();
                };

                if(doArraysNames != null && doArraysNames.length > 0){
                    ArrayUtils.each(doArraysNames, function (auditRecordType) {
                        _getListWithPrefix(dictionaryObject, auditRecordType);
                    });
                }
            },
            isNotificationNameExists : function (name) {
                return (ArrayUtils.indexOfByProperty(attNotificationsService.data.notifications, attNotificationsService.DO_NOTIFI.name, name) > -1);
            },
            getNextNotificationDefaultName : function (groupType) {
                var default_name = (groupType == consts.Notification.GroupType.TASK) ? locale.getString("common.notifications.NewTaskNotification") : locale.getString("common.notifications.NewServerNotification");
                if (attNotificationsService.data.notifications == null || attNotificationsService.data.notifications.length == 0) {
                    return default_name;
                }
                else {
                    return Utils.generateNewName(default_name, attNotificationsService.isNotificationNameExists, null, null);
                }
            },
            setCallerRole:function (callerRole) {
                attNotificationsService.data.callerRole = callerRole;
            },
            getCallerRole:function () {
                return attNotificationsService.data.callerRole;
            },
            updateCallerRole:function () {
                if(attNotificationsService.callbackFunctions.getNotificationUserCallerRole != null){
                    attNotificationsService.data.callerRole = attNotificationsService.callbackFunctions.getNotificationUserCallerRole();
                }
            },
            openNotificationList:function ( groupType, variablesWhiteList) {
                if(ObjectUtils.isEmpty(attNotificationsService.data.rulesListSelectedGroupType)){
                    attNotificationsService.data.rulesListSelectedGroupType = consts.Notification.GroupType.SERVER;
                }
                if( ObjectUtils.isEmpty(groupType) ){
                    groupType = attNotificationsService.data.rulesListSelectedGroupType;
                }
                if(attNotificationsService.data.rulesListSelectedGroupType != groupType){
                    attNotificationsService.data.rulesListSelectedGroupType = groupType;
                }

                if(!ObjectUtils.isEmpty(variablesWhiteList)){
                    _variablesWhiteList = variablesWhiteList;
                }

                //updateCallerRole
                attNotificationsService.updateCallerRole();
                attNotificationsService.getNotificationsPreDefinedRules();

                attNotificationsService.calcEventsGroups(groupType);
                attNotificationsService.calcVariablesDictionary();


                attNotificationsService.setDeliveryDisplayNames();
                modalService.showModal(
                    {
                        contentTemplate: 'scripts/angular.common/attNotifications/rulesListView.html',
                        headerText: locale.getString('common.notifications.NotificationsRules'),
                        resizable: true,
                        showFooter: true,
                        actionButtonText: locale.getString('common.base.Close'),
                        closeButtonText: '',
                        minWidth: 850,
                        minHeight: 400,
                        closeOnRoute: true,
                        model: { },
                        onBeforeOk: function (vm, okCallback) {
                            if (okCallback){
                                okCallback();
                            }
                        }
                    },
                    { windowClass: 'notificationsRulesPopup' }
                ).then(function (res) {

                });
            },
            prepGroupTypeDefault:function (notificationRule, isNew, notificationGroups) {
                var keys = Object.keys(notificationGroups);
                var notificationTypeRadioBtnGroup = "";
                if(isNew){
                    notificationTypeRadioBtnGroup = keys[0];
                }
                else if( isNew == false){
                    var uiEventKey = attNotificationsService.getUiEventKeyByNotification(notificationRule);
                    for(var keyIndex=0; keyIndex < keys.length && notificationTypeRadioBtnGroup.length == 0; keyIndex++){
                        var iGroupKey = keys[keyIndex];
                        if(notificationGroups[iGroupKey] != null && notificationGroups[iGroupKey].events != null && notificationGroups[iGroupKey].events.length > 0){
                            for(var eventIndex=0; eventIndex < notificationGroups[iGroupKey].events.length && notificationTypeRadioBtnGroup.length == 0; eventIndex++){
                                if(notificationGroups[iGroupKey].events[eventIndex] != null && uiEventKey == notificationGroups[iGroupKey].events[eventIndex].eventKey){
                                    notificationTypeRadioBtnGroup = iGroupKey;
                                }
                            }
                        }
                    }
                }
                return notificationTypeRadioBtnGroup;
            },
            resetDictionaryValuesToFalse:function (dictionary) {
                ObjectUtils.forOwn(dictionary, function (itemKey, itemBool) {
                    dictionary[itemKey] = false;
                });
                return dictionary;
            },
            changeNotificationGroupType:function (popupVm) {

            },
            isAuditEventTypeExistInDO:function (auditEventType) {
              //AuditEventTypeOptions
                return (DO[attNotificationsService.DO_NOTIFI.AuditEventTypeOptions][auditEventType] != null);
            },
            prepSelectedEventsDefault:function (notificationRule, isNew, notificationGroups, uiData) {
                //AuditEventTypeOptions
                var selectedEvents = {};
                var uiEventKey = (isNew)? null : attNotificationsService.getUiEventKeyByNotification(notificationRule);
                ObjectUtils.forOwn(notificationGroups, function (groupItemKey, groupItem) {
                    ArrayUtils.each(groupItem.events, function (eventItem) {
                        if( attNotificationsService.isAuditEventTypeExistInDO(attNotificationsService.data.eventcode[eventItem.eventKey]) || eventItem.hasInputValue){
                            //selectedEvents - bool
                            selectedEvents[eventItem.eventKey] = false;
                            //eventsProperty - object
                            if(uiData.eventsProperty[eventItem.eventKey] == null){
                                // var defaultEventItem = {eventKey:"", valid:true, displayValue:"1", calcValue:"1", errorMessage:"", selectedUnitSize:"KB", regEx:new RegExp("^[0-9]$"), regExErrorMsg:"", min:0, hasInputValue:false, units:["KB","MB"], calcValueInputUser: null, getDisplayValueFromServerReplayByUnits: null}
                                uiData.eventsProperty[eventItem.eventKey] = ObjectUtils.deepClone(eventItem);
                            }
                            uiData.eventsProperty[eventItem.eventKey]["groupItemKey"] = groupItemKey;
                            if(eventItem.hasInputValue){
                                uiData.eventsProperty[eventItem.eventKey].valid = true;
                                uiData.eventsProperty[eventItem.eventKey].errorMessage = "";

                                var prefsSelectedUnitSize = null;
                                if( !ObjectUtils.isEmpty(uiData.tempSingleNotificationUserPrefs) ){
                                    prefsSelectedUnitSize = attNotificationsService.getUserPrefsSingleNotificationForProp(uiData.tempSingleNotificationUserPrefs, eventItem.eventKey, "selectedUnitSize");
                                }

                                if(eventItem.units && eventItem.units.length > 0) {
                                    uiData.eventsProperty[eventItem.eventKey].selectedUnitSize = !ObjectUtils.isEmpty(prefsSelectedUnitSize) ? prefsSelectedUnitSize : eventItem.units[0];
                                    uiData.eventsProperty[eventItem.eventKey].calcValue = 0;
                                }

                                if(!uiData.eventsProperty[eventItem.eventKey].initialValue) {
                                    uiData.eventsProperty[eventItem.eventKey].initialValue = attNotificationsService.CONSTANTS.InitialValue;
                                }

                                // uiData.eventsProperty[eventItem.eventKey].displayValue =
                                //     uiData.eventsProperty[eventItem.eventKey].initialValue || attNotificationsService.CONSTANTS.InitialValue;

                                //Do this - ONLY when user-prefs is empty - for exist notification, Not New!
                                if(!isNew && uiEventKey != null && uiEventKey == eventItem.eventKey && ObjectUtils.isEmpty(prefsSelectedUnitSize) && uiData.eventsProperty[eventItem.eventKey].getUnitsDisplayLabel != null){
                                    var inputValue = attNotificationsService.getValueByInputPath(notificationRule, uiEventKey);
                                    if( inputValue != null && !isNaN(Number(inputValue)) ){
                                        var displayObj = uiData.eventsProperty[eventItem.eventKey].getUnitsDisplayLabel( Number(inputValue) );
                                        uiData.eventsProperty[eventItem.eventKey].displayValue = displayObj.val;
                                        uiData.eventsProperty[eventItem.eventKey].calcValue = displayObj.val;
                                        uiData.eventsProperty[eventItem.eventKey].selectedUnitSize = displayObj.unitLabel;
                                    }
                                }
                            }
                        }
                        else {
                            console.error("Can not find: '" + eventItem.eventKey + "', object properties.")
                        }
                    });
                });

                if( isNew == false){
                    //getVariablesList
                    uiData.variablesList = attNotificationsService.getVariablesList(notificationRule.audit_record_type);
                    //get trigger events rules & input data
                    var uiEventKey = attNotificationsService.getUiEventKeyByNotification(notificationRule);
                    if(attNotificationsService.isAuditEventTypeExistInDO(attNotificationsService.data.eventcode[uiEventKey]) || uiData.eventsProperty[uiEventKey].hasInputValue){
                        selectedEvents[uiEventKey] = true;
                        if((notificationRule.$type == attNotificationsService.DO_NOTIFI.NotificationAlarmRuleDto) || (uiData.eventsProperty[uiEventKey].hasInputValue)){
                            var inputValue = attNotificationsService.getValueByInputPath(notificationRule, uiEventKey);

                            var calcVal = null;
                            var displayVal = null;
                            if(attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathArray ||
                                attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathInnerRuleArray){
                                calcVal = inputValue;
                                displayVal = inputValue.join(", ");
                            } else if (attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathInnerRule &&
                                ObjectUtils.get(attNotificationsService.data.preDefinedRules[uiEventKey].preDefine, attNotificationsService.CONSTANTS.InputPathInnerRule) == attNotificationsService.CONSTANTS.NOTIFICATION_DEFINED_VALUES) {
                                calcVal = inputValue;
                                displayVal = inputValue;
                            } else {
                                calcVal = displayVal = Number(inputValue);
                            }

                            uiData.eventsProperty[uiEventKey].calcValue = calcVal ;
                            uiData.eventsProperty[uiEventKey].displayValue = displayVal;
                            if(uiData.eventsProperty[uiEventKey].getDisplayValueFromServerReplayByUnits != null){
                                uiData.eventsProperty[uiEventKey].displayValue = uiData.eventsProperty[uiEventKey].getDisplayValueFromServerReplayByUnits( Number(inputValue), uiData.eventsProperty[uiEventKey].selectedUnitSize );
                            }
                        }
                    }
                    else{
                        console.log("inputItem: " + uiEventKey);
                    }

                    if( !ObjectUtils.isEmpty(uiEventKey) ){
                        if(ObjectUtils.isEmpty( uiData.messages.console) ){
                            uiData.messages.console = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.messages["console"];
                        }
                        if(ObjectUtils.isEmpty( uiData.messages.emailSubject) ){
                            uiData.messages.emailSubject = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.messages["email_subject"];
                        }
                        if(ObjectUtils.isEmpty( uiData.messages.emailBody) ){
                            uiData.messages.emailBody = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.messages["email_body"];
                        }

                        // clearMessages
                        if(notificationRule.on_clear_actions != null){
                            if(ObjectUtils.isEmpty( uiData.clearMessages.console) ){
                                uiData.clearMessages.console = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.clear_messages["console"];
                            }
                            if(ObjectUtils.isEmpty( uiData.clearMessages.emailSubject) ){
                                uiData.clearMessages.emailSubject = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.clear_messages["email_subject"];
                            }
                            if(ObjectUtils.isEmpty( uiData.clearMessages.emailBody) ){
                                uiData.clearMessages.emailBody = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.clear_messages["email_body"];
                            }
                        }
                    }
                }
                else {
                    // NEW notification
                    var notificationEventKey = notificationRule.ui_event_key;
                    if( ObjectUtils.isEmpty(notificationRule.ui_event_key) ){
                        var keys = Object.keys(selectedEvents);
                        notificationEventKey = keys[0];
                    }

                    selectedEvents[notificationEventKey] = true;
                    if(uiData.eventsProperty[notificationEventKey] == null){
                        uiData.eventsProperty[notificationEventKey] = {};
                        // uiData.eventsProperty[notificationEventKey].displayValue = attNotificationsService.CONSTANTS.InitialValue;
                        uiData.eventsProperty[notificationEventKey].calcValue = 0;
                        uiData.eventsProperty[notificationEventKey].valid = true;
                    }
                    if( !ObjectUtils.isEmpty(attNotificationsService.data.preDefinedRules) && attNotificationsService.data.preDefinedRules[ notificationEventKey ] != null){

                        if(notificationRule.$type != attNotificationsService.data.preDefinedRules[ notificationEventKey ].preDefine.$type){
                            attNotificationsService.margeNotificationObjectAndRemoveProps(notificationRule, notificationEventKey);
                        }
                        // set initial variablesList
                        uiData.variablesList = attNotificationsService.getVariablesList( notificationRule.audit_record_type );


                        // // set initial trigger object
                        // notificationRule[attNotificationsService.DO_NOTIFI.trigger] = ObjectUtils.deepClone( attNotificationsService.data.preDefinedRules[ notificationEventKey ][attNotificationsService.DO_NOTIFI.trigger] );

                        // set initial messages
                        uiData.messages.emailSubject = attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.messages["email_subject"];
                        uiData.messages.emailBody = attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.messages["email_body"];
                        uiData.messages.console = attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.messages["console"];

                        if(notificationRule.on_clear_actions != null && attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.clear_messages != null){
                            // clearMessages
                            uiData.clearMessages.console = attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.clear_messages["console"];
                            uiData.clearMessages.emailSubject = attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.clear_messages["email_subject"];
                            uiData.clearMessages.emailBody = attNotificationsService.data.preDefinedRules[ notificationEventKey ].uiProps.clear_messages["email_body"];
                        }
                   }
                }
                uiData.selectedEvents = selectedEvents;
                //displayNamesSelectedEvents
                attNotificationsService.updateDisplayNamesSelectedEvents(uiData);
            },
            updateDisplayNamesSelectedEvents:function (uiData) {
                uiData.displayNamesSelectedEvents = [];
                if( !ObjectUtils.isEmpty(uiData.singleSelectedEventRadioBtn) ){
                    uiData.displayNamesSelectedEvents.push(attNotificationsService.data.notificationsDisplayNames[uiData.singleSelectedEventRadioBtn]);
                }
                else{
                    var eventsKeysArr = Object.keys(uiData.selectedEvents);
                    //eventsNames
                    ArrayUtils.each(eventsKeysArr, function (eventKey) {
                        if(uiData.selectedEvents[eventKey] === true){
                            uiData.displayNamesSelectedEvents.push(attNotificationsService.data.notificationsDisplayNames[eventKey]);
                        }
                    });
                }

            },
            prepNotificationValidationOverrideDefault:function () {
                return {
                    name: {
                        unique: true,
                        required: true,
                        validcharacters: "^[a-zA-Z0-9]+[a-zA-Z0-9_ .-]*$",
                        maxlength: 64
                    }
                };
            },
            prepMessagesValidationOverrideDefault:function () {
                return {
                    console: {
                        required: false,
                        maxlength: 255
                    },
                    emailSubject: {
                        required: false,
                        minlength: 1,
                        maxlength: 255
                    },
                    emailBody: {
                        required: false,
                        minlength: 1,
                        maxlength: 30000
                    }
                };
            },
            getNotificationUiDataBasicStructure:function (isNew, groupType, callerRole) {
                return {
                    isNew: isNew,
                    vmCanBeSave: false,
                    dirtyNotification: false,
                    groupType: groupType,
                    callerRole: callerRole,
                    eventDescription: "",
                    notificationValidationOverride : {},
                    messagesValidationOverride : {},
                    tempSingleNotificationUserPrefs:{},
                    notificationTypeRadioBtnGroup : "",
                    previousGroupType : "",
                    searchVariableTerm : "",
                    variablesList: [],
                    singleSelectedEventRadioBtn : null,
                    selectedEvents : {},
                    previousSelectedEventsString:"",
                    eventsProperty : {},
                    displayNamesSelectedEvents: [],
                    deliveryAction:{
                        isEventLog: (isNew),
                        isEmail: false
                    },
                    emailRecipients:{
                        to:"",
                        cc:"",
                        bcc:""
                    },
                    emailRecipientsValidation:{
                        to:true,
                        cc:true,
                        bcc:true
                    },
                    messages:{
                        console:"",
                        emailSubject:"",
                        emailBody:""
                    },
                    clearMessages:{
                        console:"",
                        emailSubject:"",
                        emailBody:""
                    },
                    stepEventsTemplateUrl: null,
                    associate:{
                        group: "",
                        groupLabel:locale.getString( 'common.notifications.AssociateGroup.N_A'),
                        serversNamesList:[],
                        validServersNamesList:[],
                        selectedTasks:[],
                        fullTasksList:[],
                        displayedTasksList:[],
                        validTasksList:[]
                    }
                };
            },
            prepUiDataDefault:function (notificationRule, isNew, groupType, stepEventsTemplateUrl, callerRole) {
                var uiData = attNotificationsService.getNotificationUiDataBasicStructure(isNew, groupType, callerRole);
                if(attNotificationsService.executeFunctions.prepUiData){
                    uiData = attNotificationsService.executeFunctions.prepUiData(uiData, notificationRule, isNew, attNotificationsService.data.notificationGroups);
                }
                else{
                    if( ObjectUtils.isEmpty(stepEventsTemplateUrl) && !ObjectUtils.isEmpty(attNotificationsService.data.stepEventsTemplateUrl)){
                        uiData.stepEventsTemplateUrl = attNotificationsService.data.stepEventsTemplateUrl;
                    }
                    uiData.useStepEventsTemplateBool = !ObjectUtils.isEmpty(stepEventsTemplateUrl);
                    uiData.notificationValidationOverride = attNotificationsService.prepNotificationValidationOverrideDefault();
                    uiData.messagesValidationOverride = attNotificationsService.prepMessagesValidationOverrideDefault();

                    uiData.notificationTypeRadioBtnGroup = attNotificationsService.prepGroupTypeDefault(notificationRule, isNew, attNotificationsService.data.notificationGroups);
                    uiData.previousGroupType = uiData.notificationTypeRadioBtnGroup;
                    attNotificationsService.prepSelectedEventsDefault(notificationRule, isNew, attNotificationsService.data.notificationGroups, uiData);

                    if(!isNew){

                        uiData.tempSingleNotificationUserPrefs = attNotificationsService.getUserPrefsForSingleNotification(notificationRule.name);

                        if(notificationRule[attNotificationsService.DO_NOTIFI.on_set_actions] != null && notificationRule[attNotificationsService.DO_NOTIFI.on_set_actions].length > 0){

                            ArrayUtils.each(notificationRule[attNotificationsService.DO_NOTIFI.on_set_actions], function (actionItem) {
                                // TODO: move to call back
				                //NotificationPublicDefTypeIds
                                if(attNotificationsService.DO_NOTIFI.InternalNotificationDelivery != null && actionItem["$type"] == attNotificationsService.DO_NOTIFI.InternalNotificationDelivery){
                                    if( !ObjectUtils.isEmpty(actionItem["message"]) && uiData.messages.console != actionItem["message"] ){
                                        uiData.messages.console = actionItem["message"];
                                    }
                                }
                                else if(actionItem["$type"] == attNotificationsService.DO_NOTIFI.EventLogNotificationDelivery){
                                    uiData.deliveryAction.isEventLog = true;
                                    if( !ObjectUtils.isEmpty(actionItem["subject"]) && (uiData.messages.emailSubject != actionItem["subject"]) ){
                                        uiData.messages.emailSubject = actionItem["subject"];
                                    }
                                    if( !ObjectUtils.isEmpty(actionItem["message"]) && (uiData.messages.emailBody != actionItem["message"]) ){
                                        uiData.messages.emailBody = actionItem["message"];
                                    }
                                }
                                else if(actionItem["$type"] == attNotificationsService.DO_NOTIFI.EmailNotificationDelivery){
                                    if( !ObjectUtils.isEmpty(actionItem["subject"]) && (uiData.messages.emailSubject != actionItem["subject"]) ){
                                        uiData.messages.emailSubject = actionItem["subject"];
                                    }
                                    if( !ObjectUtils.isEmpty(actionItem["message"]) && (uiData.messages.emailBody != actionItem["message"]) ){
                                        uiData.messages.emailBody = actionItem["message"];
                                    }
                                    var isMailRecipientsTo = !ObjectUtils.isEmpty(actionItem["to"]);
                                    if( isMailRecipientsTo ){
                                        uiData.emailRecipients.to  = actionItem["to"].join(attNotificationsService.CONSTANTS.SemicolonWithSpace);
                                    }
                                    var isMailRecipientsCc = !ObjectUtils.isEmpty(actionItem["cc"]);
                                    if( isMailRecipientsCc ){
                                        uiData.emailRecipients.cc  = actionItem["cc"].join(attNotificationsService.CONSTANTS.SemicolonWithSpace);
                                    }
                                    var isMailRecipientsBcc = !ObjectUtils.isEmpty(actionItem["bcc"]);
                                    if( isMailRecipientsBcc ){
                                        uiData.emailRecipients.bcc = actionItem["bcc"].join(attNotificationsService.CONSTANTS.SemicolonWithSpace);
                                    }
                                    if(isMailRecipientsTo || isMailRecipientsCc || isMailRecipientsBcc){
                                        uiData.deliveryAction.isEmail = true;
                                    }
                                }
                            });
                        }

                        if(notificationRule[attNotificationsService.DO_NOTIFI.trigger] != null && notificationRule[attNotificationsService.DO_NOTIFI.trigger].rules.length > 0){
                            ArrayUtils.each(notificationRule[attNotificationsService.DO_NOTIFI.trigger].rules, function (ruleInTrigger, btgi) {
                                if(ruleInTrigger.member_name == attNotificationsService.CONSTANTS.FullTaskName && ruleInTrigger.operator == attNotificationsService.CONSTANTS.ONE_OF){
                                    ArrayUtils.each(ruleInTrigger.inputs, function (inputVal, bsi) {
                                        var namesArr = inputVal.split(attNotificationsService.CONSTANTS.SEP);
                                        var tTaskItem = {"server_name":namesArr[0], "task_name":namesArr[1], "joined_server_task":inputVal};
                                        uiData.associate.selectedTasks.push(tTaskItem);
                                    });
                                }
                            });
                        }

                        uiData.associate.minVersion = uiData.eventsProperty[notificationRule.ui_event_key].minVersion;
                    }

                    var selectedEventsArray = attNotificationsService.getSelectedEventsStringArray(uiData.selectedEvents);
                    uiData.previousSelectedEventsString = selectedEventsArray.join(",");
                    uiData.singleSelectedEventRadioBtn = selectedEventsArray[0];
                    attNotificationsService.updateWizardEventDescription(uiData, notificationRule);
                    if(uiData.groupType == consts.Notification.GroupType.TASK ){
                        uiData.associate.group = angular.copy(consts.Notification.Associate.ALL);
                        if(attNotificationsService.isNotificationAssociateWithTasks(notificationRule)){
                            uiData.associate.group = angular.copy(consts.Notification.Associate.SELECTED);
                        }
                        uiData.associate.groupLabel = attNotificationsService.getAssociateGroupLabel(uiData.associate.group);
                    }
                }
                return uiData;
            },
            setJoinedServerTaskProp:function(task){
                task[attNotificationsService.CONSTANTS.joined_server_task] = task[attNotificationsService.CONSTANTS.server_name] + attNotificationsService.CONSTANTS.SEP + task[attNotificationsService.CONSTANTS.task_name];
            },
            updateWizardEventDescription:function (uiData, notification) {
                uiData.eventDescription = attNotificationsService.getEventDescription(notification.name, notification.ui_event_key, uiData.eventsProperty[notification.ui_event_key].calcValue, true);
            },
            showSaveOrDiscardConfirmDialog:function (wizardCanBeSave, closeWizardFnc, onConfirmSave) {
                var showConfirmOptions = {
                    headerText: locale.getString("common.notifications.SaveChangesConfirmTitle"),
                    bodyText: locale.getString("common.notifications.DoYouWantSaveNotificationChangesConfirmBody"),
                    msgType: modalService.modalConfirmationType.Warning,
                    onBeforeClose: function(vm, closeConfirmFnc){
                        closeConfirmFnc();
                    },
                    onBeforeOk: function(vm, closeConfirmFnc){
                        // === Don't Save ===
                        closeConfirmFnc();
                        closeWizardFnc();
                    }
                };

                if(wizardCanBeSave){
                    //add additional values & functions
                    showConfirmOptions.model = {
                        showConfirmModelSecondOptionOkDisabled : (!wizardCanBeSave)
                    };
                    showConfirmOptions.actionButtonText = locale.getString("common.base.Discard");
                    showConfirmOptions.secondOptionActionButtonText = locale.getString("common.base.Save");
                    showConfirmOptions.secondOptionOkDisabledProp = "showConfirmModelSecondOptionOkDisabled";
                    showConfirmOptions.onBeforeSecondOptionOk = function(vm, closeConfirmFnc){
                        // === save ===
                        closeConfirmFnc();
                        //onConfirmSave
                        if(onConfirmSave){
                            onConfirmSave();
                        }

                    };
                }
                else{
                    //set values for discard
                    showConfirmOptions.headerText = locale.getString("common.notifications.DiscardChangesConfirmTitle");
                    showConfirmOptions.bodyText = locale.getString("common.notifications.SomeOfYourChangesAreNotValid");
                    showConfirmOptions.questionText = locale.getString("common.notifications.CloseTheWindowAnyway");
                    showConfirmOptions.actionButtonText = locale.getString("common.base.Yes");
                    showConfirmOptions.closeButtonText = locale.getString("common.base.No");
                }
                modalService.showConfirm(showConfirmOptions);
            },
            getNewNotificationFromPreDefined :function (selectedGroupType, notificationEventKey) {
                var groupKeys = Object.keys(attNotificationsService.data.notificationGroups);
                var eventGroup = groupKeys[0];
                if( ObjectUtils.isEmpty(notificationEventKey)){
                    notificationEventKey = attNotificationsService.data.notificationGroups[eventGroup].events[0].eventKey;
                }
                var newNotificationRule = ObjectUtils.deepClone(attNotificationsService.data.preDefinedRules[notificationEventKey].preDefine);
                newNotificationRule["name"] = attNotificationsService.getNextNotificationDefaultName(selectedGroupType);
                return newNotificationRule;
            },

            showNotificationRuleWizard : function (notificationRule, isNew, selectedGroupType, stepEventsTemplateUrl, onSuccess, selectedItems) {
                //updateCallerRole
                attNotificationsService.updateCallerRole();
                //set template for role "VIEWER"
                var wizardContentTemplate = "scripts/angular.common/attNotifications/viewSummaryOnlyPopup.html";
                var _wizardWindowClass = "newNotificationsWizardPopup VIEWONLY";
                var _minWidth = 600;
                var _minHeight = 480;
                var _closeOnRoute = true;
                var showWizardButtonsForViewerOnly = true;
                //get current role
                var callerRole = attNotificationsService.getCallerRole();
                //change template if higher role
                if( attNotificationsService.isUserAllowToDoAction_PutNotification( callerRole) ){
                    wizardContentTemplate = "scripts/angular.common/attNotifications/newEditNotificationWizard.html";
                    _wizardWindowClass = "newNotificationsWizardPopup";
                    _minWidth = 1140;
                    _minHeight = 620;
                    _closeOnRoute = false;
                    showWizardButtonsForViewerOnly = false;
                }

                attNotificationsService.checkUserPreferencesInfo();
                if(isNew && notificationRule == null){
                    notificationRule = attNotificationsService.getNewNotificationFromPreDefined(selectedGroupType, null);
                }
                //prepUiData
                var uiData = attNotificationsService.prepUiDataDefault(notificationRule, isNew, selectedGroupType, stepEventsTemplateUrl, callerRole);
                uiData.groupType = selectedGroupType;
                uiData.showWizardButtonsForViewerOnly = showWizardButtonsForViewerOnly;
                uiData.selectedItems = selectedItems;
                var headerLabel = notificationRule.name;
                if(isNew){
                    headerLabel = (uiData.groupType == consts.Notification.GroupType.TASK) ? locale.getString("common.notifications.NewTaskNotification") : locale.getString("common.notifications.NewServerNotification");
                }

                modalService.showWizard(
                    {
                        contentTemplate: wizardContentTemplate,
                        headerText: headerLabel,
                        resizable: true,
                        minWidth: _minWidth,
                        minHeight: _minHeight,
                        closeOnRoute: function (popupVm) {
                            return ( _closeOnRoute === true || !popupVm.uiData.dirtyNotification || popupVm.uiData.dirtyNotification && !popupVm.uiData.vmCanBeSave);
                        },
                        model: {
                            notification: notificationRule,
                            uiData: uiData,
                            existingNotifications: attNotificationsService.data.notifications
                        },
                        onBeforeClose: function(popupVm, closeWizardFnc){
                            if(popupVm.uiData.dirtyNotification){
                                attNotificationsService.showSaveOrDiscardConfirmDialog(popupVm.uiData.vmCanBeSave, closeWizardFnc, function () {
                                    attNotificationsService.beforePutNotification(popupVm, function () {
                                        closeWizardFnc();
                                        if(onSuccess){
                                            onSuccess();
                                        }
                                    });
                                });
                            }
                            else{
                                closeWizardFnc();
                            }
                        },
                        onBeforeOk:function (popupVm, closeWizardFnc) {
                            if( popupVm.uiData.dirtyNotification || popupVm.uiData.isNew){
                                attNotificationsService.beforePutNotification(popupVm, function () {
                                    closeWizardFnc();
                                    onSuccess();
                                });
                            }
                            else {
                                closeWizardFnc();
                            }
                        }
                    },
                    {
                        windowClass: _wizardWindowClass
                    }).then(function (popupVm) {

                    }
                );
            },
            beforePutNotification:function (popupVm, onSuccess) {
                var callerRole = attNotificationsService.getCallerRole();
                if( attNotificationsService.isUserAllowToDoAction_PutNotification(callerRole) ){
                    if( popupVm.uiData.dirtyNotification  || popupVm.uiData.isNew){

                        if(!popupVm.uiData.deliveryAction.isEmail){
                            attNotificationsService.checkAndRemoveEmailRecipientsIfDefine(popupVm);
                        }
                        if( (popupVm.uiData.associate.group == consts.Notification.Associate.ALL) || (popupVm.uiData.associate.selectedTasks.length == 0)){
                            popupVm.uiData.associate.selectedTasks.length = 0;
                            attNotificationsService.updateRulesForAssociateTasks(popupVm);
                        }

                        attNotificationsService.updateRuleForMinVersion(popupVm);

                        var notificationInput = ObjectUtils.get(popupVm.notification, attNotificationsService.data.preDefinedRules[popupVm.notification.ui_event_key].uiProps.inputPath);

                        if(ArrayUtils.isArray(notificationInput)) {
                            var inputsArr = attNotificationsService.getTrimmedArray(notificationInput);
                            ArrayUtils.removeElementFromArray(inputsArr, "");
                            notificationInput = inputsArr;
                        }

                        ObjectUtils.set(popupVm.notification, attNotificationsService.data.preDefinedRules[popupVm.notification.ui_event_key].uiProps.inputPath, notificationInput);

                        attNotificationsService.putNotification(popupVm.notification, function () {
                            attNotificationsService.setUserPrefsForSingleNotification(popupVm.notification.name, popupVm.uiData.tempSingleNotificationUserPrefs);
                            attNotificationsService.setUserPreferencesInfo();
                            if(onSuccess){
                                onSuccess();
                            }
                        });
                    }
                }
            },
            validateEventsInputsValue:function (vmNotification, uiData, reCalcValidProp) {
                var isValid = true;
                var selectedEventsKeys = Object.keys(uiData.selectedEvents);
                for(var index = 0; index < selectedEventsKeys.length && isValid; index++){
                    var tempEventKey = selectedEventsKeys[index];
                    if( uiData.selectedEvents[tempEventKey] === true && uiData.eventsProperty[tempEventKey] != null && uiData.eventsProperty[tempEventKey].hasInputValue){
                        if(reCalcValidProp === false && index > 0){
                            isValid = uiData.eventsProperty[tempEventKey].valid;
                        }
                        else{
                            //vmNotification
                            var displayValue = uiData.eventsProperty[tempEventKey].displayValue;
                            var initialValue = uiData.eventsProperty[tempEventKey].initialValue || attNotificationsService.CONSTANTS.InitialValue;
                            var isInitialValue = (displayValue == initialValue || displayValue == undefined || displayValue == attNotificationsService.CONSTANTS.EmptyString);
                            isValid = (displayValue != attNotificationsService.CONSTANTS.EmptyString);

                            isValid = isValid && !isInitialValue;
                            var tErrMsg = (isValid  || isInitialValue) ? "" : locale.getString("common.notifications.ValueIsNotValid");

                            //not Initial Value
                            if( !isInitialValue ){
                                var calcValueNumber = Number(uiData.eventsProperty[tempEventKey].calcValue);

                                // is a integer (not decimal)
                                if(isValid &&  uiData.eventsProperty[tempEventKey].regEx != null && !(uiData.eventsProperty[tempEventKey].regEx).test(displayValue) ){
                                    isValid = false;
                                    if(ObjectUtils.isEmpty(displayValue)){
                                        tErrMsg = locale.getString("common.notifications.ValueIsNotValid");
                                    } else {
                                        tErrMsg = uiData.eventsProperty[tempEventKey].regExErrorMsg || locale.getString("common.notifications.ValueIsNotValid");
                                    }
                                    //tErrMsg = uiData.eventsProperty[tempEventKey].regExErrorMsg || locale.getString("common.notifications.ValueIsNotValid");
                                }
                                // value is number
                                var valueMustBeNumber = (uiData.eventsProperty[tempEventKey].NumericInputValueMandatory !== false);
                                if( isValid && valueMustBeNumber && isNaN( Number(displayValue) ) ){
                                    isValid = false;
                                    tErrMsg = locale.getString("common.notifications.ValueMustBeNumber");
                                }
                                // value is negative
                                if( isValid && calcValueNumber < 0  ){
                                    isValid = false;
                                    tErrMsg = locale.getString("common.notifications.ValueMustBeAtLeastZero");
                                }
                                // is a integer (not decimal)
                                if(isValid &&  calcValueNumber % 1 > 0 ){
                                    isValid = false;
                                    tErrMsg = locale.getString("common.notifications.ValueCannotBeDecimalNumber");
                                }
                                //Minimum value
                                if(isValid && uiData.eventsProperty[tempEventKey].min != null ){
                                    if(uiData.eventsProperty[tempEventKey].units == null) {
                                        isValid = attNotificationsService.checkInputForMinMax(uiData, tempEventKey, true);
                                        if(!isValid) {
                                            tErrMsg = locale.getString("common.notifications.ValueMustBeAtLeast", [uiData.eventsProperty[tempEventKey].min]);
                                        }
                                    } else if( uiData.eventsProperty[tempEventKey].min >  calcValueNumber ){
                                        isValid = false;
                                        tErrMsg = locale.getString("common.notifications.ValueMustBeAtLeast", [uiData.eventsProperty[tempEventKey].min]);
                                        if(uiData.eventsProperty[tempEventKey].getDisplayValueFromServerReplayByUnits && uiData.eventsProperty[tempEventKey].selectedUnitSize){
                                            var minValueInSelectedSize = Math.floor( uiData.eventsProperty[tempEventKey].getDisplayValueFromServerReplayByUnits(uiData.eventsProperty[tempEventKey].min, uiData.eventsProperty[tempEventKey].selectedUnitSize) );
                                            if(minValueInSelectedSize == 0){
                                                minValueInSelectedSize = 1;
                                            }
                                            var inText = minValueInSelectedSize + " " + uiData.eventsProperty[tempEventKey].selectedUnitSize;
                                            tErrMsg = locale.getString("common.notifications.ValueMustBeAtLeast", [inText]);
                                        }
                                    }
                                }
                                //Maximum value
                                if(isValid && uiData.eventsProperty[tempEventKey].max != null ){
                                    if(uiData.eventsProperty[tempEventKey].units == null) {
                                        isValid = attNotificationsService.checkInputForMinMax(uiData, tempEventKey, false);
                                        if(!isValid) {
                                            tErrMsg = locale.getString("common.notifications.ValueMustBeAtMost", [uiData.eventsProperty[tempEventKey].max]);
                                        }
                                    } else if( uiData.eventsProperty[tempEventKey].max <  calcValueNumber ){
                                        isValid = false;
                                        tErrMsg = locale.getString("common.notifications.ValueMustBeAtMost", [uiData.eventsProperty[tempEventKey].max]);
                                        if(uiData.eventsProperty[tempEventKey].getDisplayValueFromServerReplayByUnits && uiData.eventsProperty[tempEventKey].selectedUnitSize){
                                            var maxValueInSelectedSize = Math.floor( uiData.eventsProperty[tempEventKey].getDisplayValueFromServerReplayByUnits(uiData.eventsProperty[tempEventKey].max, uiData.eventsProperty[tempEventKey].selectedUnitSize) );
                                            var inText = maxValueInSelectedSize + " " + uiData.eventsProperty[tempEventKey].selectedUnitSize;
                                            tErrMsg = locale.getString("common.notifications.ValueMustBeAtMost", [inText]);
                                        }
                                    }
                                }

                                if(isValid && uiData.eventsProperty[tempEventKey].inputMaxLength != null ){
                                    if(uiData.eventsProperty[tempEventKey].displayValue.length > uiData.eventsProperty[tempEventKey].inputMaxLength) {
                                        isValid = false;
                                        tErrMsg = locale.getString("common.notifications.InputMaxLengthMsg", [uiData.eventsProperty[tempEventKey].inputMaxLength]);
                                    }
                                }
                            }

                            if(isValid ){
                                if(uiData.tempSingleNotificationUserPrefs == null){
                                    uiData.tempSingleNotificationUserPrefs = {};
                                }
                                attNotificationsService.setPropInSingleNotificationUserPrefs(uiData.tempSingleNotificationUserPrefs, tempEventKey, "selectedUnitSize", uiData.eventsProperty[tempEventKey].selectedUnitSize);
                            }

                            if(isValid && uiData.eventsProperty[tempEventKey].errorMessage != ""){
                                uiData.eventsProperty[tempEventKey].errorMessage = "";
                            }
                            else if(uiData.eventsProperty[tempEventKey].errorMessage != tErrMsg){
                                uiData.eventsProperty[tempEventKey].errorMessage = tErrMsg;
                            }

                            if( uiData.eventsProperty[tempEventKey].valid !== isValid){
                                uiData.eventsProperty[tempEventKey].valid = isValid;
                            }
                        }
                    }
                }
                return isValid;
            },

            checkInputForMinMax: function(uiData, tempEventKey, checkMin){
                var res = true;
                checkMin = checkMin || false;

                if(checkMin && uiData.eventsProperty[tempEventKey].min == null) {
                    return;
                }

                if(!checkMin && uiData.eventsProperty[tempEventKey].max == null) {
                    return;
                }

                var displayValue = uiData.eventsProperty[tempEventKey].displayValue;
                if(ArrayUtils.isArray(displayValue)) {
                    return res;
                }
                var arrDisplayValue = attNotificationsService.getTrimmedArray(displayValue.split(","));

                ArrayUtils.each(arrDisplayValue, function (val) {
                    if((checkMin && (uiData.eventsProperty[tempEventKey].min > Number(val))) ||
                        (!checkMin && (uiData.eventsProperty[tempEventKey].max < Number(val)))) {
                        res = false;
                        return;
                    }
                });

                return res;
            },

            isSelectedEventsParamValueValid:function (vmNotification, vmUiData) {
                return attNotificationsService.validateEventsInputsValue(vmNotification, vmUiData, false);
            },
            isOneOrMoreSelectedEvents:function (selectedEvents) {
                var isOne = false;
                var selectedEventsKeys = Object.keys(selectedEvents);
                for(var index = 0; index < selectedEventsKeys.length && !isOne; index++){
                    isOne = selectedEvents[ (selectedEventsKeys[index]) ];
                }
                return isOne;
            },
            getSelectedEventsStringArray:function (selectedEvents) {
                var selectedEventsStringArray = [];
                var selectedEventsKeys = Object.keys(selectedEvents);
                for(var index = 0; index < selectedEventsKeys.length; index++){
                    if( selectedEvents[ (selectedEventsKeys[index]) ] ){
                        selectedEventsStringArray.push(selectedEventsKeys[index]);
                    }
                }
                return selectedEventsStringArray;
            },
            getGroupTypeByNotificationType:function (notificationType) {
                var eventGroupKey = attNotificationsService.data.allEventsDictionary[notificationType].inParentGroup;
                return (eventGroupKey.indexOf(consts.Notification.GroupType.SERVER) > -1 )? consts.Notification.GroupType.SERVER : consts.Notification.GroupType.TASK;
            },
            createNewNotificationRule : function (groupType, notificationType, stepEventsTemplateUrl, onSuccess, selectedItems) {
                var isNew = true;
                var newNotification = null;
                if(!ObjectUtils.isEmpty(notificationType)){
                    groupType = attNotificationsService.getGroupTypeByNotificationType(notificationType);
                    attNotificationsService.calcEventsGroups( groupType );
                    attNotificationsService.calcVariablesDictionary();
                    newNotification = attNotificationsService.getNewNotificationFromPreDefined(groupType, notificationType);
                }
                else{
                    if(ObjectUtils.isEmpty(groupType)){
                        groupType = consts.Notification.GroupType.SERVER;
                    }
                    attNotificationsService.calcEventsGroups( groupType );
                    attNotificationsService.calcVariablesDictionary();
                }
                attNotificationsService.showNotificationRuleWizard(newNotification, isNew, groupType, stepEventsTemplateUrl, onSuccess, selectedItems);
            },
            getFreshCopyNotificationRuleDto:function (groupType) {
                var newNotification = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.NotificationRuleDto_Defaults]);
                newNotification["name"] = attNotificationsService.getNextNotificationDefaultName(groupType);
                return newNotification;
            },
            getFreshCopyRuleDto:function (groupType) {
                return ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.RuleDto_Defaults]);
            },

            margeNotificationObjectAndRemoveProps:function (notificationObject, uiEventKey) {
                var typeNameDef = attNotificationsService.data.preDefinedRules[uiEventKey].preDefine.$type + attNotificationsService.DO_NOTIFI._Defaults;
                var newObject = ObjectUtils.deepClone(DO[typeNameDef]);

                //set New type
                notificationObject.$type = newObject.$type;
                notificationObject[attNotificationsService.DO_NOTIFI.trigger] = null;
                if( notificationObject[attNotificationsService.DO_NOTIFI.on_set_actions] != null && notificationObject[attNotificationsService.DO_NOTIFI.on_set_actions].length > 0){
                    notificationObject[attNotificationsService.DO_NOTIFI.on_set_actions].length = [];
                }
                if(notificationObject[attNotificationsService.DO_NOTIFI.on_clear_actions] != null ){
                    if(newObject[attNotificationsService.DO_NOTIFI.on_clear_actions] == null){
                        notificationObject[attNotificationsService.DO_NOTIFI.on_clear_actions] = null;
                        delete notificationObject[attNotificationsService.DO_NOTIFI.on_clear_actions];
                    }
                    else{
                        notificationObject[attNotificationsService.DO_NOTIFI.on_clear_actions].length = [];
                    }
                }

                var newKeys = Object.keys(newObject);
                var deleteKeys = Object.keys(notificationObject);
                for(var index = 0; index<newKeys.length; index++){
                    var tempKey = newKeys[index];
                    if(notificationObject[tempKey] == null){
                        notificationObject[tempKey] = newObject[tempKey];
                    }
                    ArrayUtils.removeElementFromArray(deleteKeys, tempKey);
                }
                if(deleteKeys.length > 0){
                    for(var deleteIndex =0; deleteIndex > deleteKeys.length; deleteIndex++){
                        if(notificationObject[ (deleteKeys[deleteIndex]) ] != null){
                            delete notificationObject[ (deleteKeys[deleteIndex]) ];
                        }
                    }
                }
            },
            getHysteresis:function (value) {
                return ( Number(value) > 0) ? (Math.floor( Number(value) * 0.1) ) : 0;
            },
            isThresholdParameterInInnerPath:function (preDefineNotification) {
                return !ObjectUtils.isEmpty(preDefineNotification[attNotificationsService.DO_NOTIFI.trigger]) &&
                    (ObjectUtils.get(preDefineNotification, attNotificationsService.CONSTANTS.InputPathInnerRule) == attNotificationsService.CONSTANTS.NOTIFICATION_THRESHOLD_DEFINED_VALUES);
            },

            isDefinedValuesParameterInInnerPath: function(preDefineNotification){
                var definedValuesDef = ObjectUtils.get(preDefineNotification, attNotificationsService.CONSTANTS.InputPathInnerRuleArray);
                return !ObjectUtils.isEmpty(preDefineNotification[attNotificationsService.DO_NOTIFI.trigger]) &&
                    (!ObjectUtils.isEmpty(definedValuesDef)) &&
                    (definedValuesDef[0] == attNotificationsService.CONSTANTS.NOTIFICATION_DEFINED_VALUES);
            },
            isNotification$typeEqualsToPreDefinedKey:function (notification, uiEventKey) {
                return (notification.ui_event_key == uiEventKey && notification.$type == attNotificationsService.data.preDefinedRules[uiEventKey].preDefine.$type);
            },
            getUiEventKeyByNotification:function (notification) {
                var uiEventKey = null;
                var keys = Object.keys(attNotificationsService.data.preDefinedRules);
                for(var index=0;index<keys.length && uiEventKey == null;index++){
                    if( attNotificationsService.isNotification$typeEqualsToPreDefinedKey(notification, keys[index]) ){
                        uiEventKey = keys[index];
                    }
                }
                return uiEventKey;
            },
            getValueByInputPath:function (notification, uiEventKey) {
                return ObjectUtils.get(notification, attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath);
            },

            getTrimmedArray: function(inputArray) {
                var trimmedArr = [];
                ArrayUtils.each(inputArray, function (val) {
                    ArrayUtils.insert(trimmedArr, val.trim());
                });
                return trimmedArr;
            },

            setValueByInputPath:function (notification, uiEventKey, value) {
                // if(attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPath){
                var ruleInputPath = attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath;
                switch (ruleInputPath) {
                    case attNotificationsService.CONSTANTS.InputPath:
                        notification[attNotificationsService.DO_NOTIFI.trigger].inputs[0] = (value).toString();
                        break;
                    case attNotificationsService.CONSTANTS.InputPathArray:
                        var arrVal = (value).toString().split(",");

                        notification[attNotificationsService.DO_NOTIFI.trigger].inputs = attNotificationsService.getTrimmedArray(arrVal);
                        break;
                    case attNotificationsService.CONSTANTS.InputPathInnerRule:
                        notification[attNotificationsService.DO_NOTIFI.trigger].rules[0].inputs[0] = (value).toString();
                        break;
                    case attNotificationsService.CONSTANTS.InputPathInnerRuleArray:
                        var ruleInput = attNotificationsService.getTrimmedArray((value).toString().split(","));
                        notification[attNotificationsService.DO_NOTIFI.trigger].rules[0].inputs = ruleInput;
                        break;
                }
                // if(attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathArray){
                //     var arrVal = (value).toString().split(",");
                //     var trimmedArr = [];
                //     ArrayUtils.each(arrVal, function (val) {
                //         ArrayUtils.insert(trimmedArr, val.trim());
                //     });
                //
                //     notification[attNotificationsService.DO_NOTIFI.trigger].inputs = trimmedArr;
                // }
                // else if(attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathInnerRule){
                //     notification[attNotificationsService.DO_NOTIFI.trigger].rules[0].inputs[0] = (value).toString();
                // }
            },
            setHysteresisValueByInputPath:function (notification, uiEventKey, hysteresis) {
                if(attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPath){
                    notification[attNotificationsService.DO_NOTIFI.trigger].hysteresis = hysteresis;
                }
                else if(attNotificationsService.data.preDefinedRules[uiEventKey].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathInnerRule){
                    notification[attNotificationsService.DO_NOTIFI.trigger].rules[0].hysteresis = hysteresis;
                }
            },
            getPreDefinedTrigger:function (uiEventKey) {
              return ObjectUtils.deepClone(attNotificationsService.data.preDefinedRules[uiEventKey].preDefine[attNotificationsService.DO_NOTIFI.trigger]);
            },
            updateValidServers:function (uiData, minVersion) {
                if (minVersion) {
                    uiData.associate.validServersNamesList = $filter('filter')(uiData.associate.serversNamesList, function (serverName) {
                        return (serverName.lookFor === consts.Notification.Associate.ALL ||
                            VersionPolicyService.isAaaEqualOrBiggerThenBbb(AEM_ServersService.getReplicateServerVersion(serverName.lookFor), minVersion));
                    });
                } else {
                    uiData.associate.validServersNamesList = ObjectUtils.deepClone(uiData.associate.serversNamesList);
                }
            },
            updateValidTasks:function (uiData, minVersion) {
                if (minVersion) {
                    uiData.associate.validTasksList = $filter('filter')(uiData.associate.fullTasksList, function (iTask) {
                        return (iTask.server_name === consts.Notification.Associate.ALL ||
                            VersionPolicyService.isAaaEqualOrBiggerThenBbb(AEM_ServersService.getReplicateServerVersion(iTask.server_name), minVersion));
                    });
                    uiData.associate.displayedTasksList = ObjectUtils.deepClone(uiData.associate.validTasksList);
                } else {
                    uiData.associate.validTasksList = ObjectUtils.deepClone(uiData.associate.fullTasksList);
                    uiData.associate.displayedTasksList = ObjectUtils.deepClone(uiData.associate.fullTasksList);
                }
            },
            updateNotificationSelectedEventsAndValues:function (popupVm, eventGroupWasChanged) {
                //displayNamesSelectedEvents
                attNotificationsService.updateDisplayNamesSelectedEvents(popupVm.uiData);

                var selectedEventsStringArray = attNotificationsService.getSelectedEventsStringArray(popupVm.uiData.selectedEvents);
                if(selectedEventsStringArray == null || selectedEventsStringArray.length == 0){
                    return;
                }

                //preDefinedRules
                if( ObjectUtils.isEmpty(attNotificationsService.data.preDefinedRules) ){
                    console.error("No PreDefine Object." );
                    return;
                }

                var eventWasChanged = false;
                if( popupVm.uiData.previousSelectedEventsString != selectedEventsStringArray.join(",")){
                    popupVm.uiData.previousSelectedEventsString = selectedEventsStringArray.join(",");
                    eventWasChanged = true;
                }

                if(selectedEventsStringArray.length == 1){
                    var eventKeyName = selectedEventsStringArray[0];

                    if(attNotificationsService.data.preDefinedRules[ eventKeyName ] != null){
                        if(!attNotificationsService.isNotification$typeEqualsToPreDefinedKey(popupVm.notification, eventKeyName)){
                            attNotificationsService.margeNotificationObjectAndRemoveProps(popupVm.notification, eventKeyName);
                            popupVm.notification.ui_event_key = eventKeyName;
                        }
                        var tempValue = null;
                        var inputValueInPath = attNotificationsService.getValueByInputPath(popupVm.notification, eventKeyName);
                        if( inputValueInPath != null && !isNaN(Number(inputValueInPath)) ){
                            tempValue = Number(inputValueInPath);
                        }
                        popupVm.notification[attNotificationsService.DO_NOTIFI.trigger] = attNotificationsService.getPreDefinedTrigger(eventKeyName);
                        if(tempValue != null){
                            attNotificationsService.setValueByInputPath(popupVm.notification, eventKeyName, (tempValue).toString() );
                        }
                        attNotificationsService.updateRulesForAssociateTasks(popupVm);

                        popupVm.notification["audit_record_type"] = attNotificationsService.data.preDefinedRules[ eventKeyName ].preDefine.audit_record_type;

                        if( ObjectUtils.isEmpty( popupVm.uiData.messages.console) || eventGroupWasChanged || eventWasChanged ){
                            popupVm.uiData.messages.console = attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.messages["console"];
                        }
                        if( ObjectUtils.isEmpty( popupVm.uiData.messages.emailSubject) || eventGroupWasChanged || eventWasChanged ){
                            popupVm.uiData.messages.emailSubject = attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.messages["email_subject"];
                        }
                        if( ObjectUtils.isEmpty( popupVm.uiData.messages.emailBody) || eventGroupWasChanged || eventWasChanged ){
                            popupVm.uiData.messages.emailBody = attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.messages["email_body"];
                        }

                        //clear_messages
                        if(popupVm.notification.on_clear_actions != null && attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.clear_messages != null){
                            var eMailSubject = attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.clear_messages["email_subject"];
                            if( !ObjectUtils.isEmpty(eMailSubject) ){
                                if( popupVm.uiData.clearMessages.emailSubject != eMailSubject){
                                    popupVm.uiData.clearMessages.emailSubject = eMailSubject;
                                }
                            }
                            var eMailBody = attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.clear_messages["email_body"];
                            if( !ObjectUtils.isEmpty(eMailBody) ){
                                if( popupVm.uiData.clearMessages.emailBody != eMailBody){
                                    popupVm.uiData.clearMessages.emailBody = eMailBody;
                                }
                            }
                            var mConsole = attNotificationsService.data.preDefinedRules[ eventKeyName ].uiProps.clear_messages["console"];
                            if( !ObjectUtils.isEmpty(mConsole) ){
                                if( popupVm.uiData.clearMessages.console != mConsole){
                                    popupVm.uiData.clearMessages.console = mConsole;
                                }
                            }
                        }
                        else {
                            if(popupVm.uiData.clearMessages.emailSubject != ""){
                                popupVm.uiData.clearMessages.emailSubject = "";
                            }
                            if(popupVm.uiData.clearMessages.emailBody != ""){
                                popupVm.uiData.clearMessages.emailBody = "";
                            }
                            if(popupVm.uiData.clearMessages.console != ""){
                                popupVm.uiData.clearMessages.console = "";
                            }
                        }

                        popupVm.uiData.variablesList = attNotificationsService.getVariablesList( attNotificationsService.data.preDefinedRules[eventKeyName].preDefine.audit_record_type );
                        // if(attNotificationsService.data.preDefinedRules[ eventKeyName ].preDefine.audit_record_type != null){
                        //     popupVm.uiData.variablesList = attNotificationsService.getVariablesList( attNotificationsService.data.preDefinedRules[eventKeyName].preDefine.audit_record_type );
                        // }

                        //inputPath
                        if(popupVm.uiData.eventsProperty[eventKeyName] != null && popupVm.uiData.eventsProperty[eventKeyName].displayValue != null && popupVm.uiData.eventsProperty[eventKeyName].displayValue != attNotificationsService.CONSTANTS.InitialValue){
                            //calcValueInputUser
                            var inputValueString = "-1";
                            if(popupVm.uiData.eventsProperty[eventKeyName].calcValueInputUser != null){
                                //calcValue
                                popupVm.uiData.eventsProperty[eventKeyName].calcValue = popupVm.uiData.eventsProperty[eventKeyName].calcValueInputUser( Number(popupVm.uiData.eventsProperty[eventKeyName].displayValue), popupVm.uiData.eventsProperty[eventKeyName].selectedUnitSize );
                                inputValueString = (popupVm.uiData.eventsProperty[eventKeyName].calcValue).toString();
                            }
                            else{
                                inputValueString = (popupVm.uiData.eventsProperty[eventKeyName].displayValue).toString();

                                if(attNotificationsService.data.preDefinedRules[eventKeyName].uiProps.inputPath == attNotificationsService.CONSTANTS.InputPathInnerRuleArray) {
                                    popupVm.uiData.eventsProperty[eventKeyName].calcValue = inputValueString;
                                }
                            }
                            //setValueByInputPath
                            attNotificationsService.setValueByInputPath(popupVm.notification, eventKeyName, inputValueString);
                            //hysteresis //hasInputValue
                            var isHysteresisRelevant = (popupVm.uiData.eventsProperty[eventKeyName].NumericInputValueMandatory !== false);
                            if((popupVm.uiData.eventsProperty[eventKeyName].hasInputValue === true) && isHysteresisRelevant){
                                var hysteresis = attNotificationsService.getHysteresis(inputValueString);
                                attNotificationsService.setHysteresisValueByInputPath(popupVm.notification, eventKeyName, hysteresis);
                            }
                        }
                    }
                    else{
                        console.log("No PreDefine role for event: " + selectedEventsStringArray[0] );
                    }
                }
                else if(selectedEventsStringArray.length > 1){
                    console.error("Error multi events.");
                    return;

                }//rule
                attNotificationsService.updateWizardEventDescription(popupVm.uiData, popupVm.notification);
            },
            checkAndRemoveEmailRecipientsIfDefine:function (popupVm) {
                if( attNotificationsService.isEmailRecipientsDefine(popupVm) ){
                    var _goOnActionsArrayAndClearRecipients = function (actionsArray) {
                        if(actionsArray && actionsArray.length > 0){
                            for(var index=0;index <actionsArray.length; index++ ){
                                if(actionsArray[index] != null && actionsArray[index].$type == attNotificationsService.DO_NOTIFI.EmailNotificationDelivery){
                                    actionsArray[index]["to"].length = 0;
                                    actionsArray[index]["cc"].length = 0;
                                    actionsArray[index]["bcc"].length = 0;
                                }
                            }
                        }
                    };
                    //on_set_actions
                    _goOnActionsArrayAndClearRecipients(popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions]);
                    //on_clear_actions
                    _goOnActionsArrayAndClearRecipients(popupVm.notification.on_clear_actions);
                }
            },
            getVariablesList:function (auditRecordType) {
                var variablesList = [];
                if(!ObjectUtils.isEmpty(auditRecordType)){
                    variablesList = attNotificationsService.getVariablesFromDic(auditRecordType);
                }
                return variablesList;
            },
            splitRecipients:function ( emailRecipientString) {
                emailRecipientString = emailRecipientString.replaceAll(attNotificationsService.CONSTANTS.Space, attNotificationsService.CONSTANTS.Semicolon);
                emailRecipientString = emailRecipientString.replaceAll(attNotificationsService.CONSTANTS.Comma, attNotificationsService.CONSTANTS.Semicolon);
                emailRecipientString = emailRecipientString.replaceAll(attNotificationsService.CONSTANTS.DoubleSemicolon, attNotificationsService.CONSTANTS.Semicolon);

                if(emailRecipientString.length > 0){
                    var tempArr = emailRecipientString.split( attNotificationsService.CONSTANTS.Semicolon);
                    ArrayUtils.clean(tempArr, attNotificationsService.CONSTANTS.Semicolon);
                    ArrayUtils.clean(tempArr, attNotificationsService.CONSTANTS.EmptyString);
                    return tempArr;
                }
                else{
                    return [];
                }
            },
            isEmailRecipientsDefine:function (popupVm) {
                var isDefine = false;
                if(popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions] && popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions].length > 0){
                    for(var index=0;index <popupVm.notification.on_set_actions.length; index++ ){
                        if(popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions][index] != null && popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions][index].$type == attNotificationsService.DO_NOTIFI.EmailNotificationDelivery){
                            if(popupVm.notification.on_set_actions[index]["to"].length > 0 || popupVm.notification.on_set_actions[index]["cc"].length > 0 || popupVm.notification.on_set_actions[index]["bcc"].length > 0 ){
                                isDefine = true;
                            }
                        }
                    }
                }
                return isDefine;
            },
            updateOnSetActions : function (popupVm, changeOnActionEmailRecipients) {
                //NotificationRuleDto
                popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions].length = 0;

                //NotificationAlarmRuleDto  -> on_clear_actions
                var addClearActions = false;
                if(popupVm.notification.on_clear_actions != null){
                    popupVm.notification.on_clear_actions.length = 0;
                    addClearActions = true;
                }

                //add base system event -> InternalNotificationDelivery
                if(attNotificationsService.DO_NOTIFI.InternalNotificationDelivery_Defaults != null){
                    var internalNotificationDeliveryObject = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.InternalNotificationDelivery_Defaults]);
                    internalNotificationDeliveryObject["message"] = popupVm.uiData.messages.console;
                    popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions].push( internalNotificationDeliveryObject );

                    if(addClearActions){
                        //for clear console message - USE "clearMessages"
                        var clearInternalNotificationDeliveryObject = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.InternalNotificationDelivery_Defaults]);
                        clearInternalNotificationDeliveryObject["message"] = popupVm.uiData.clearMessages.console;
                        popupVm.notification.on_clear_actions.push( clearInternalNotificationDeliveryObject );
                    };
                }

                //can be also
                if(popupVm.uiData.deliveryAction.isEventLog){
                    var eventLogNotificationDeliveryObject = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.EventLogNotificationDelivery_Defaults]);
                    eventLogNotificationDeliveryObject["subject"] = popupVm.uiData.messages.emailSubject;
                    eventLogNotificationDeliveryObject["message"] =  popupVm.uiData.messages.emailBody;
                    var eventLogDelivery = attNotificationsService.getEventLogDeliveryActionFromArray(attNotificationsService.data.preDefinedRules[popupVm.notification.ui_event_key].preDefine.on_set_actions);
                    eventLogNotificationDeliveryObject["event_id"] = eventLogDelivery.event_id;
                    popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions].push( eventLogNotificationDeliveryObject );

                    if(addClearActions){
                        //for clear console message - USE "clearMessages"
                        var clearEventLogNotificationDeliveryObject = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.EventLogNotificationDelivery_Defaults]);
                        clearEventLogNotificationDeliveryObject["subject"] = popupVm.uiData.clearMessages.emailSubject;
                        clearEventLogNotificationDeliveryObject["message"] =  popupVm.uiData.clearMessages.emailBody;
                        var eventLogDeliveryClear = attNotificationsService.getEventLogDeliveryActionFromArray(attNotificationsService.data.preDefinedRules[popupVm.notification.ui_event_key].preDefine.on_clear_actions);
                        clearEventLogNotificationDeliveryObject["event_id"] = eventLogDeliveryClear.event_id;
                        popupVm.notification.on_clear_actions.push( clearEventLogNotificationDeliveryObject );
                    }
                }

                var areMessagesDifferentFromPreDefine = attNotificationsService.isEmailSubjectOrBodyMessageEqualToPreDefined(popupVm);

                //can be also
                if(popupVm.uiData.deliveryAction.isEmail || areMessagesDifferentFromPreDefine){
                    var emailNotificationDeliveryObject = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.EmailNotificationDelivery_Defaults]);
                    //email message
                    emailNotificationDeliveryObject["subject"] = popupVm.uiData.messages.emailSubject;
                    emailNotificationDeliveryObject["message"] = popupVm.uiData.messages.emailBody;
                    //emailRecipients
                    emailNotificationDeliveryObject["to"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.to);
                    emailNotificationDeliveryObject["cc"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.cc);
                    emailNotificationDeliveryObject["bcc"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.bcc);
                    popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions].push( emailNotificationDeliveryObject );

                    if(addClearActions){
                        //for clear console message - USE "clearMessages"
                        var clearMailNotificationDeliveryObject = ObjectUtils.deepClone(DO[attNotificationsService.DO_NOTIFI.EmailNotificationDelivery_Defaults]);
                        //email message
                        clearMailNotificationDeliveryObject["subject"] = popupVm.uiData.clearMessages.emailSubject;
                        clearMailNotificationDeliveryObject["message"] = popupVm.uiData.clearMessages.emailBody;
                        //emailRecipients
                        clearMailNotificationDeliveryObject["to"] = emailNotificationDeliveryObject["to"];
                        clearMailNotificationDeliveryObject["cc"] = emailNotificationDeliveryObject["cc"];
                        clearMailNotificationDeliveryObject["bcc"] = emailNotificationDeliveryObject["bcc"];
                        popupVm.notification.on_clear_actions.push( clearMailNotificationDeliveryObject );
                    }
                }

                if(changeOnActionEmailRecipients){
                    if(popupVm.uiData.deliveryAction.isEmail){
                        attNotificationsService.checkMailServerDefined();
                    }
                    else{
                        GlobalMessagesService.hideDockedError();
                    }
                }

            },
            isEmailSubjectOrBodyMessageEqualToPreDefined:function (popupVm) {
                var selectedEventsStringArray = attNotificationsService.getSelectedEventsStringArray(popupVm.uiData.selectedEvents);
                var relevantEventKey = selectedEventsStringArray[0];
                return (relevantEventKey != null && popupVm.uiData.messages.emailSubject == attNotificationsService.data.preDefinedRules[ relevantEventKey ].uiProps.messages["email_subject"]
                    && popupVm.uiData.messages.emailBody == attNotificationsService.data.preDefinedRules[ relevantEventKey ].uiProps.messages["email_body"]);
            },
            restorePredefineMessage:function (popupVm) {
                var selectedEventsStringArray = attNotificationsService.getSelectedEventsStringArray(popupVm.uiData.selectedEvents);
                var relevantEventKey = selectedEventsStringArray[0];
                popupVm.uiData.messages.emailSubject = attNotificationsService.data.preDefinedRules[ relevantEventKey ].uiProps.messages["email_subject"];
                popupVm.uiData.messages.emailBody = attNotificationsService.data.preDefinedRules[ relevantEventKey ].uiProps.messages["email_body"];
                attNotificationsService.updateOnSetActions(popupVm, false);
            },
            checkTasksListAndServerList:function(popupVm, associateCtrlData){
                if(attNotificationsService.callbackFunctions.getAllServers != null){
                    attNotificationsService.callbackFunctions.getAllServers(function(serversNamesList){
                        popupVm.uiData.associate.serversNamesList.length = 0;
                        popupVm.uiData.associate.serversNamesList = serversNamesList;
                        //validServersNamesList
                        popupVm.uiData.associate.validServersNamesList.length=0;
                        popupVm.uiData.associate.validServersNamesList = ObjectUtils.deepClone(serversNamesList);

                        associateCtrlData.selectedServer = (serversNamesList[0] != null)? serversNamesList[0] : null;
                        // In case we are editing existing notification rule
                        attNotificationsService.updateValidServers(popupVm.uiData, popupVm.uiData.eventsProperty[popupVm.notification.ui_event_key].minVersion);
                    });
                }
                if(attNotificationsService.callbackFunctions.getAllTasks != null){
                    attNotificationsService.callbackFunctions.getAllTasks(function(fullTasksList){
                        //fullTasksList
                        popupVm.uiData.associate.fullTasksList.length = 0;
                        popupVm.uiData.associate.fullTasksList = fullTasksList;
                        //displayedTasksList
                        popupVm.uiData.associate.displayedTasksList.length = 0;
                        popupVm.uiData.associate.displayedTasksList = ObjectUtils.deepClone(fullTasksList);
                        //validTasksList
                        popupVm.uiData.associate.validTasksList.length = 0;
                        popupVm.uiData.associate.validTasksList = ObjectUtils.deepClone(fullTasksList);
                        // In case we are editing existing notification rule
                        attNotificationsService.updateValidTasks(popupVm.uiData, popupVm.uiData.eventsProperty[popupVm.notification.ui_event_key].minVersion);
                    });
                }
            },
            checkNotificationMinVersion:function(uiData) {
                if (uiData.eventsProperty) {
                    for (let eventProperty in uiData.eventsProperty) {
                        if (uiData.eventsProperty[eventProperty].minVersion) {
                            uiData.eventsProperty[eventProperty].validVersion = attNotificationsService.containsReplicateMinVersion(uiData, eventProperty);
                        }
                    }
                }
            },
            containsReplicateMinVersion:function(uiData, eventKey) {
                const minVersion = uiData.eventsProperty[eventKey].minVersion;
                if (!minVersion) {
                    return true;
                }

                // If tasks were selected for the notification, get the associated server names
                if (uiData.associate.selectedTasks && uiData.associate.selectedTasks.length > 0) {
                    var serverNames = new Set();
                    for (var selectedTask of uiData.associate.selectedTasks) {
                        serverNames.add(selectedTask.server_name);
                    }
                    return VersionPolicyService.isAaaEqualOrBiggerThenBbb(AEM_ServersService.getMinReplicateVersion(serverNames), minVersion);
                }
                else {
                    return VersionPolicyService.isAaaEqualOrBiggerThenBbb(AEM_ServersService.getMaxReplicateVersion(), minVersion);
                }
            },
            getAssociateGroupLabel:function(associateGroup){
                return locale.getString( 'common.notifications.AssociateGroup.' + associateGroup );
            },
            checkAssociateGroupState:function(popupVm){
                if(popupVm.uiData.groupType == consts.Notification.GroupType.TASK ){
                    var nGroup = angular.copy(consts.Notification.Associate.ALL);
                    if(popupVm.uiData.associate.selectedTasks.length > 0){
                        nGroup = angular.copy(consts.Notification.Associate.SELECTED);
                    }
                    if(popupVm.uiData.associate.group != nGroup){
                        popupVm.uiData.associate.group = nGroup;
                    }
                    var nLabel = attNotificationsService.getAssociateGroupLabel(popupVm.uiData.associate.group);
                    if(popupVm.uiData.associate.groupLabel != nLabel){
                        popupVm.uiData.associate.groupLabel = nLabel;
                    }
                }
                // else {
                //     //SERVER
                // }
            },
            addAssociateTasks:function(popupVm, addedTasks){
                if(addedTasks != null && addedTasks.length > 0 ){
                    ArrayUtils.each(addedTasks, function (iTask, i) {
                        //insert if not exist
                        var tTaskItem = {server_name: iTask["server_name"], task_name: iTask["task_name"], joined_server_task:""};
                        attNotificationsService.setJoinedServerTaskProp(tTaskItem);
                        if( ArrayUtils.indexOfByProperty(popupVm.uiData.associate.selectedTasks, "joined_server_task", tTaskItem.joined_server_task) == -1){
                            popupVm.uiData.associate.selectedTasks.push(tTaskItem);
                        }                        
                    });
                }
                attNotificationsService.updateRulesForAssociateTasks(popupVm);
                attNotificationsService.checkNotificationMinVersion(popupVm.uiData);
            },
            removeAssociatedTasks:function(popupVm, removeTasks){
                if(removeTasks != null && removeTasks.length > 0 && popupVm.uiData.associate.selectedTasks.length > 0){
                    //remove
                    ArrayUtils.each(removeTasks, function (rTask, i) {
                        ArrayUtils.removeElementFromArray(popupVm.uiData.associate.selectedTasks, rTask);
                    });
                }
                // popupVm.uiData.associate.selectedTasks = ArrayUtils.difference(popupVm.uiData.associate.selectedTasks, removeTasks);
                attNotificationsService.updateRulesForAssociateTasks(popupVm);
                attNotificationsService.checkNotificationMinVersion(popupVm.uiData);
            },
            removeRuleOfAssociateTasks:function(rules){
                //ArrayUtils.removeElementByNestedProperty(rules,"member_name", attNotificationsService.CONSTANTS.FullTaskName);
                var wasRemoved = false;
                if(rules.length === 0){
                      return;
                }
                for(var index=rules.length-1; (index >= 0  && (!wasRemoved)); index--){
                    var iRule = rules[index];
                    if(iRule["member_name"] == attNotificationsService.CONSTANTS.FullTaskName){
                        rules.splice(index,1);
                    }
                }
            },
            updateRulesForAssociateTasks:function(popupVm){
                attNotificationsService.removeRuleOfAssociateTasks(popupVm.notification[attNotificationsService.DO_NOTIFI.trigger].rules);
                if(popupVm.uiData.associate.selectedTasks != null && popupVm.uiData.associate.selectedTasks.length > 0){
                    var associateRule = attNotificationsService.createRulesForTasks(popupVm.uiData.associate.selectedTasks);
                    if(associateRule != null){
                        popupVm.notification[attNotificationsService.DO_NOTIFI.trigger].rules.push(associateRule);
                    }
                }
            },
            createEmptyRuleObject:function(){
                return {
                    member_name : "",
                    operator : "",
                    rules : [],
                    inputs : []
                };
            },
            createRulesForTasks:function(tasks){
                if(tasks == null || tasks.length == 0){
                    return null;
                }
                var baseAssociateRule = attNotificationsService.createEmptyRuleObject();
                baseAssociateRule.member_name = attNotificationsService.CONSTANTS.FullTaskName;
                baseAssociateRule.operator = attNotificationsService.CONSTANTS.ONE_OF;
                ArrayUtils.each(tasks, function (iTask, i) {
                    baseAssociateRule.inputs.push(iTask[attNotificationsService.CONSTANTS.joined_server_task]);
                });
                return baseAssociateRule;
            },
            updateRuleForMinVersion:function(popupVm){
                attNotificationsService.removeRuleOfMinVersion(popupVm.notification[attNotificationsService.DO_NOTIFI.trigger].rules);
                const associateRule = attNotificationsService.createRuleForMinVersion(popupVm.uiData.associate.minVersion);
                if(associateRule != null){
                    popupVm.notification[attNotificationsService.DO_NOTIFI.trigger].rules.push(associateRule);
                }
            },
            createRuleForMinVersion:function(minVersion) {
                if (!minVersion) {
                    return null;
                }
                const baseAssociateRule = attNotificationsService.createEmptyRuleObject();
                baseAssociateRule.member_name = attNotificationsService.CONSTANTS.ServerVersion;
                baseAssociateRule.operator = attNotificationsService.CONSTANTS.IS_MIN_SERVER_VERSION;
                baseAssociateRule.inputs.push(minVersion);
                return baseAssociateRule;
            },
            removeRuleOfMinVersion:function(rules){
                var wasRemoved = false;
                if(rules.length === 0){
                    return;
                }
                for(var index=rules.length-1; (index >= 0  && (!wasRemoved)); index--){
                    var iRule = rules[index];
                    if(iRule["member_name"] == attNotificationsService.CONSTANTS.ServerVersion){
                        rules.splice(index,1);
                    }
                }
            },
            checkNotificationForMailServer:function (popupVm) {
                if(popupVm.notification[attNotificationsService.DO_NOTIFI.on_set_actions].length > 0 && popupVm.uiData.deliveryAction.isEmail){
                    attNotificationsService.checkMailServerDefined();
                }
            },
            checkMailServerDefined:function () {
                if(attNotificationsService.callbackFunctions.isAppMailServerDefine == null){
                    return;
                }
                attNotificationsService.callbackFunctions.isAppMailServerDefine(function (isAppMailServerDefineState) {
                    if(isAppMailServerDefineState !== true){

                        if( attMailServerService.isUserAllowToDoAction_PutMailServer() ){
                            var openMailPopupCallBack = null;
                            if(attNotificationsService.callbackFunctions.openEmailSettings != null){
                                openMailPopupCallBack = attNotificationsService.callbackFunctions.openEmailSettings;
                            }
                            else if(attMailServerService.isSetContextApp()){
                                openMailPopupCallBack = function () {
                                    attMailServerService.showMailServerPopup(function () {
                                        setTimeout(function () {
                                            GlobalMessagesService.hideDockedError();
                                        }, 550);
                                    })
                                };
                            }
                            var defineNowText = (openMailPopupCallBack != null) ? locale.getString("common.base.DefineNow") : null;
                            var messageText = locale.getString("common.notifications.NotificationsCannotBeSentUntilMailServerDefined");
                            GlobalMessagesService.showWarningMessageWithOpenPopupCallbackAndText(messageText , openMailPopupCallBack, defineNowText);
                        }
                        else{
                            var messageText = locale.getString("common.notifications.PleaseContactYourAppAdmin", [attNotificationsService.data.productName]);
                            GlobalMessagesService.setMessages(true, consts.errorModes.warning, false, messageText);
                        }
                    }
                });
            },
            getDeliveryActionFromArrayByType:function (onSetActionsArray, type) {
                return ArrayUtils.find(onSetActionsArray, function (actionItem) {
                    return (actionItem.$type == type);
                });
            },
            getInnerDeliveryActionFromArray:function (onSetActionsArray) {
                return attNotificationsService.getDeliveryActionFromArrayByType(onSetActionsArray, attNotificationsService.DO_NOTIFI.InternalNotificationDelivery);
            },
            getEventLogDeliveryActionFromArray:function (onSetActionsArray) {
                return attNotificationsService.getDeliveryActionFromArrayByType(onSetActionsArray, attNotificationsService.DO_NOTIFI.EventLogNotificationDelivery);
            },
            getEmailDeliveryActionFromArray:function (onSetActionsArray) {
                return attNotificationsService.getDeliveryActionFromArrayByType(onSetActionsArray, attNotificationsService.DO_NOTIFI.EmailNotificationDelivery);
            },
            getEmailDeliveryClearActionFromArray:function (clearActionsArray) {
                return attNotificationsService.getDeliveryActionFromArrayByType(clearActionsArray, attNotificationsService.DO_NOTIFI.EmailNotificationDelivery);
            },
            isExistDeliveryActionEventLog:function (onSetActionsArray) {
                return (attNotificationsService.getEventLogDeliveryActionFromArray(onSetActionsArray) != null);
            },
            isExistDeliveryActionEmail:function (onSetActionsArray) {
                return (attNotificationsService.getEmailDeliveryActionFromArray(onSetActionsArray) != null);
            },
            isEmailArrayValid:function (emailArray) {
                var isValid = true;
                for(var vIndex=0; vIndex<emailArray.length && isValid; vIndex++){
                    if(emailArray[vIndex] != null && emailArray[vIndex] != attNotificationsService.CONSTANTS.EmptyString && emailArray[vIndex] != attNotificationsService.CONSTANTS.Semicolon){
                        isValid = Utils.isValidEmail(emailArray[vIndex].trim() );
                    }
                }
                return isValid;
            },
            updateRecipients:function (popupVm) {
                var emailDeliveryAction = attNotificationsService.getEmailDeliveryActionFromArray(popupVm.notification.on_set_actions);
                if( !ObjectUtils.isEmpty(emailDeliveryAction) ){
                    if( popupVm.uiData.deliveryAction.isEmail){
                        //emailRecipients
                        //to
                        emailDeliveryAction["to"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.to);
                        popupVm.uiData.emailRecipientsValidation.to = attNotificationsService.isEmailArrayValid(emailDeliveryAction["to"]);
                        //cc
                        emailDeliveryAction["cc"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.cc);
                        popupVm.uiData.emailRecipientsValidation.cc = attNotificationsService.isEmailArrayValid(emailDeliveryAction["cc"]);
                        //bcc
                        emailDeliveryAction["bcc"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.bcc);
                        popupVm.uiData.emailRecipientsValidation.bcc = attNotificationsService.isEmailArrayValid(emailDeliveryAction["bcc"]);
                    }
                }

                if(popupVm.notification.on_clear_actions != null && popupVm.notification.on_clear_actions.length >= 0){
                    var emailDeliveryClearAction = attNotificationsService.getEmailDeliveryClearActionFromArray(popupVm.notification.on_clear_actions);
                    if( !ObjectUtils.isEmpty(emailDeliveryClearAction) ){
                        if( popupVm.uiData.deliveryAction.isEmail){
                            //emailRecipients
                            //to
                            emailDeliveryClearAction["to"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.to);
                            popupVm.uiData.emailRecipientsValidation.to = attNotificationsService.isEmailArrayValid(emailDeliveryClearAction["to"]);
                            //cc
                            emailDeliveryClearAction["cc"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.cc);
                            popupVm.uiData.emailRecipientsValidation.cc = attNotificationsService.isEmailArrayValid(emailDeliveryClearAction["cc"]);
                            //bcc
                            emailDeliveryClearAction["bcc"] = attNotificationsService.splitRecipients(popupVm.uiData.emailRecipients.bcc);
                            popupVm.uiData.emailRecipientsValidation.bcc = attNotificationsService.isEmailArrayValid(emailDeliveryClearAction["bcc"]);
                        }
                    }
                }
            },
            setDeliveryDisplayNames:function () {
                if( ObjectUtils.isEmpty(attNotificationsService.data.deliveryDisplayNames) ){
                    attNotificationsService.data.deliveryDisplayNames = {
                        EventLogNotificationDelivery: locale.getString("common.notifications.WindowsEventLog"),
                        EmailNotificationDelivery: locale.getString("common.notifications.EmailRecipients")
                    };
                }
            },
            checkUserPreferencesInfo:function () {
                var tempPrefs = UserPreferencesService.getValueByKey(NotificationsRulesUserPreferencesKey);
                if(tempPrefs == null){
                    if(tempPrefs == null){
                        tempPrefs = {
                            eventsMoreInfo:{}
                        };
                    }
                }
                attNotificationsService.data.userPrefs = tempPrefs;
            },
            setUserPreferencesInfo:function () {
                if(attNotificationsService.data.userPrefs != null){
                    UserPreferencesService.setValueByKey(NotificationsRulesUserPreferencesKey, attNotificationsService.data.userPrefs);
                }
            },
            setPropInSingleNotificationUserPrefs : function (notificationUserPrefs, eventKey, prop, value) {
                if(notificationUserPrefs[eventKey] == null){
                    notificationUserPrefs[eventKey] = {};
                }
                if(notificationUserPrefs[eventKey][prop] == null){
                    notificationUserPrefs[eventKey][prop] = {};
                }
                notificationUserPrefs[eventKey][prop] = value;
            },
            getUserPrefsSingleNotificationForProp : function (notificationUserPrefs, eventKey, prop) {
                if(notificationUserPrefs == null || notificationUserPrefs[eventKey] == null || notificationUserPrefs[eventKey][prop] == null){
                    return null;
                }
                return notificationUserPrefs[eventKey][prop];
            },
            setUserPrefsForSingleNotification : function (notificationName, notificationUserPrefs) {
                if(attNotificationsService.data.userPrefs.eventsMoreInfo[notificationName] == null){
                    attNotificationsService.data.userPrefs.eventsMoreInfo[notificationName] = {};
                }
                attNotificationsService.data.userPrefs.eventsMoreInfo[notificationName] = notificationUserPrefs;
            },
            getUserPrefsForSingleNotification:function (notificationName) {
                if(attNotificationsService.data.userPrefs == null || attNotificationsService.data.userPrefs.eventsMoreInfo == null ){
                    return null;
                }
                if(attNotificationsService.data.userPrefs.eventsMoreInfo[notificationName] == null){
                    attNotificationsService.data.userPrefs.eventsMoreInfo[notificationName] = {};
                }
                return ObjectUtils.deepClone( attNotificationsService.data.userPrefs.eventsMoreInfo[notificationName] );
            }
        };
        return attNotificationsService;
    }]);

    attNotificationsModule.controller('attNotificationsRulesListCtrl', ["$scope", "locale", "attNotificationsService", "modalService", "$timeout", "GlobalMessagesService",
        function ($scope, locale, attNotificationsService, modalService, $timeout, GlobalMessagesService) {

            attNotificationsService.checkUserPreferencesInfo();

            $scope.attNotificationsServiceData = attNotificationsService.data;

            $scope.rulesListSearchText = "";

            $scope.disabledActivateDeActivate = false;

            var _setStateActivateDeActivate = function (state) {
                $scope.disabledActivateDeActivate = state;
            };

            var _goToName = null;

            $scope.isDisabledActivateDeActivate = function () {
                var isDisabled = ($scope.disabledActivateDeActivate === true);
                    if( !isDisabled  ){
                        var callerRole = attNotificationsService.getCallerRole();
                        isDisabled = (!attNotificationsService.isUserAllowToDoAction_EnableNotification(callerRole) );
                    }
                return isDisabled;
            };

            $scope.rulesListGridApi = {
                dataLoaded:function(){
                    if(!ObjectUtils.isEmpty(_goToName)){
                        $scope.rulesListGridApi.selectAndGoToItem({name: _goToName});
                    } else {
                        $scope.rulesListGridApi.selectAndGoToItem(0);
                    }
                },
                onRowDblClick: function (rowData) {
                    $scope.onEditNotificationRule(rowData);
                },
                rowContextMenu:function(event, rowDataContext){
                    if($scope.rulesListGridApi.info.selectedItemsLength <= 1 ){
                        $scope.rulesListGridApi.selectAndGoToItem({name: rowDataContext.name });
                    }

                    var menu=[];
                    var itemId = 0;
                    //canActivateNotificationRule
                    var showEnable = ($scope.rulesListGridApi.selectedItems != null && $scope.rulesListGridApi.selectedItems[0] != null && ($scope.rulesListGridApi.selectedItems[0].notification.enabled === false || $scope.rulesListGridApi.selectedItems.length > 1) );
                    var showDisable = ($scope.rulesListGridApi.selectedItems != null && $scope.rulesListGridApi.selectedItems[0] != null && ($scope.rulesListGridApi.selectedItems[0].notification.enabled === true || $scope.rulesListGridApi.selectedItems.length > 1) );

                    var callerRole = attNotificationsService.getCallerRole();
                    // if($scope.rulesListGridApi.selectedItems != null && $scope.rulesListGridApi.selectedItems[0] != null){
                    //     callerRole = ObjectUtils.get($scope.rulesListGridApi.selectedItems[0], "metadata.caller_role");
                    // }

                    menu.push({
                        id: (++itemId),
                        name: locale.getString("common.base.OpenDots"),
                        disabled: $scope.rulesListGridApi.info.selectedItemsLength > 1,
                        clickFunc: function($event, menuItem, rowData){
                            $scope.onEditNotificationRule(rowData);
                        }
                    });

                    if( showEnable && attNotificationsService.isUserAllowToDoAction_EnableNotification(callerRole) ){
                        menu.push({
                            id: (++itemId),
                            disabled: $scope.disabledActivateDeActivate,
                            name: locale.getString("common.base.Enable"),
                            clickFunc: function($event, menuItem, rowData){
                                $scope.onEnableNotificationRule();
                            }
                        });
                    }
                    if( showDisable && attNotificationsService.isUserAllowToDoAction_EnableNotification(callerRole) ){
                        menu.push({
                            id: (++itemId),
                            disabled: $scope.disabledActivateDeActivate,
                            name: locale.getString("common.base.Disable"),
                            clickFunc: function($event, menuItem, rowData){
                                $scope.onDisableNotificationRule();
                            }
                        });
                    }
                    if( attNotificationsService.isUserAllowToDoAction_DeleteNotification(callerRole) ){
                        menu.push({
                            id: (++itemId),
                            name: locale.getString("common.base.Delete_Dots"),
                            clickFunc: function($event, menuItem, rowData){
                                $scope.onDeleteNotificationRule();
                            }
                        });
                    }

                    return menu;
                }
            };

            $scope.clearSelectionRulesList = function () {
                if($scope.rulesListGridApi && $scope.rulesListGridApi.clearSelection){
                    $scope.rulesListGridApi.clearSelection();
                }
            };

            $scope.onChangeGroupType = function ($event, groupType) {
                attNotificationsService.applyGroupTypeFilterOnNotificationsList(groupType);
                $scope.clearSelectionRulesList();
            };

            $scope.refreshNotificationList = function (onSuccess) {
                if(onSuccess == null){
                    onSuccess = function () {
                        $scope.clearSelectionRulesList();
                    }
                }
                attNotificationsService.getNotificationRulesList(null, null, attNotificationsService.data.rulesListSelectedGroupType, onSuccess, null);
            };

            $scope.onNewNotificationRule = function () {
                attNotificationsService.createNewNotificationRule(attNotificationsService.data.rulesListSelectedGroupType, null, null, $scope.refreshNotificationList);
            };

            $scope.onEditNotificationRule = function (rowData) {
                if(rowData == null && $scope.rulesListGridApi.selectedItems[0] != null){
                    //in case of open from action-bar
                    rowData = $scope.rulesListGridApi.selectedItems[0];
                }
                attNotificationsService.calcEventsGroups( attNotificationsService.data.rulesListSelectedGroupType );
                attNotificationsService.calcVariablesDictionary();
                var notificationRuleClone = ObjectUtils.deepClone(rowData.notification);
                attNotificationsService.showNotificationRuleWizard(notificationRuleClone, false, attNotificationsService.data.rulesListSelectedGroupType, null, $scope.refreshNotificationList);
            };

            $scope.canEditNotificationRule = function () {
                return ($scope.rulesListGridApi.info.selectedItemsLength == 1 && $scope.rulesListGridApi.selectedItems[0] != null);
            };

            var _canApplyMultiSelection = function () {
                return ($scope.rulesListGridApi.info.selectedItemsLength > 1);
            };
            $scope.canDeleteNotificationRule = function () {
                return $scope.canEditNotificationRule() || _canApplyMultiSelection();
            };
            $scope.canActivateNotificationRule = function () {
                return (  $scope.canEditNotificationRule() && ($scope.rulesListGridApi.selectedItems[0].notification.enabled == false) ) || _canApplyMultiSelection();
            };
            $scope.canDeActivateNotificationRule = function () {
                return ( $scope.canEditNotificationRule() && ($scope.rulesListGridApi.selectedItems[0].notification.enabled == true) ) || _canApplyMultiSelection();
            };

            function _setNotificationState(notificationsNames, state, timeOutMiliSec) {
                _goToName = (notificationsNames.length == 1) ? notificationsNames[0] : null;
                timeOutMiliSec = (timeOutMiliSec != null) ? timeOutMiliSec : 150;

                attNotificationsService.applyNotificationRuleState(notificationsNames, state, function () {

                    _setStateActivateDeActivate(true);

                    $scope.refreshNotificationList( function () {
                        setTimeout(function () {

                            if( _goToName != null){
                                $scope.clearSelectionRulesList();
                                $scope.rulesListGridApi.selectAndGoToItem({name: _goToName });
                            }

                            $timeout(function () {
                                _setStateActivateDeActivate(false);
                            }, timeOutMiliSec);

                        }, 0);
                    });
                });
            };

            var _isNotDisabledAndCallerRoleOk = function () {
                return !$scope.isDisabledActivateDeActivate() && attNotificationsService.isUserAllowToDoAction_EnableNotification( attNotificationsService.getCallerRole() );
            };

            $scope.onEnableNotificationRule = function () {
                if( _isNotDisabledAndCallerRoleOk() ){
                    var selection = $scope.rulesListGridApi.getSelection();
                    var setState = true;
                    var notificationsNames = attNotificationsService.getNotificationsNamesArrForEnableDisableState(selection, setState);
                    _setNotificationState(notificationsNames, setState, null);
                }
            };
            $scope.onDisableNotificationRule = function () {
                if( _isNotDisabledAndCallerRoleOk() ){
                    var selection = $scope.rulesListGridApi.getSelection();
                    var setState = false;
                    var notificationsNames = attNotificationsService.getNotificationsNamesArrForEnableDisableState(selection, setState);
                    _setNotificationState(notificationsNames, setState, null);
                }
            };
            $scope.onToggleNotificationRuleState = function ($event, rowData) {
                if( _isNotDisabledAndCallerRoleOk() ){
                    _setNotificationState([rowData.notification.name], rowData.notification.enabled, 950);
                }
            };

            $scope.onDeleteNotificationRule = function () {
                if ($scope.canDeleteNotificationRule() ) {
                    var selection = $scope.rulesListGridApi.getSelection();
                    var bodyText = ($scope.rulesListGridApi.info.selectedItemsLength == 1) ? locale.getString('common.notifications.AreYouSureYouWantToDeleteNotificationSingle',[selection[0].notification.name]) : locale.getString('common.notifications.AreYouSureYouWantToDeleteNotificationMulti',[$scope.rulesListGridApi.info.selectedItemsLength]);
                    var dialog = modalService.showConfirm(
                        {
                            headerText: locale.getString('common.notifications.DeleteNotification'),
                            bodyText: bodyText,
                            actionButtonText: locale.getString('common.base.Yes'),
                            closeButtonText: locale.getString('common.base.No')
                        }
                    );
                    dialog.then(function () {
                            attNotificationsService.deleteNotification(selection,
                                function () {
                                    //update notification List
                                    $scope.refreshNotificationList();
                                });
                        },
                        function () {

                        });
                }
            };



            $scope.initRulesListCtrl = function () {
                $scope.refreshNotificationList();
            };

            /************/
            $scope.initRulesListCtrl();
            /************/

        }]);



    attNotificationsModule.controller('attNewEditNotificationsWizardCtrl', ["$scope", "attUtilsService", "attNotificationsService", "ValidationService","locale","$filter",
        "AEM_ServersService", "VersionPolicyService",
        function ($scope, attUtilsService, attNotificationsService, ValidationService, locale, $filter, AEM_ServersService, VersionPolicyService) {

            $scope.attNotificationsServiceData = attNotificationsService.data;
            var displayObjectType = ($scope.vm.uiData.groupType == consts.Notification.GroupType.TASK) ? "tasks" : "servers";
            $scope.eventsStepSubTitle = locale.getString('common.notifications.NotificationWillBeSentOnSelectedEvents');

            /*need to match HTML*/
            var FORM_NAME_EDIT_EVENTS = "NewEditNotificationForm";
            var FORM_NAME_EDIT_MESSAGES = "EditNotificationMessagesForm";

            var _MessageInputName = {
                inputEmailSubject:"inputEmailSubject",
                txtAreaGeneralMessage:"txtAreaGeneralMessage",
                txtAreaMessageCenterMessage:"txtAreaMessageCenterMessage",
                none:"none"
            };

            $scope.selectedMessageInputId = "";
            $scope.selectedVariable = "";

            $scope.onVariableClick = function (item) {
                $scope.selectedVariable = item;
            };
            $scope.onVariableDblClick = function (item) {
                $scope.selectedVariable = item;
                $scope.onAddMessageVariable();
            };

            // $scope.handleKeypress = function($event){
            //     if($event.keyCode == consts.ConstKey.ArrowDown){
            //         $($event.currentTarget).next().focus().click();
            //
            //     }else if($event.keyCode == consts.ConstKey.ArrowUp) {
            //         $($event.currentTarget).prev().focus().click();
            //     }
            // };

            $scope.onAddMessageVariable = function () {
                var inputEl = document.getElementById( $scope.selectedMessageInputId );
                attUtilsService.replaceSelectedText(inputEl, $scope.selectedVariable);
                angular.element(inputEl).trigger("change");
            };

            $scope.changeGroupSelection = function () {
                attNotificationsService.resetDictionaryValuesToFalse($scope.vm.uiData.selectedEvents);
            };

            //singleSelectedEventRadioBtn
            $scope.onChangeEventRadioButton = function ($event, item) {
                attNotificationsService.resetDictionaryValuesToFalse($scope.vm.uiData.selectedEvents);

                $scope.vm.uiData.selectedEvents[$scope.vm.uiData.singleSelectedEventRadioBtn] = true;

                var eventGroupWasChanged = false;
                if( item.inParentGroup != $scope.vm.uiData.notificationTypeRadioBtnGroup ){
                    eventGroupWasChanged = true;
                    $scope.vm.uiData.previousGroupType = $scope.vm.uiData.notificationTypeRadioBtnGroup;
                    $scope.vm.uiData.notificationTypeRadioBtnGroup = item.inParentGroup;
                    //resetDictionaryValuesToFalse
                    attNotificationsService.resetDictionaryValuesToFalse($scope.vm.uiData.selectedEvents);
                    $scope.vm.uiData.selectedEvents[item.eventKey] = true;
                }
                const minVersion = $scope.vm.uiData.eventsProperty[item.eventKey].minVersion;
                $scope.vm.uiData.associate.minVersion = minVersion;
                attNotificationsService.updateValidServers($scope.vm.uiData, minVersion);
                attNotificationsService.updateValidTasks($scope.vm.uiData, minVersion);
                attNotificationsService.updateNotificationSelectedEventsAndValues($scope.vm, eventGroupWasChanged);
                attNotificationsService.updateOnSetActions($scope.vm, false);
                attNotificationsService.validateEventsInputsValue($scope.vm.notification, $scope.vm.uiData, true);

                var displayValue = $scope.vm.uiData.eventsProperty[item.eventKey].displayValue;
                var initialValue = $scope.vm.uiData.eventsProperty[item.eventKey].initialValue;
                if(displayValue == initialValue || displayValue == undefined || displayValue == attNotificationsService.CONSTANTS.EmptyString){
                    return;
                }
                if($scope.vm.uiData.eventsProperty[item.eventKey].regEx != null && !($scope.vm.uiData.eventsProperty[item.eventKey].regEx).test(displayValue) ){
                    $scope.vm.uiData.eventsProperty[item.eventKey].errorMessage = $scope.vm.uiData.eventsProperty[item.eventKey].regExErrorMsg;
                }
            };

            $scope.onChangedConditionValue = function ($event, eventObject) {
                attNotificationsService.resetDictionaryValuesToFalse($scope.vm.uiData.selectedEvents);
                $scope.vm.uiData.selectedEvents[$scope.vm.uiData.singleSelectedEventRadioBtn] = true;

                attNotificationsService.updateNotificationSelectedEventsAndValues($scope.vm, false);
                attNotificationsService.validateEventsInputsValue($scope.vm.notification, $scope.vm.uiData, true);
            };

            $scope.onChangedConditionValueFromRadio = function ($event, eventObject) {
                attNotificationsService.updateNotificationSelectedEventsAndValues($scope.vm, false);
                attNotificationsService.validateEventsInputsValue($scope.vm.notification, $scope.vm.uiData, true);
            };
            
            $scope.onChangedConditionUnitSizeGroup = function ($event, eventObject, selectedUnitSizeLabel) {
                //update unit size
                $scope.vm.uiData.eventsProperty[eventObject.eventKey].selectedUnitSize = selectedUnitSizeLabel;

                attNotificationsService.updateNotificationSelectedEventsAndValues($scope.vm, false);
                attNotificationsService.validateEventsInputsValue($scope.vm.notification, $scope.vm.uiData, true);
            };

            $scope.initDeliveryAction = function () {
                attNotificationsService.checkNotificationForMailServer($scope.vm);
            };

            $scope.onChangeDeliveryAction = function ($event, actionName) {
                var changeOnActionEmailRecipients = (actionName == 'EmailRecipients');
                attNotificationsService.updateOnSetActions($scope.vm, changeOnActionEmailRecipients);
                $scope.vm.uiData.dirtyNotification = true;
            };

            $scope.onChangeEmailRecipients = function () {
                attNotificationsService.updateRecipients($scope.vm, true);
            };

            $scope.onChangeEmailSubject = function () {
                attNotificationsService.updateOnSetActions($scope.vm, false);
            };

            $scope.onChangeMessage = function () {
                attNotificationsService.updateOnSetActions($scope.vm, false);
            };

            /* Associate */
            $scope.associateCtrlData = {
                selectedServer:"",
                tasksSearch:"",
                searchSelectedTasks:"",
                showSecondSearch : false
            };

            $scope.initAssociate = function () {
                attNotificationsService.checkTasksListAndServerList($scope.vm, $scope.associateCtrlData);
                if($scope.vm.uiData.groupType == consts.Notification.GroupType.TASK ){
                    attNotificationsService.checkAssociateGroupState($scope.vm);
                }
                setTimeout(function () {
                    if($scope.availableTasksGridApi.updateViewState != null){
                        $scope.availableTasksGridApi.updateViewState();
                    }
                    if($scope.availableTasksGridApi.fixHeaders != null){
                        $scope.availableTasksGridApi.fixHeaders();
                    }
                    if($scope.associatedTasksInRuleGridApi.updateViewState != null){
                        $scope.associatedTasksInRuleGridApi.updateViewState();
                    }
                    if($scope.associatedTasksInRuleGridApi.fixHeaders != null){
                        $scope.associatedTasksInRuleGridApi.fixHeaders();
                    }
                },250);

            };
            //initAssociate
            $scope.initAssociate();
            //grid
            $scope.availableTasksGridConfig = {
                headerCtxMenuActions: {
                    defaultSorting: true,
                    sorting:true,
                    freezeColumn:false,
                    quickColumnSelection:false,
                    exportToCSV:false,
                    exportToTSV:false,
                    exportToHTML:false,
                    columnSettings:false,
                    hideColumn:false,
                    valuesFilter:false
                }
            };
            $scope.columnsInSearchAvailableTasksGrid = [
                'server_name',
                'task_name'
            ];
            $scope.selectFilterServer = function(serverItem){
                if(serverItem.lookFor == consts.Notification.Associate.ALL){
                    if($scope.vm.uiData.associate.displayedTasksList.length < $scope.vm.uiData.associate.validTasksList.length){
                        $scope.vm.uiData.associate.displayedTasksList.length = 0;
                        $scope.vm.uiData.associate.displayedTasksList = ObjectUtils.deepClone($scope.vm.uiData.associate.validTasksList);
                    }
                    if($scope.columnsInSearchAvailableTasksGrid.indexOf('server_name') == -1){
                        $scope.columnsInSearchAvailableTasksGrid.push('server_name')
                    }
                }
                else {
                    var indexOfServer = $scope.columnsInSearchAvailableTasksGrid.indexOf('server_name');
                    if(indexOfServer > -1){
                        $scope.columnsInSearchAvailableTasksGrid.length = 0;
                        $scope.columnsInSearchAvailableTasksGrid.push('task_name');
                    }
                    $scope.vm.uiData.associate.displayedTasksList = $filter('filter')($scope.vm.uiData.associate.validTasksList, function (iTask) {
                        return (iTask.server_name == serverItem.lookFor);
                    });
                }
            };
            $scope.availableTasksGridApi = {
                onRowDblClick:function(rowData){
                    if(rowData != null){
                        attNotificationsService.addAssociateTasks($scope.vm, [rowData]);
                    }
                },
                rowContextMenu:function(event, rowData) {
                    var leftMenuArr = [];
                    var itemId = 0;
                    leftMenuArr.push({
                        id: (++itemId),
                        disabled: ($scope.availableTasksGridApi.info.selectedItemsLength == 0),
                        name: locale.getString("common.notifications.AssociateButton.AddSelection"),
                        clickFunc: function ($event, menuItem, rowData) {
                            $scope.addSelectedTasksToRule();
                        }
                    });
                    leftMenuArr.push({
                        id: (++itemId),
                        disabled: ($scope.availableTasksGridApi.info.displayedItemsLength == 0),
                        name: locale.getString("common.notifications.AssociateButton.AddALL"),
                        clickFunc: function ($event, menuItem, rowData) {
                            $scope.addAllTasksToRule();
                        }
                    });
                    return leftMenuArr;
                }
            };
            $scope.associatedTasksInRuleGridApi = {
                rowContextMenu:function(event, rowData) {
                    var rightMenuArr = [];
                    var itemId = 0;
                    rightMenuArr.push({
                        id: (++itemId),
                        disabled: ($scope.associatedTasksInRuleGridApi.info.selectedItemsLength == 0),
                        name: locale.getString("common.notifications.AssociateButton.RemoveSelection"),
                        clickFunc: function ($event, menuItem, rowData) {
                            $scope.removeSelectedTasksFromRule();
                        }
                    });
                    rightMenuArr.push({
                        id: (++itemId),
                        disabled: ($scope.vm.uiData.associate.selectedTasks.length == 0),
                        name: locale.getString("common.notifications.AssociateButton.RemoveALL"),
                        clickFunc: function ($event, menuItem, rowData) {
                            $scope.removeAllTasksFromList();
                        }
                    });
                    return rightMenuArr;
                }
            };
            $scope.addSelectedTasksToRule = function($event){
                attNotificationsService.addAssociateTasks($scope.vm, $scope.availableTasksGridApi.selectedItems);
            };
            $scope.addAllTasksToRule = function($event){
                $scope.availableTasksGridApi.selectAllRows();
                setTimeout(function () {
                    attNotificationsService.addAssociateTasks($scope.vm, $scope.availableTasksGridApi.selectedItems);
                },50);
            };
            $scope.removeSelectedTasksFromRule  = function($event){
                attNotificationsService.removeAssociatedTasks($scope.vm, $scope.associatedTasksInRuleGridApi.selectedItems);
                $scope.associatedTasksInRuleGridApi.clearSelection();
            };
            $scope.removeAllTasksFromList = function($event){
                $scope.vm.uiData.associate.selectedTasks.length = 0;
                attNotificationsService.updateRulesForAssociateTasks($scope.vm);
                $scope.associatedTasksInRuleGridApi.clearSelection();
            };

            $scope.onAssociateGroupRbChanged = function($event){
                $scope.vm.uiData.dirtyNotification = true;
                $scope.vm.uiData.associate.groupLabel = attNotificationsService.getAssociateGroupLabel($scope.vm.uiData.associate.group);
            };

            /*messages*/
            $scope.initEditMessageSection = function () {
                if($scope.vm.uiData.deliveryAction.isEmail){
                    $scope.selectedMessageInputId = _MessageInputName.inputEmailSubject;
                }
                else if($scope.vm.uiData.deliveryAction.isEventLog){
                    $scope.selectedMessageInputId = _MessageInputName.txtAreaGeneralMessage;
                }
                else{
                    $scope.selectedMessageInputId = _MessageInputName.none;
                }
                $scope.selectedVariable = "";
            };
            $scope.onClickSomewhere = function ($event) {
                if($event == null || $event.target.id == "" ||_MessageInputName[$event.target.id] == null ){
                    $scope.selectedMessageInputId = _MessageInputName.none;
                }
            };
            $scope.onClickInputMessage = function ($event) {
                if($event != null && $event.target.id != "" && ( _MessageInputName[$event.target.id] != null ) ){
                    $scope.selectedMessageInputId =_MessageInputName[$event.target.id];
                    $event.stopPropagation();
                }
                else {
                    $scope.selectedMessageInputId = _MessageInputName.none;
                }
            };
            $scope.isDisabledRestoreMessage = function () {
                return attNotificationsService.isEmailSubjectOrBodyMessageEqualToPreDefined($scope.vm);
            };
            $scope.onClickRestorePredefineMessage = function () {
                attNotificationsService.restorePredefineMessage($scope.vm);
            };
            $scope.isNotificationDirty = function () {
                return ($scope.vm.uiData.dirtyNotification === true);
            };
            $scope.canPutNotification = function () {
                return attNotificationsService.isDefinePutNotification();
            };
            /* validation */
            $scope.validateStepEvents = function () {
                return ValidationService.isValid(FORM_NAME_EDIT_EVENTS) && attNotificationsService.isOneOrMoreSelectedEvents($scope.vm.uiData.selectedEvents) && attNotificationsService.isSelectedEventsParamValueValid($scope.vm.notification, $scope.vm.uiData);
            };
            $scope.validateStepRecipient = function () {
                return ($scope.vm.uiData.deliveryAction.isEventLog && !$scope.vm.uiData.deliveryAction.isEmail)
                || ($scope.vm.uiData.deliveryAction.isEmail && $scope.vm.uiData.emailRecipientsValidation.to && $scope.vm.uiData.emailRecipientsValidation.cc && $scope.vm.uiData.emailRecipientsValidation.bcc
                    && ($scope.vm.uiData.emailRecipients.to.length > 0 || $scope.vm.uiData.emailRecipients.cc.length > 0 || $scope.vm.uiData.emailRecipients.bcc.length > 0 ) ) ;
            };
            $scope.validateStepRecipientForFinish = function () {
                return $scope.validateStepRecipient() || ($scope.vm.uiData.deliveryAction.isEventLog === false && $scope.vm.uiData.deliveryAction.isEmail === false)
            };
            $scope.validateStepMessages = function () {
                return  ($scope.vm.uiData.deliveryAction.isEventLog === false && $scope.vm.uiData.deliveryAction.isEmail === false)
                || ( ValidationService.isValid(FORM_NAME_EDIT_MESSAGES) && ( (  $scope.vm.uiData.deliveryAction.isEventLog === true && $scope.vm.uiData.messages.emailBody != "")
                    || ( $scope.vm.uiData.deliveryAction.isEmail === true && $scope.vm.uiData.messages.emailSubject != "" && $scope.vm.uiData.messages.emailBody != "") ) );
            };
            $scope.validateStepMessagesForFinish = function () {
                return ($scope.vm.uiData.deliveryAction.isEventLog === false && $scope.vm.uiData.deliveryAction.isEmail === false)
                    || ( ValidationService.isValid(FORM_NAME_EDIT_MESSAGES) && ( ($scope.vm.uiData.deliveryAction.isEventLog === true && $scope.vm.uiData.messages.emailBody != "")
                        || ( $scope.vm.uiData.deliveryAction.isEmail === true && $scope.vm.uiData.messages.emailSubject != "" && $scope.vm.uiData.messages.emailBody != "") ) );
            };
            $scope.validateStepAssociateTasks = function () {
                if($scope.vm.uiData.associate.group == consts.Notification.Associate.ALL){
                    return true;
                }
                else if($scope.vm.uiData.associate.group == consts.Notification.Associate.SELECTED){
                    return ($scope.vm.uiData.associate.selectedTasks.length > 0);
                }
                return true;
            };
            $scope.isAllWizardStepsValid = function () {
                return $scope.validateStepEvents() && $scope.validateStepRecipient() && $scope.validateStepMessages() && $scope.validateStepAssociateTasks();
            };
            $scope.canClickSave = function () {
                // var isDirtyOrNotNew = (!$scope.vm.uiData.isNew || $scope.isNotificationDirty() ) &&
                var vmCanBeSave = $scope.validateStepEvents() && $scope.canPutNotification() && $scope.validateStepRecipientForFinish() && $scope.validateStepMessagesForFinish() && $scope.validateStepAssociateTasks();
                if($scope.vm.uiData.vmCanBeSave !== vmCanBeSave){
                    $scope.vm.uiData.vmCanBeSave = vmCanBeSave;
                }
                return vmCanBeSave;
            };

            $scope.$watch("vm.notification", function (newVal, oldVal) {
                if( oldVal != null && newVal != oldVal && !$scope.vm.uiData.dirtyNotification){
                    $scope.vm.uiData.dirtyNotification = true;
                }
            }, true);

            function _initCtrl() {
                if($scope.vm.uiData.selectedItems){
                    $scope.vm.uiData.associate.group = (Object.keys($scope.vm.uiData.selectedItems).length == 0) ? "ALL" : "SELECTED";
                    attNotificationsService.addAssociateTasks($scope.vm, $scope.vm.uiData.selectedItems);
                }
                else {
                    attNotificationsService.checkNotificationMinVersion($scope.vm.uiData);
                }
            }

            _initCtrl();

        }]);

    attNotificationsModule.run(['$templateCache', function($templateCache){
        $templateCache.put('itemsWithTooltipTpl.html',
            '<div id="customTooltip" ng-if="customTemplateData.length > 0">' +
                '<ul class="notificationListInTooltip">'+
                '<li ng-repeat="itemName in customTemplateData">{{itemName}}</li>'+
                '</ul>'+
            '</div>');

        $templateCache.put('eventNotificationAsRadioButtons.html',
            '<div class="notificationEventTypeCheckBoxWrapper">' +
                '<att-radio-button  class="eventTypeCheckBox" ng-model="vm.uiData.singleSelectedEventRadioBtn" value="eventObject.eventKey" ng-change="onChangeEventRadioButton($event, eventObject)"  label="{{eventObject.label}}" disabled="eventObject.disable"></att-radio-button> '+
                '<span class="labelForValueInTextMode" ng-if="vm.uiData.singleSelectedEventRadioBtn != eventObject.eventKey">{{vm.uiData.eventsProperty[eventObject.eventKey].displayValue || vm.uiData.eventsProperty[eventObject.eventKey].initialValue}}</span>'+
                '<input ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey" type="text" ng-model="vm.uiData.eventsProperty[eventObject.eventKey].displayValue"  ng-change="onChangedConditionValueFromRadio($event, eventObject)" class="notificationEventInput" placeholder="{{vm.uiData.eventsProperty[eventObject.eventKey].initialValue}}"/> ' +
                '<span ng-if="vm.uiData.singleSelectedEventRadioBtn != eventObject.eventKey" class="textAfterInput" >{{vm.uiData.eventsProperty[eventObject.eventKey].selectedUnitSize}}</span>'+
                '<att-select-list ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey" model="vm.uiData.eventsProperty[eventObject.eventKey].selectedUnitSize" on-item-selected="onChangedConditionUnitSizeGroup($event, eventObject, item)" source-array="eventObject.units" style="width: auto;"></att-select-list>' +
                '<span ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey && (vm.uiData.eventsProperty[eventObject.eventKey].valid === false)" class="errorLabelForInputValue" >{{vm.uiData.eventsProperty[eventObject.eventKey].errorMessage}}</span>'+
            '</div>');

        $templateCache.put('eventNotificationRequiredVersionAsRadioButtonsFixedUnits.html',
            '<div class="notificationEventTypeCheckBoxWrapper">' +
            '<att-radio-button  class="eventTypeCheckBox" ng-model="vm.uiData.singleSelectedEventRadioBtn" value="eventObject.eventKey" ng-change="onChangeEventRadioButton($event, eventObject)"  label="{{eventObject.label}}" disabled="eventObject.disable || !vm.uiData.eventsProperty[eventObject.eventKey].validVersion"></att-radio-button> '+
            '<span ng-class="{\'disabled\': !vm.uiData.eventsProperty[eventObject.eventKey].validVersion}" class="labelForValueInTextMode" ng-if="vm.uiData.singleSelectedEventRadioBtn != eventObject.eventKey">{{vm.uiData.eventsProperty[eventObject.eventKey].displayValue || vm.uiData.eventsProperty[eventObject.eventKey].initialValue}}</span>'+
            '<input ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey" type="text" ng-model="vm.uiData.eventsProperty[eventObject.eventKey].displayValue"  ng-change="onChangedConditionValueFromRadio($event, eventObject)" class="notificationEventInput" placeholder="{{vm.uiData.eventsProperty[eventObject.eventKey].initialValue}}"/> ' +
            '<span ng-class="{\'disabled\': !vm.uiData.eventsProperty[eventObject.eventKey].validVersion}" class="textAfterInput" >{{vm.uiData.eventsProperty[eventObject.eventKey].selectedUnitSize}}</span>'+
            '<span ng-if="vm.uiData.eventsProperty[eventObject.eventKey].toolTipText" class="bootstrapGlyphicon glyphicon-info-sign" att-custom-tooltip custom-tooltip-text="{{vm.uiData.eventsProperty[eventObject.eventKey].toolTipText}}" style="cursor: pointer; color: #3D9BDF;top: -4px;"></span>' +
            '<label ng-if="!vm.uiData.eventsProperty[eventObject.eventKey].validVersion" class="minRequiredVersionText disabled">{{vm.uiData.eventsProperty[eventObject.eventKey].minRequiredVersionText}}</label>' +
            '<div ng-if="vm.uiData.eventsProperty[eventObject.eventKey].validVersion && vm.uiData.eventsProperty[eventObject.eventKey].note" class="noteText" >{{vm.uiData.eventsProperty[eventObject.eventKey].note}}</div>' +
            '<label ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey && (vm.uiData.eventsProperty[eventObject.eventKey].valid === false)" class="errorLabelForInputValue" >{{vm.uiData.eventsProperty[eventObject.eventKey].errorMessage}}</label>' +
            '</div>');

        $templateCache.put('eventNotificationSelectListAndValue.html',
            '<div class="notificationEventTypeCheckBoxWrapper">' +
                '<att-radio-button  class="eventTypeCheckBox" ng-model="vm.uiData.singleSelectedEventRadioBtn" value="eventObject.eventKey" ng-change="onChangeEventRadioButton($event, eventObject)"  label="{{eventObject.label}}" disabled="eventObject.disable"></att-radio-button> ' +
                '<span ng-if="vm.uiData.singleSelectedEventRadioBtn != eventObject.eventKey" class="textAfterInput ellipsisStyle" style="width:calc(100% - 342px); white-space:nowrap;" title="{{vm.uiData.eventsProperty[eventObject.eventKey].displayValue}}">{{vm.uiData.eventsProperty[eventObject.eventKey].displayValue || vm.uiData.eventsProperty[eventObject.eventKey].initialValue}}</span> ' +
                '<span ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey" class="bootstrapGlyphicon glyphicon-info-sign" att-custom-tooltip custom-tooltip-text="{{eventObject.infoText}}" style="cursor:pointer; color:#3D9BDF; top:-4px; float:left; margin-left:8px;"></span>' +
                '<input ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey" type="text" ng-model="vm.uiData.eventsProperty[eventObject.eventKey].displayValue" ng-change="onChangedConditionValueFromRadio($event, eventObject)" class="notificationEventLongInput ellipsisStyle" title="{{vm.uiData.eventsProperty[eventObject.eventKey].displayValue}}" placeholder="{{vm.uiData.eventsProperty[eventObject.eventKey].initialValue}}"/>' +
                '<span ng-if="vm.uiData.singleSelectedEventRadioBtn == eventObject.eventKey && (vm.uiData.eventsProperty[eventObject.eventKey].valid === false)" class="errorLabelForInputValue" >{{vm.uiData.eventsProperty[eventObject.eventKey].errorMessage}}</span>' +
            '</div>');


        // $templateCache.put('eventNotificationCheckBoxWithInput.html',
        //     '<div class="notificationEventTypeCheckBoxWrapper">' +
        //         '<att-checkbox  class="eventTypeCheckBox" ng-model="vm.uiData.selectedEvents[eventObject.eventKey]" ng-change="onChangeCheckboxState($event, eventObject)" label="{{eventObject.label}}" disabled="eventObject.disable"></att-checkbox> '+
        //         '<span class="labelForValueInTextMode" ng-if="vm.uiData.selectedEvents[eventObject.eventKey] != true">{{vm.uiData.eventsProperty[eventObject.eventKey].displayValue}}</span>'+
        //         '<input ng-if="vm.uiData.selectedEvents[eventObject.eventKey] === true" type="text" ng-model="vm.uiData.eventsProperty[eventObject.eventKey].displayValue"  ng-change="onChangedConditionValue($event, eventObject)" class="notificationEventInput"/> ' +
        //         '<span ng-if="vm.uiData.selectedEvents[eventObject.eventKey] !== true" class="textAfterInput" >{{vm.uiData.eventsProperty[eventObject.eventKey].selectedUnitSize}}</span>'+
        //         '<att-select-list ng-if="vm.uiData.selectedEvents[eventObject.eventKey] === true" model="vm.uiData.eventsProperty[eventObject.eventKey].selectedUnitSize" on-item-selected="onChangedConditionUnitSizeGroup($event, eventObject, item)" source-array="eventObject.units" style="width: auto;"></att-select-list>' +
        //         '<span ng-if="vm.uiData.selectedEvents[eventObject.eventKey] === true && (vm.uiData.eventsProperty[eventObject.eventKey].valid === false)" class="errorLabelForInputValue" >{{vm.uiData.eventsProperty[eventObject.eventKey].errorMessage}}</span>'+
        //     '</div>');
    }]);

})(window.angular);
