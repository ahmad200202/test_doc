angular.module("ui.bootstrap.modal",["ui.bootstrap.multiMap","ui.bootstrap.stackedMap","ui.bootstrap.position"]).provider("$uibResolve",function(){var resolve=this;this.resolver=null,this.setResolver=function(resolver){this.resolver=resolver},this.$get=["$injector","$q",function($injector,$q){var resolver=resolve.resolver?$injector.get(resolve.resolver):null;return{resolve:function(invocables,locals,parent,self){if(resolver)return resolver.resolve(invocables,locals,parent,self);var promises=[];return angular.forEach(invocables,function(value){promises.push(angular.isFunction(value)||angular.isArray(value)?$q.resolve($injector.invoke(value)):angular.isString(value)?$q.resolve($injector.get(value)):$q.resolve(value))}),$q.all(promises).then(function(resolves){var resolveObj={},resolveIter=0;return angular.forEach(invocables,function(value,key){resolveObj[key]=resolves[resolveIter++]}),resolveObj})}}}]}).directive("uibModalBackdrop",["$animate","$injector","$uibModalStack",function($animate,$injector,$modalStack){function linkFn(scope,element,attrs){attrs.modalInClass&&($animate.addClass(element,attrs.modalInClass),scope.$on($modalStack.NOW_CLOSING_EVENT,function(e,setIsAsync){var done=setIsAsync();scope.modalOptions.animation?$animate.removeClass(element,attrs.modalInClass).then(done):done()}))}return{restrict:"A",compile:function(tElement,tAttrs){return tElement.addClass(tAttrs.backdropClass),linkFn}}}]).directive("uibModalWindow",["$uibModalStack","$q","$animateCss","$document",function($modalStack,$q,$animateCss,$document){return{scope:{index:"@"},restrict:"A",transclude:!0,templateUrl:function(tElement,tAttrs){return tAttrs.templateUrl||"uib/template/modal/window.html"},link:function(scope,element,attrs){element.addClass(attrs.windowTopClass||""),scope.size=attrs.size,scope.close=function(evt){var modal=$modalStack.getTop();modal&&modal.value.backdrop&&"static"!==modal.value.backdrop&&evt.target===evt.currentTarget&&(evt.preventDefault(),evt.stopPropagation(),$modalStack.dismiss(modal.key,"backdrop click"))},element.on("click",scope.close),scope.$isRendered=!0;var modalRenderDeferObj=$q.defer();scope.$$postDigest(function(){modalRenderDeferObj.resolve()}),modalRenderDeferObj.promise.then(function(){var animationPromise=null;attrs.modalInClass&&(animationPromise=$animateCss(element,{addClass:attrs.modalInClass}).start(),scope.$on($modalStack.NOW_CLOSING_EVENT,function(e,setIsAsync){var done=setIsAsync();$animateCss(element,{removeClass:attrs.modalInClass}).start().then(done)})),$q.when(animationPromise).then(function(){var modal=$modalStack.getTop();if(modal&&$modalStack.modalRendered(modal.key),!$document[0].activeElement||!element[0].contains($document[0].activeElement)){var inputWithAutofocus=element[0].querySelector("[autofocus]");inputWithAutofocus?inputWithAutofocus.focus():element[0].focus()}})})}}}]).directive("uibModalAnimationClass",function(){return{compile:function(tElement,tAttrs){tAttrs.modalAnimation&&tElement.addClass(tAttrs.uibModalAnimationClass)}}}).directive("uibModalTransclude",["$animate",function($animate){return{link:function(scope,element,attrs,controller,transclude){transclude(scope.$parent,function(clone){element.empty(),$animate.enter(clone,element)})}}}]).factory("$uibModalStack",["$animate","$animateCss","$document","$compile","$rootScope","$q","$$multiMap","$$stackedMap","$uibPosition",function($animate,$animateCss,$document,$compile,$rootScope,$q,$$multiMap,$$stackedMap,$uibPosition){function snake_case(name){var separator="-";return name.replace(SNAKE_CASE_REGEXP,function(letter,pos){return(pos?separator:"")+letter.toLowerCase()})}function isVisible(element){return!!(element.offsetWidth||element.offsetHeight||element.getClientRects().length)}function backdropIndex(){for(var topBackdropIndex=-1,opened=openedWindows.keys(),i=0;i<opened.length;i++)openedWindows.get(opened[i]).value.backdrop&&(topBackdropIndex=i);return topBackdropIndex>-1&&topModalIndex>topBackdropIndex&&(topBackdropIndex=topModalIndex),topBackdropIndex}function removeModalWindow(modalInstance,elementToReceiveFocus){var modalWindow=openedWindows.get(modalInstance).value,appendToElement=modalWindow.appendTo;openedWindows.remove(modalInstance),previousTopOpenedModal=openedWindows.top(),previousTopOpenedModal&&(topModalIndex=parseInt(previousTopOpenedModal.value.modalDomEl.attr("index"),10)),removeAfterAnimate(modalWindow.modalDomEl,modalWindow.modalScope,function(){var modalBodyClass=modalWindow.openedClass||OPENED_MODAL_CLASS;openedClasses.remove(modalBodyClass,modalInstance);var areAnyOpen=openedClasses.hasKey(modalBodyClass);appendToElement.toggleClass(modalBodyClass,areAnyOpen),!areAnyOpen&&scrollbarPadding&&scrollbarPadding.heightOverflow&&scrollbarPadding.scrollbarWidth&&(appendToElement.css(scrollbarPadding.originalRight?{paddingRight:scrollbarPadding.originalRight+"px"}:{paddingRight:""}),scrollbarPadding=null),toggleTopWindowClass(!0)},modalWindow.closedDeferred),checkRemoveBackdrop(),elementToReceiveFocus&&elementToReceiveFocus.focus?elementToReceiveFocus.focus():appendToElement.focus&&appendToElement.focus()}function toggleTopWindowClass(toggleSwitch){var modalWindow;openedWindows.length()>0&&(modalWindow=openedWindows.top().value,modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass||"",toggleSwitch))}function checkRemoveBackdrop(){if(backdropDomEl&&-1===backdropIndex()){var backdropScopeRef=backdropScope;removeAfterAnimate(backdropDomEl,backdropScope,function(){backdropScopeRef=null}),backdropDomEl=void 0,backdropScope=void 0}}function removeAfterAnimate(domEl,scope,done,closedDeferred){function afterAnimating(){afterAnimating.done||(afterAnimating.done=!0,$animate.leave(domEl).then(function(){done&&done(),domEl.remove(),closedDeferred&&closedDeferred.resolve()}),scope.$destroy())}var asyncDeferred,asyncPromise=null,setIsAsync=function(){return asyncDeferred||(asyncDeferred=$q.defer(),asyncPromise=asyncDeferred.promise),function(){asyncDeferred.resolve()}};return scope.$broadcast($modalStack.NOW_CLOSING_EVENT,setIsAsync),$q.when(asyncPromise).then(afterAnimating)}function keydownListener(evt){if(evt.isDefaultPrevented())return evt;var modal=openedWindows.top();if(modal)switch(evt.which){case 27:modal.value.keyboard&&(evt.preventDefault(),$rootScope.$apply(function(){$modalStack.dismiss(modal.key,"escape key press")}));break;case 9:var list=$modalStack.loadFocusElementList(modal),focusChanged=!1;evt.shiftKey?($modalStack.isFocusInFirstItem(evt,list)||$modalStack.isModalFocused(evt,modal))&&(focusChanged=$modalStack.focusLastFocusableElement(list)):$modalStack.isFocusInLastItem(evt,list)&&(focusChanged=$modalStack.focusFirstFocusableElement(list)),focusChanged&&(evt.preventDefault(),evt.stopPropagation())}}function broadcastClosing(modalWindow,resultOrReason,closing){return!modalWindow.value.modalScope.$broadcast("modal.closing",resultOrReason,closing).defaultPrevented}function unhideBackgroundElements(){Array.prototype.forEach.call(document.querySelectorAll("["+ARIA_HIDDEN_ATTRIBUTE_NAME+"]"),function(hiddenEl){var ariaHiddenCount=parseInt(hiddenEl.getAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME),10),newHiddenCount=ariaHiddenCount-1;hiddenEl.setAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME,newHiddenCount),newHiddenCount||(hiddenEl.removeAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME),hiddenEl.removeAttribute("aria-hidden"))})}var backdropDomEl,backdropScope,scrollbarPadding,OPENED_MODAL_CLASS="modal-open",openedWindows=$$stackedMap.createNew(),openedClasses=$$multiMap.createNew(),$modalStack={NOW_CLOSING_EVENT:"modal.stack.now-closing"},topModalIndex=0,previousTopOpenedModal=null,ARIA_HIDDEN_ATTRIBUTE_NAME="data-bootstrap-modal-aria-hidden-count",tabbableSelector="a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]",SNAKE_CASE_REGEXP=/[A-Z]/g;return $rootScope.$watch(backdropIndex,function(newBackdropIndex){backdropScope&&(backdropScope.index=newBackdropIndex)}),$document.on("keydown",keydownListener),$rootScope.$on("$destroy",function(){$document.off("keydown",keydownListener)}),$modalStack.open=function(modalInstance,modal){function applyAriaHidden(el){function getSiblings(el){var children=el.parent()?el.parent().children():[];return Array.prototype.filter.call(children,function(child){return child!==el[0]})}if(el&&"BODY"!==el[0].tagName)return getSiblings(el).forEach(function(sibling){var elemIsAlreadyHidden="true"===sibling.getAttribute("aria-hidden"),ariaHiddenCount=parseInt(sibling.getAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME),10);ariaHiddenCount||(ariaHiddenCount=elemIsAlreadyHidden?1:0),sibling.setAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME,ariaHiddenCount+1),sibling.setAttribute("aria-hidden","true")}),applyAriaHidden(el.parent())}var modalOpener=$document[0].activeElement,modalBodyClass=modal.openedClass||OPENED_MODAL_CLASS;toggleTopWindowClass(!1),previousTopOpenedModal=openedWindows.top(),openedWindows.add(modalInstance,{deferred:modal.deferred,renderDeferred:modal.renderDeferred,closedDeferred:modal.closedDeferred,modalScope:modal.scope,backdrop:modal.backdrop,keyboard:modal.keyboard,openedClass:modal.openedClass,windowTopClass:modal.windowTopClass,animation:modal.animation,appendTo:modal.appendTo}),openedClasses.put(modalBodyClass,modalInstance);var appendToElement=modal.appendTo,currBackdropIndex=backdropIndex();currBackdropIndex>=0&&!backdropDomEl&&(backdropScope=$rootScope.$new(!0),backdropScope.modalOptions=modal,backdropScope.index=currBackdropIndex,backdropDomEl=angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'),backdropDomEl.attr({"class":"modal-backdrop","ng-style":"{'z-index': 1040 + (index && 1 || 0) + index*10}","uib-modal-animation-class":"fade","modal-in-class":"in"}),modal.backdropClass&&backdropDomEl.addClass(modal.backdropClass),modal.animation&&backdropDomEl.attr("modal-animation","true"),$compile(backdropDomEl)(backdropScope),$animate.enter(backdropDomEl,appendToElement),$uibPosition.isScrollable(appendToElement)&&(scrollbarPadding=$uibPosition.scrollbarPadding(appendToElement),scrollbarPadding.heightOverflow&&scrollbarPadding.scrollbarWidth&&appendToElement.css({paddingRight:scrollbarPadding.right+"px"})));var content;modal.component?(content=document.createElement(snake_case(modal.component.name)),content=angular.element(content),content.attr({resolve:"$resolve","modal-instance":"$uibModalInstance",close:"$close($value)",dismiss:"$dismiss($value)"})):content=modal.content,topModalIndex=previousTopOpenedModal?parseInt(previousTopOpenedModal.value.modalDomEl.attr("index"),10)+1:0;var angularDomEl=angular.element('<div uib-modal-window="modal-window"></div>');angularDomEl.attr({"class":"modal","template-url":modal.windowTemplateUrl,"window-top-class":modal.windowTopClass,role:"dialog","aria-labelledby":modal.ariaLabelledBy,"aria-describedby":modal.ariaDescribedBy,size:modal.size,index:topModalIndex,animate:"animate","ng-style":"{'z-index': 1050 + $$topModalIndex*10, display: 'block'}",tabindex:-1,"uib-modal-animation-class":"fade","modal-in-class":"in"}).append(content),modal.windowClass&&angularDomEl.addClass(modal.windowClass),modal.animation&&angularDomEl.attr("modal-animation","true"),appendToElement.addClass(modalBodyClass),modal.scope&&(modal.scope.$$topModalIndex=topModalIndex),$animate.enter($compile(angularDomEl)(modal.scope),appendToElement),openedWindows.top().value.modalDomEl=angularDomEl,openedWindows.top().value.modalOpener=modalOpener,applyAriaHidden(angularDomEl)},$modalStack.close=function(modalInstance,result){var modalWindow=openedWindows.get(modalInstance);return unhideBackgroundElements(),modalWindow&&broadcastClosing(modalWindow,result,!0)?(modalWindow.value.modalScope.$$uibDestructionScheduled=!0,modalWindow.value.deferred.resolve(result),removeModalWindow(modalInstance,modalWindow.value.modalOpener),!0):!modalWindow},$modalStack.dismiss=function(modalInstance,reason){var modalWindow=openedWindows.get(modalInstance);return unhideBackgroundElements(),modalWindow&&broadcastClosing(modalWindow,reason,!1)?(modalWindow.value.modalScope.$$uibDestructionScheduled=!0,modalWindow.value.deferred.reject(reason),removeModalWindow(modalInstance,modalWindow.value.modalOpener),!0):!modalWindow},$modalStack.dismissAll=function(reason){for(var topModal=this.getTop();topModal&&this.dismiss(topModal.key,reason);)topModal=this.getTop()},$modalStack.getTop=function(){return openedWindows.top()},$modalStack.modalRendered=function(modalInstance){var modalWindow=openedWindows.get(modalInstance);modalWindow&&modalWindow.value.renderDeferred.resolve()},$modalStack.focusFirstFocusableElement=function(list){return list.length>0?(list[0].focus(),!0):!1},$modalStack.focusLastFocusableElement=function(list){return list.length>0?(list[list.length-1].focus(),!0):!1},$modalStack.isModalFocused=function(evt,modalWindow){if(evt&&modalWindow){var modalDomEl=modalWindow.value.modalDomEl;if(modalDomEl&&modalDomEl.length)return(evt.target||evt.srcElement)===modalDomEl[0]}return!1},$modalStack.isFocusInFirstItem=function(evt,list){return list.length>0?(evt.target||evt.srcElement)===list[0]:!1},$modalStack.isFocusInLastItem=function(evt,list){return list.length>0?(evt.target||evt.srcElement)===list[list.length-1]:!1},$modalStack.loadFocusElementList=function(modalWindow){if(modalWindow){var modalDomE1=modalWindow.value.modalDomEl;if(modalDomE1&&modalDomE1.length){var elements=modalDomE1[0].querySelectorAll(tabbableSelector);return elements?Array.prototype.filter.call(elements,function(element){return isVisible(element)}):elements}}},$modalStack}]).provider("$uibModal",function(){var $modalProvider={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$rootScope","$q","$document","$templateRequest","$controller","$uibResolve","$uibModalStack",function($rootScope,$q,$document,$templateRequest,$controller,$uibResolve,$modalStack){function getTemplatePromise(options){return options.template?$q.when(options.template):$templateRequest(angular.isFunction(options.templateUrl)?options.templateUrl():options.templateUrl)}var $modal={},promiseChain=null;return $modal.getPromiseChain=function(){return promiseChain},$modal.open=function(modalOptions){function resolveWithTemplate(){return templateAndResolvePromise}var modalResultDeferred=$q.defer(),modalOpenedDeferred=$q.defer(),modalClosedDeferred=$q.defer(),modalRenderDeferred=$q.defer(),modalInstance={result:modalResultDeferred.promise,opened:modalOpenedDeferred.promise,closed:modalClosedDeferred.promise,rendered:modalRenderDeferred.promise,close:function(result){return $modalStack.close(modalInstance,result)},dismiss:function(reason){return $modalStack.dismiss(modalInstance,reason)}};if(modalOptions=angular.extend({},$modalProvider.options,modalOptions),modalOptions.resolve=modalOptions.resolve||{},modalOptions.appendTo=modalOptions.appendTo||$document.find("body").eq(0),!modalOptions.appendTo.length)throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");if(!modalOptions.component&&!modalOptions.template&&!modalOptions.templateUrl)throw new Error("One of component or template or templateUrl options is required.");var templateAndResolvePromise;templateAndResolvePromise=modalOptions.component?$q.when($uibResolve.resolve(modalOptions.resolve,{},null,null)):$q.all([getTemplatePromise(modalOptions),$uibResolve.resolve(modalOptions.resolve,{},null,null)]);var samePromise;return samePromise=promiseChain=$q.all([promiseChain]).then(resolveWithTemplate,resolveWithTemplate).then(function(tplAndVars){function constructLocals(obj,template,instanceOnScope,injectable){obj.$scope=modalScope,obj.$scope.$resolve={},instanceOnScope?obj.$scope.$uibModalInstance=modalInstance:obj.$uibModalInstance=modalInstance;var resolves=template?tplAndVars[1]:tplAndVars;angular.forEach(resolves,function(value,key){injectable&&(obj[key]=value),obj.$scope.$resolve[key]=value})}var providedScope=modalOptions.scope||$rootScope,modalScope=providedScope.$new();modalScope.$close=modalInstance.close,modalScope.$dismiss=modalInstance.dismiss,modalScope.$on("$destroy",function(){modalScope.$$uibDestructionScheduled||modalScope.$dismiss("$uibUnscheduledDestruction")});var ctrlInstance,ctrlInstantiate,modal={scope:modalScope,deferred:modalResultDeferred,renderDeferred:modalRenderDeferred,closedDeferred:modalClosedDeferred,animation:modalOptions.animation,backdrop:modalOptions.backdrop,keyboard:modalOptions.keyboard,backdropClass:modalOptions.backdropClass,windowTopClass:modalOptions.windowTopClass,windowClass:modalOptions.windowClass,windowTemplateUrl:modalOptions.windowTemplateUrl,ariaLabelledBy:modalOptions.ariaLabelledBy,ariaDescribedBy:modalOptions.ariaDescribedBy,size:modalOptions.size,openedClass:modalOptions.openedClass,appendTo:modalOptions.appendTo},component={},ctrlLocals={};modalOptions.component?(constructLocals(component,!1,!0,!1),component.name=modalOptions.component,modal.component=component):modalOptions.controller&&(constructLocals(ctrlLocals,!0,!1,!0),ctrlInstantiate=$controller(modalOptions.controller,ctrlLocals,!0,modalOptions.controllerAs),modalOptions.controllerAs&&modalOptions.bindToController&&(ctrlInstance=ctrlInstantiate.instance,ctrlInstance.$close=modalScope.$close,ctrlInstance.$dismiss=modalScope.$dismiss,angular.extend(ctrlInstance,{$resolve:ctrlLocals.$scope.$resolve},providedScope)),ctrlInstance=ctrlInstantiate(),angular.isFunction(ctrlInstance.$onInit)&&ctrlInstance.$onInit()),modalOptions.component||(modal.content=tplAndVars[0]),$modalStack.open(modalInstance,modal),modalOpenedDeferred.resolve(!0)},function(reason){modalOpenedDeferred.reject(reason),modalResultDeferred.reject(reason)})["finally"](function(){promiseChain===samePromise&&(promiseChain=null)}),modalInstance},$modal}]};return $modalProvider});