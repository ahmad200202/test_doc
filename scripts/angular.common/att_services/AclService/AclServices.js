!function(angular){"use strict";function _getRoleValue(role){return DO.AuthUserRoleType_values[role]}var aclService=angular.module("attAclService",[]);aclService.service("AclService",["InvokerService","modalService","locale","MethodsRequiredRoles","authorizationFactory","$window",function(InvokerService,modalService,locale,MethodsRequiredRoles,authorizationFactory,$window){function _getArrayPropForRoleValue(role_val){var res=DO.AuthorizationAclDto.none_role;switch(role_val){case DO.AuthUserRoleType_values.ADMIN:res=DO.AuthorizationAclDto.admin_role;break;case DO.AuthUserRoleType_values.DESIGNER:res=DO.AuthorizationAclDto.designer_role;break;case DO.AuthUserRoleType_values.OPERATOR:res=DO.AuthorizationAclDto.operator_role;break;case DO.AuthUserRoleType_values.VIEWER:res=DO.AuthorizationAclDto.viewer_role;break;case DO.AuthUserRoleType_values.NONE:res=DO.AuthorizationAclDto.none_role}return res}function _fromSingleGroupUser(serverAclObject,uiData,roleProp,roleVal,isGroup,isInherited){if(null!=serverAclObject&&!ObjectUtils.isEmpty(serverAclObject)){var pTemp=isGroup?DO.RoleDef.groups:DO.RoleDef.users;ArrayUtils.each(serverAclObject[roleProp][pTemp],function(it){var tmpItem={isInherited:isInherited,role:roleVal,roleValue:_getRoleValue(roleVal),name:it.name,isGroup:isGroup},userEntry=ObjectUtils.caseInsensitiveGet(uiData.usersGroupsDic,tmpItem.name);null==userEntry?(uiData.usersGroupsDic[it.name]=tmpItem,isInherited&&(uiData.usersGroupsDic[it.name].inheritedRole=roleVal,uiData.usersGroupsDic[it.name].inheritedRoleValue=tmpItem.roleValue)):isInherited?(userEntry.inheritedRole=roleVal,userEntry.inheritedRoleValue=tmpItem.roleValue):tmpItem.roleValue>_getRoleValue(userEntry.roleValue)&&(userEntry.role=roleVal,userEntry.roleValue=tmpItem.roleValue)})}}var AclService={GetDefaultPermissionsViewConfig:function(){return{showActionBar:!0,showSaveDiscard:!0,showEffectivePermissions:!0,errorMessage:"",explanatoryTextsTitle:"",explanatoryTextsContent:"",explanatoryTextsContentMidNote:null,explanatoryTextsContentAfterNote:null,text:{disable:"",enable:""},buttonTooltip:{currentlyEnabled:"",currentlyDisabled:""},inheritancePanelText:"",onSaveSuccess:null,onSaveError:null}},GetAcl:function(ctx,onSuccess,onError){null!=ctx.GetAcl.params&&ctx.GetAcl.params.based_on_parent!==!0&&(ctx.GetAcl.params.based_on_parent=!1),InvokerService.invokeServiceMethod(ctx,"GetAcl",onSuccess,onError)},PutAcl:function(ctx,acl,onSuccess,onError){ctx.PutAcl.params.putData=AclService.prepareServerData(acl,!1),InvokerService.invokeServiceMethod(ctx,"PutAcl",onSuccess,onError)},DeleteAcl:function(ctx,onSuccess,onError){InvokerService.invokeServiceMethod(ctx,"DeleteAcl",onSuccess,onError)},PutAclFromViewModel:function(viewModel,onSuccess,onError){AclService.PutAcl(viewModel.aclServiceCtx,viewModel.acl,function(){viewModel.isDirty=!1,_lastCleanVmAcl=ObjectUtils.deepClone(viewModel.acl),ObjectUtils.isKind(onSuccess,"Function")&&onSuccess(),ObjectUtils.isKind(viewModel.config.onSaveSuccess,"Function")&&viewModel.config.onSaveSuccess()},function(message,details,code){var errorHandled=!1;return ObjectUtils.isKind(onError,"Function")&&(onError(),errorHandled=!0),ObjectUtils.isKind(viewModel.config.onSaveError,"Function")&&(viewModel.config.onSaveError(message,details,code),errorHandled=!0),!errorHandled})},GetEffectivePermissions:function(ctx,acl,onSuccess,onError){ctx.GetEffectivePermissions.params.postData=acl,InvokerService.invokeServiceMethod(ctx,"GetEffectivePermissions",onSuccess,onError)},GetUrlAuthorization:function(url,onSuccess,onError,batchObj){authorizationFactory.AuthorizationGetUrlAuthorization(url,onSuccess,onError,batchObj)},ApplyUserRoleOverrides:function(){authorizationFactory.AuthorizationGetUserRoleOverrides(function(data){var overrides=data[DO.AuthorizationGetUserRoleOverridesResp.overrides];ArrayUtils.each(overrides,function(override){MethodsRequiredRoles[override[DO.RequiredUserRoleTypeOverride.method_name]].role=override[DO.RequiredUserRoleTypeOverride.required_role_type]})})},prepareUIData:function(serverAclObject){var uiData={};return uiData.enable_inheritance=!serverAclObject[DO.AuthorizationGetAclResp.acl][DO.AuthorizationAclDto.disable_inheritance],uiData.name=serverAclObject[DO.AuthorizationGetAclResp.acl][DO.AuthorizationAclDto.name],uiData.isRootAcl="::"==uiData.name,uiData.version=serverAclObject[DO.AuthorizationGetAclResp.acl][DO.AuthorizationAclDto.version],uiData.usersGroupsList=[],uiData.usersGroupsDic={},_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.admin_role,DO.AuthUserRoleType.ADMIN,!1,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.admin_role,DO.AuthUserRoleType.ADMIN,!0,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.designer_role,DO.AuthUserRoleType.DESIGNER,!1,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.designer_role,DO.AuthUserRoleType.DESIGNER,!0,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.operator_role,DO.AuthUserRoleType.OPERATOR,!1,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.operator_role,DO.AuthUserRoleType.OPERATOR,!0,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.viewer_role,DO.AuthUserRoleType.VIEWER,!1,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.viewer_role,DO.AuthUserRoleType.VIEWER,!0,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.none_role,DO.AuthUserRoleType.NONE,!1,!1),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.acl],uiData,DO.AuthorizationAclDto.none_role,DO.AuthUserRoleType.NONE,!0,!1),uiData.isRootAcl||(_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.admin_role,DO.AuthUserRoleType.ADMIN,!1,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.admin_role,DO.AuthUserRoleType.ADMIN,!0,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.designer_role,DO.AuthUserRoleType.DESIGNER,!1,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.designer_role,DO.AuthUserRoleType.DESIGNER,!0,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.operator_role,DO.AuthUserRoleType.OPERATOR,!1,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.operator_role,DO.AuthUserRoleType.OPERATOR,!0,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.viewer_role,DO.AuthUserRoleType.VIEWER,!1,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.viewer_role,DO.AuthUserRoleType.VIEWER,!0,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.none_role,DO.AuthUserRoleType.NONE,!1,!0),_fromSingleGroupUser(serverAclObject[DO.AuthorizationGetAclResp.inherited_acl],uiData,DO.AuthorizationAclDto.none_role,DO.AuthUserRoleType.NONE,!0,!0)),ObjectUtils.forOwn(uiData.usersGroupsDic,function(key,val){uiData.usersGroupsList.push(val)}),uiData},openUsersPermissionsPopup:function(ctx,title,config){var model={aclServiceCtx:ctx,config:config||AclService.GetDefaultPermissionsViewConfig()};model.config.showSaveDiscard=!1;modalService.showModal({model:model,contentTemplate:"scripts/angular.common/att_services/AclService/userPermissions.html",headerText:title||locale.getString("common.acl.UserPermissions"),minWidth:700,minHeight:500,resizable:!0,hasOk:!0,okDisabledProp:function(vm){return!vm.isDirty},onBeforeOk:function(vm,closeFnc){null!=vm.acl&&AclService.PutAcl(model.aclServiceCtx,vm.acl,function(){ObjectUtils.isKind(config.onSaveSuccess,"Function")&&config.onSaveSuccess(),closeFnc()},function(msg,details,statusCode){ObjectUtils.isKind(config.onSaveError,"Function")&&config.onSaveError(msg,details,statusCode)})},onBeforeClose:function(vm,closeModelFn){vm.isDirty&&ObjectUtils.isKind(config.onBeforeCloseDirty,"Function")?config.onBeforeCloseDirty(vm,closeModelFn):closeModelFn()}},{windowClass:"UserPermissionsPopup IMPORTANT"})},prepareServerData:function(uiAclData,includeInheritedRoles){var serverData=Utils.mergeValuedObjToDefaultValuedObj({},"AuthorizationAclDto");return serverData[DO.AuthorizationAclDto.name]=uiAclData.name,serverData[DO.AuthorizationAclDto.disable_inheritance]=!uiAclData.enable_inheritance,serverData[DO.AuthorizationAclDto.version]=uiAclData.version,ArrayUtils.each(uiAclData.usersGroupsList,function(it){var shouldAdd=!0,arrProp=_getArrayPropForRoleValue(it.roleValue);if(it.isInherited&&it.roleValue==it.inheritedRoleValue&&!includeInheritedRoles&&(shouldAdd=!1),shouldAdd)if(it.isGroup){var group=angular.copy(DO.GroupRef_Defaults);group[DO.GroupRef.name]=it.name,serverData[arrProp][DO.RoleDef.groups].push(group)}else{var user=angular.copy(DO.UserRef_Defaults);user[DO.UserRef.name]=it.name,serverData[arrProp][DO.RoleDef.users].push(user)}}),serverData},newUserGroup:function(name,isGroup){return{isInherited:!1,role:DO.AuthUserRoleType.VIEWER,roleValue:_getRoleValue(DO.AuthUserRoleType.VIEWER),name:name,isGroup:isGroup}},isUserAllowToDoAction:function(methodName,userRole){return null!=MethodsRequiredRoles[methodName]&&_getRoleValue(userRole)>=_getRoleValue(MethodsRequiredRoles[methodName].role)},isUserAllowToDoActionByMethodObject:function(method,userRole){return method&&method.role&&_getRoleValue(userRole)>=_getRoleValue(method.role)},onAddUserGroup:function(vm){var isSaml="SAML"===$window.qlikAuthenticationMethod,model={toAdd:{name:"",itemType:"USER"},validationOverride:{name:{required:!0,unique:!0,validusername:!0,maxlength:isSaml?255:104}},list:vm.acl.usersGroupsList,isSaml:isSaml},newItemModal=modalService.showModal({model:model,closeOnRoute:!0,contentTemplate:"scripts/angular.common/att_services/AclService/addUserGroup.html",headerText:locale.getString("common.acl.AddUserGroupPopupTitle"),minWidth:300,minHeight:300,resizable:!1,hasOk:!0},{windowClass:"AddUserGroupPopup"});newItemModal.then(function(modalVM){modalVM.toAdd.name=modalVM.toAdd.name.replace(/\s\s+/g," "),vm.acl.usersGroupsList.push(AclService.newUserGroup(modalVM.toAdd.name,"GROUP"==modalVM.toAdd.itemType)),AclService.onAclChange(vm)})},onRemoveUserGroup:function(vm){var item=vm.aclGridApi.selectedItems[0],itemType=locale.getString(item.isGroup?"common.acl.Group":"common.acl.User"),popupTitle=locale.getString("common.acl.RemoveUserGroup",[itemType]),popupBody=locale.getString("common.acl.AreYouSureYouWantToRemove",[itemType.toLowerCase()]),questionText=item.name,removeServerInstance=modalService.showConfirm({headerText:popupTitle,bodyText:popupBody,questionText:questionText,actionButtonText:locale.getString("common.base.Yes"),closeButtonText:locale.getString("common.base.No"),isActionButtonFocused:!1},{windowClass:"confirmDialogClass confirmRemoveAclUserGroup"});removeServerInstance.then(function(){ArrayUtils.each(vm.aclGridApi.selectedItems,function(it){var itemIndex=vm.acl.usersGroupsList.indexOf(it);-1!=itemIndex&&(vm.acl.usersGroupsList.splice(itemIndex,1),AclService.onAclChange(vm))})})},onRestoreUserGroup:function(vm){null!=vm.aclGridApi&&null!=vm.aclGridApi.info&&1==vm.aclGridApi.info.selectedItemsLength&&(vm.aclGridApi.selectedItems[0].isInherited=!0,vm.aclGridApi.selectedItems[0].role=vm.aclGridApi.selectedItems[0].inheritedRole,vm.aclGridApi.selectedItems[0].roleValue=vm.aclGridApi.selectedItems[0].inheritedRoleValue,AclService.onAclChange(vm))},isDeleteUserDisabled:function(vm){return null==vm.aclGridApi||null==vm.aclGridApi.info||1!=vm.aclGridApi.info.selectedItemsLength?!0:1==vm.aclGridApi.info.selectedItemsLength?vm.aclGridApi.selectedItems[0].isInherited||null!=vm.aclGridApi.selectedItems[0].inheritedRole||null!=vm.aclGridApi.selectedItems[0].inheritedRoleValue:void 0},isActionBarVisible:function(vm){return null==vm?!0:null==vm.aclServiceCtx.ShowAclActionBar?!0:vm.aclServiceCtx.ShowAclActionBar},isRestoreUserDisabled:function(vm){return null==vm.aclGridApi||null==vm.aclGridApi.info||1!=vm.aclGridApi.info.selectedItemsLength?!0:1==vm.aclGridApi.info.selectedItemsLength?vm.aclGridApi.selectedItems[0].isInherited||null==vm.aclGridApi.selectedItems[0].inheritedRole||null==vm.aclGridApi.selectedItems[0].inheritedRoleValue:void 0},isGetEffectivePermissionsDisabled:function(vm){return null==vm.userToCheck||0==vm.userToCheck.length},onDisableInheritance:function(vm){var model={userChoice:!0},disableInheritancePopup=modalService.showModal({model:model,closeOnRoute:!0,contentTemplate:"scripts/angular.common/att_services/AclService/disableInheritancePopup.html",headerText:locale.getString("common.acl.DisableInheritancePopupTitle"),actionButtonText:locale.getString("common.acl.disable"),resizable:!1,hasOk:!0},{windowClass:"DisableInheritancePopup"});disableInheritancePopup.then(function(modalVM){if(modalVM.userChoice)ArrayUtils.each(vm.acl.usersGroupsList,function(it){it.isInherited=!1,delete it.inheritedRole,delete it.inheritedRoleValue});else{var tempData=Utils.mergeValuedObjToDefaultValuedObj({},"AuthorizationGetAclResp");tempData.acl=AclService.prepareServerData(vm.acl,!1),vm.acl=AclService.prepareUIData(tempData)}vm.acl.enable_inheritance=!1,AclService.onAclChange(vm)})},onEnableInheritance:function(vm){var model={userChoice:!0},enableInheritancePopup=modalService.showModal({model:model,closeOnRoute:!0,contentTemplate:"scripts/angular.common/att_services/AclService/enableInheritancePopup.html",headerText:locale.getString("common.acl.EnableInheritancePopupTitle"),actionButtonText:locale.getString("common.acl.enable"),resizable:!1,hasOk:!0},{windowClass:"EnableInheritancePopup"});enableInheritancePopup.then(function(modalVM){vm.aclServiceCtx.GetAcl.params.based_on_parent=!0,AclService.GetAcl(vm.aclServiceCtx,function(data){var tempAclUiData=AclService.prepareUIData(data),usersGroupsDicLC={};if(ObjectUtils.forOwn(tempAclUiData.usersGroupsDic,function(key,val){usersGroupsDicLC[key.toLowerCase()]=val}),modalVM.userChoice)ArrayUtils.each(vm.acl.usersGroupsList,function(it){usersGroupsDicLC.hasOwnProperty(it.name.toLowerCase())||(tempAclUiData.usersGroupsList.push(it),tempAclUiData.usersGroupsDic[it.name]=it)}),vm.acl.usersGroupsList=tempAclUiData.usersGroupsList,vm.acl.usersGroupsDic=tempAclUiData.usersGroupsDic;else{var foundOnList={};ArrayUtils.each(vm.acl.usersGroupsList,function(it){var lcName=it.name.toLowerCase();usersGroupsDicLC.hasOwnProperty(lcName)&&(it.inheritedRole=usersGroupsDicLC[lcName].inheritedRole,it.inheritedRoleValue=usersGroupsDicLC[lcName].inheritedRoleValue,foundOnList[lcName]=!0)}),ObjectUtils.forOwn(tempAclUiData.usersGroupsDic,function(key,val){val.isInherited&&!foundOnList[key.toLowerCase()]&&vm.acl.usersGroupsList.push(val)}),foundOnList=null}vm.acl.enable_inheritance=!0,AclService.onAclChange(vm)}),vm.aclServiceCtx.GetAcl.params.based_on_parent=!1})},getAclAndPrepareUI:function(vm,onSuccess){AclService.GetAcl(vm.aclServiceCtx,function(data){vm.acl=AclService.prepareUIData(data),vm.errorState=!1,vm.isDirty=!1,_lastCleanVmAcl=ObjectUtils.deepClone(vm.acl),onSuccess&&onSuccess()},function(){return console.log(arguments),vm.errorState=!0,!0})},onAclChange:function(vm,rowData){(vm.isDirty||!vm.isDirty&&!angular.equals(vm.acl,_lastCleanVmAcl))&&(vm.isDirty=!0,ObjectUtils.isKind(vm.onChange,"Function")&&vm.onChange(rowData))},isRoleAtLeast:function(roleToCheck,minimumRole){return _getRoleValue(roleToCheck)>=_getRoleValue(minimumRole)},isRoleAtMax:function(roleToCheck,maxRole){return _getRoleValue(roleToCheck)<=_getRoleValue(maxRole)}},_lastCleanVmAcl=null;return AclService}]),aclService.controller("AclCtrl",["$scope","AclService","modalService","locale",function($scope,AclService,modalService,locale){function initAclCtrl(){_disabledRestoreBtnTooltip=locale.getString("common.acl.DisabledRestoreBtnTooltip"),_disabledDeleteBtnTooltip=locale.getString("common.acl.DisabledDeleteBtnTooltip")}$scope.show_effective_permissions=!1,void 0===$scope.vm.acl&&AclService.getAclAndPrepareUI($scope.vm);var _disabledDeleteBtnTooltip="",_disabledRestoreBtnTooltip="",_discardChanges=function(){AclService.getAclAndPrepareUI($scope.vm,function(){$scope.vm.isDirty=!1,setTimeout(function(){if($scope.vm.aclGridApi.selectedItems&&$scope.vm.aclGridApi.selectedItems.length){var selectedName=$scope.vm.aclGridApi.selectedItems[0].name;$scope.vm.aclGridApi.selectAndGoToItem({name:selectedName})}})})};$scope.isGetEffectivePermissionsDisabled=function(){return AclService.isGetEffectivePermissionsDisabled($scope.vm)},$scope.isActionBarVisible=function(){return AclService.isActionBarVisible($scope.vm)},$scope.onAddUserGroup=function(){AclService.onAddUserGroup($scope.vm)},$scope.onRemoveUserGroup=function(){AclService.onRemoveUserGroup($scope.vm)},$scope.onRestoreUserGroup=function(){AclService.onRestoreUserGroup($scope.vm)},$scope.isDeleteDisabled=function(){var isDeleteBtnDisabled=AclService.isDeleteUserDisabled($scope.vm);return $scope.disabledDeleteBtnTooltip=isDeleteBtnDisabled?_disabledDeleteBtnTooltip:"",isDeleteBtnDisabled},$scope.isRestoreDisabled=function(){var isRestoreDisabled=AclService.isRestoreUserDisabled($scope.vm);return $scope.disabledRestoreBtnTooltip=isRestoreDisabled?_disabledRestoreBtnTooltip:"",isRestoreDisabled},$scope.onEnableInheritance=function(){AclService.onEnableInheritance($scope.vm)},$scope.onDisableInheritance=function(){AclService.onDisableInheritance($scope.vm)},$scope.onSave=function(){AclService.PutAclFromViewModel($scope.vm)},$scope.onDiscard=function(){var confirmInstance=modalService.showConfirm({headerText:locale.getString("common.base.DiscardChangesConfirmationTitle"),questionText:locale.getString("common.base.DiscardChangesConfirmationMessage"),msgType:modalService.modalConfirmationType.Warning});confirmInstance.then(function(){_discardChanges&&_discardChanges()})},$scope.isSaveDiscardDisabled=function(){return!$scope.vm.isDirty},initAclCtrl()}]),aclService.controller("AclGridCtrl",["$scope","AclService","modalService","locale",function($scope,AclService,modalService,locale){function initAclGridCtrl(){$scope.isGridEnabled=AclService.isUserAllowToDoAction($scope.vm.aclServiceCtx.PutAcl.method,$scope.vm.aclServiceCtx.callerRole),$scope.gridId=$scope.vm.aclServiceCtx.PutAcl.method}$scope.GetEffectedStarted=!1,$scope.isGridEnabled=!1,$scope.gridConfigattGridConfig={},$scope.gridConfigattGridConfig.headerCtxMenuActions={sorting:!0,freezeColumn:!1,quickColumnSelection:!1,exportToCSV:!1,exportToHTML:!1,columnSettings:!1,hideColumn:!1,valuesFilter:!1},$scope.isSaml="SAML"===window.qlikAuthenticationMethod,$scope.slider={options:{stop:function(event,ui){$scope.$evalAsync(function(){var rowData=angular.element(ui.handle).scope().rowData;rowData.isInherited&&rowData.roleValue!=rowData.inheritedRoleValue&&(rowData.isInherited=!1),AclService.onAclChange($scope.vm,rowData)})}}};var _updateUserToCheckFromGrid=function(rowData){var _userToCheckName="",_effectivePermissionsResult="";null==rowData||rowData.isGroup||(_userToCheckName=rowData.name),$scope.vm.userToCheck!=_userToCheckName&&($scope.vm.userToCheck=_userToCheckName,$scope.vm.effectivePermissionsResult!=_effectivePermissionsResult&&($scope.vm.effectivePermissionsResult=_effectivePermissionsResult))};$scope.vm.aclGridApi={onRowClick:function(rowData){_updateUserToCheckFromGrid(rowData)},onSelectionChanged:function(selection){return selection&&selection.length<0?void _updateUserToCheckFromGrid(null):void _updateUserToCheckFromGrid(selection[0])},rowContextMenu:function(event,rowData){var contextMenuItems=[],itemId=0;return $scope.vm.aclGridApi.selectAndGoToItem({name:rowData.name}),AclService.isUserAllowToDoAction($scope.vm.aclServiceCtx.PutAcl.method,$scope.vm.aclServiceCtx.callerRole)&&(contextMenuItems.push({id:++itemId,name:locale.getString("common.acl.ActionBar.RemoveGroup_Text_Dots"),disabled:$scope.isDeleteDisabled(),clickFunc:function(){$scope.onRemoveUserGroup()}}),$scope.vm.acl.isRootAcl||contextMenuItems.push({id:++itemId,name:locale.getString("common.acl.ActionBar.Restore_Text"),disabled:$scope.isRestoreDisabled(),clickFunc:function(){$scope.onRestoreUserGroup()}})),contextMenuItems}},$scope.permissionGroupsArray=["None","Viewer","Operator","Designer","Admin"],$scope.onGetEffectivePermissions=function(){$scope.vm.effectivePermissionsResult="";try{$scope.GetEffectedStarted=!0;var aclReq=Utils.mergeValuedObjToDefaultValuedObj({},"AuthorizationGetEffectiveRoleReq");aclReq[DO.AuthorizationGetEffectiveRoleReq.user_name]=$scope.vm.userToCheck,aclReq[DO.AuthorizationGetEffectiveRoleReq.acl]=AclService.prepareServerData($scope.vm.acl,!1),AclService.GetEffectivePermissions($scope.vm.aclServiceCtx,aclReq,function(data){$scope.vm.effectivePermissionsResult=data.role,$scope.GetEffectedStarted=!1},function(){return $scope.GetEffectedStarted=!1,!0})}catch(err){$scope.GetEffectedStarted=!1}},$scope.userToCheckChanged=function(){$scope.vm.effectivePermissionsResult=""},$scope.effectivePermissionsOnKeyDown=function(event){event.keyCode==consts.ConstKey.Enter&&0!=$scope.vm.userToCheck.length&&(event.preventDefault(),event.stopPropagation(),$scope.onGetEffectivePermissions())},initAclGridCtrl()}]),aclService.directive("attSliderOverride",function(){return{restrict:"A",link:function(scope,element,attrs){{var max=parseInt(attrs.max),min=parseInt(attrs.min);parseInt(attrs.step)}null!=attrs.overrideVal&&scope.$watch(attrs.overrideVal,function(overrideVal){if(element.find(".override").remove(),null!=overrideVal){var left=overrideVal/(max-min)*100;element.find(".override").remove(),element.prepend('<span class="ui-slider-handle override ui-state-default ui-corner-all" tabindex="0" style="left: '+left+'%;"></span>')}else element.find(".override").remove()})}}}),aclService.directive("authorizedAction",["MethodsRequiredRoles","AclService",function(MethodsRequiredRoles,AclService){function handleMethodUrl(paramsObj,OrginalUrl){if(null==paramsObj)return OrginalUrl;var nullStrings=[],url=OrginalUrl;ObjectUtils.forOwn(paramsObj,function(key,val){null==val&&nullStrings.push("{"+key+"}")});for(var i=0;i<nullStrings.length;i++){var ind0=url.indexOf(nullStrings[i]);-1!=ind0&&(url=url.substr(0,ind0-1))}return ObjectUtils.forOwn(paramsObj,function(key,val){null!=val&&(url=url.replace("{"+key+"}",val))}),url}function onReject(element,policy){"EnableDisable"==policy?(element.addClass("disabled"),element.addClass("AclDisabled"),element.prop("disabled",!0),setTimeout(function(){element.find("input, textarea").attr("tabindex",-1)})):element.hide()}function onAccept(element,policy){"EnableDisable"==policy?(element.removeClass("disabled"),element.removeClass("AclDisabled"),element.prop("disabled",!1),element.find("input, textarea").removeAttr("tabindex")):element.show()}return{restrict:"A",scope:!1,link:function(scope,element,attrs){var methodName=attrs.authorizedAction,policy=attrs.policy;if(null!=MethodsRequiredRoles[methodName])if(null!=attrs.callerRole)attrs.$observe("callerRole",function(newVal){null!=newVal&&(_getRoleValue(MethodsRequiredRoles[methodName].role)<=_getRoleValue(newVal)?onAccept(element,policy):onReject(element,policy))});else if(null!=attrs.url){var paramsObj=null;if(null!=attrs.paramsObj)try{paramsObj=scope.$eval(attrs.paramsObj)}catch(e){paramsObj=null}var url=handleMethodUrl(paramsObj,attrs.url);null!=url&&AclService.GetUrlAuthorization(url,function(resp){_getRoleValue(MethodsRequiredRoles[methodName].role)>_getRoleValue(resp.role)?onReject(element,policy):onAccept(element,policy)},function(){onReject(element,policy)})}}}}]),aclService.directive("aclUserPermissionsView",["AclService",function(AclService){return{restrict:"E",scope:{viewModel:"="},templateUrl:"scripts/angular.common/att_services/AclService/userPermissions.html",link:{pre:function(scope){scope.vm=scope.vm||{},scope.vm=scope.viewModel,scope.vm.config=scope.vm.config||AclService.GetDefaultPermissionsViewConfig()}}}}])}(angular);