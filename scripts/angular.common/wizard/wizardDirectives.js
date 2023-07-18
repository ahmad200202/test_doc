!function(angular){"use strict";function wizardButtons(action,functionName){module.directive("wizard"+action,function(){return{restrict:"A",replace:!1,require:"^wizard",link:function($scope,$element,$attrs,wizardCtrl){wizardCtrl[functionName]&&$element.on("click",function(){wizardCtrl[functionName]()}),$scope["has"+action]=wizardCtrl["has"+action]}}})}var module=angular.module("attWizard",["attWizardTemplates"]);angular.module("attWizardTemplates",["template/wizardTpl.html","template/wizardNavTpl.html"]),module.directive("wizard",function(){return{restrict:"E",templateUrl:function(elem,attrs){var templateUrl="partials/wizard/wizardTpl.html";return null!=attrs.template&&(templateUrl=attrs.template),templateUrl},replace:!0,transclude:!0,scope:!0,controller:["$scope","$attrs","$parse",function($scope,$attrs){$scope.currentStep=0,$scope.steps=[],$scope.titles=[],$scope.goTo=function(index){if($scope.steps[$scope.currentStep].post&&index>0&&$scope.steps[$scope.currentStep].post(),$scope.steps[$scope.currentStep].validate&&index>0){var valid=$scope.steps[$scope.currentStep].validate();if(valid===!1&&$scope.currentStep<index)return}var element=$attrs.$$element,step=element.find(".StepHolder").parents("step");if("true"!=step.attr("render-with-if"))for(var children=element.find(".StepHolder").children(),i=0;i<children.length;i++){var chiSc=null,angularEl=angular.element(children[i]);angularEl.scope&&(chiSc=angularEl.scope()),chiSc&&chiSc.$destroy&&chiSc.$destroy()}index<$scope.steps.length&&($scope.steps[index].pre&&$scope.steps[index].pre(),angular.forEach($scope.steps,function(step){step.isCurrentStep=!1}),$scope.currentStep=index,$scope.steps[index].isCurrentStep=!0)},this.isCurrentStep=function(step){return $scope.steps.indexOf(step)==$scope.currentStep},this.goTo=function(index){$scope.goTo(index)},this.next=function(){var nextIndex=$scope.currentStep+1;$scope.steps[$scope.currentStep].getNextStep&&(nextIndex=$scope.steps[$scope.currentStep].getNextStep(),nextIndex=null==nextIndex?$scope.currentStep+1:nextIndex),$scope.goTo(nextIndex)},this.previous=function(){var prevIndex=$scope.currentStep-1;$scope.steps[$scope.currentStep].getPrevStep&&(prevIndex=$scope.steps[$scope.currentStep].getPrevStep(),prevIndex=null==prevIndex?$scope.currentStep-1:prevIndex),$scope.goTo(prevIndex)},this.finish=function(){$scope.$apply($attrs.finishCallback)},this.hasNext=function(){var isLastStep=$scope.currentStep==$scope.steps.length-1;if(1==isLastStep)return!0;if($scope.steps[$scope.currentStep].validate){var valid=$scope.steps[$scope.currentStep].validate();if(valid===!1)return!0}return $scope.currentStep<=$scope.steps.length-1?!1:!0},this.hasPrevious=function(){return $scope.currentStep>0?!1:!0},this.hasFinish=function(){var isLastStep=$scope.currentStep==$scope.steps.length-1,stepEnableFinish=$scope.steps[$scope.currentStep].enableFinish;if($scope.steps[$scope.currentStep].validate){var valid=$scope.steps[$scope.currentStep].validate();if(valid===!1)return!0}return 1==isLastStep||1==stepEnableFinish?!1:!0},this.addStep=function(step){var found_step=$scope.steps.filter(function(stp){return stp.stepTitle==step.stepTitle});null!=found_step&&0==found_step.length&&$scope.steps.push(step),1==$scope.steps.length&&$scope.goTo(0)},this.removeStep=function(step_title){var found_step=$scope.steps.filter(function(stp){return stp.stepTitle==step_title});null!=found_step&&found_step.length>0&&$scope.steps.splice($scope.steps.indexOf(found_step[0]),1)}}],link:function(){}}}),module.directive("step",function(){return{restrict:"E",template:function(elem,attrs){var template='<div class="step-content" ng-style="currentStepStyle()"><div ng-show="isCurrentStep" ng-transclude ng-style="currentStepStyle()"></div></div>';return"true"==attrs.renderWithIf&&(template='<div class="step-content" ng-style="currentStepStyle()"><div ng-if="isCurrentStep" ng-transclude class="StepHolder" ng-style="currentStepStyle()"></div></div>'),template},replace:!0,transclude:!0,scope:{pre:"&",post:"&",validate:"&",getNextStep:"&",getPrevStep:"&",stepTitle:"@",stepDisabled:"=?",stepSubTitle:"@",stepSubtitleNote:"@",stepSubtitleAfternote:"@",stepVisible:"=?",enableFinish:"=?"},require:"^wizard",link:function($scope,$element,$attrs,wizardCtrl){(void 0==$scope.stepVisible||null==$scope.stepVisible)&&($scope.stepVisible=!0),void 0!==$attrs.stepDisabled?$scope.$watch("stepDisabled",function(val){$scope.stepDisabled=val}):$scope.stepDisabled=!1,$scope.$on("$destroy",function(){wizardCtrl.removeStep($scope.stepTitle)}),1==$scope.stepVisible&&wizardCtrl.addStep($scope),$scope.isCurrentStep=wizardCtrl.isCurrentStep($scope),$scope.currentStepStyle=function(){var style={};return style=$scope.isCurrentStep?{height:"100%"}:{height:"0"}}}}}),module.directive("wizardNav",function(){return{restrict:"E",replace:!1,templateUrl:function(elem,attrs){var templateUrl="partials/wizard/wizardNavTpl.html";return null!=attrs.template&&(templateUrl=attrs.template),templateUrl},link:function($scope,$element,$attrs,wizardCtrl){$scope.navClick=function($index){wizardCtrl.goTo($index)}},require:"^wizard"}}),angular.module("template/wizardNavTpl.html",[]).run(["$templateCache",function($templateCache){$templateCache.put("partials/wizard/wizardNavTpl.html",'<ul class="WizardNavUl">\n<li ng-repeat="s in steps track by $index" ng-class="{active:currentStep==$index}" ng-click="navClick($index)">\n<div>{{s.stepTitle}}</div>\n<div ng-if="$index < steps.length-1" class="WizardDownArrow">\n</div>\n</li>\n</ul>\n')}]),angular.module("template/wizardTpl.html",[]).run(["$templateCache",function($templateCache){$templateCache.put("partials/wizard/wizardTpl.html",'<div>\n<wizard-nav></wizard-nav>\n<div class="step-content" ng-transclude></div>\n<input type="button" value="Prev" wizard-previous ng-disabled="hasPrevious()"/>\n<input type="button" value="Next" wizard-next ng-disabled="hasNext()"/>\n<input type="button" value="finish" close-modal=ok"/>\n<input type="button" value="cancel" close-modal="cancel"/>\n</div>\n')}]),wizardButtons("Next","next"),wizardButtons("Previous","previous"),wizardButtons("Finish","finish")}(angular);