describe("uib-accordion",function(){var $animate,$scope;beforeEach(module("ui.bootstrap.accordion")),beforeEach(module("ngAnimateMock")),beforeEach(module("uib/template/accordion/accordion.html")),beforeEach(module("uib/template/accordion/accordion-group.html")),beforeEach(inject(function(_$animate_,$rootScope){$animate=_$animate_,$scope=$rootScope})),describe("controller",function(){var ctrl,$attrs;beforeEach(inject(function($controller){$attrs={},ctrl=$controller("UibAccordionController",{$scope:$scope,$attrs:$attrs})})),describe("addGroup",function(){it("adds a the specified panel to the collection",function(){var group1,group2;ctrl.addGroup(group1=$scope.$new()),ctrl.addGroup(group2=$scope.$new()),expect(ctrl.groups.length).toBe(2),expect(ctrl.groups[0]).toBe(group1),expect(ctrl.groups[1]).toBe(group2)})}),describe("closeOthers",function(){var group1,group2,group3;beforeEach(function(){ctrl.addGroup(group1={isOpen:!0,$on:angular.noop}),ctrl.addGroup(group2={isOpen:!0,$on:angular.noop}),ctrl.addGroup(group3={isOpen:!0,$on:angular.noop})}),it("should close other panels if close-others attribute is not defined",function(){delete $attrs.closeOthers,ctrl.closeOthers(group2),expect(group1.isOpen).toBe(!1),expect(group2.isOpen).toBe(!0),expect(group3.isOpen).toBe(!1)}),it("should close other panels if close-others attribute is true",function(){$attrs.closeOthers="true",ctrl.closeOthers(group3),expect(group1.isOpen).toBe(!1),expect(group2.isOpen).toBe(!1),expect(group3.isOpen).toBe(!0)}),it("should not close other panels if close-others attribute is false",function(){$attrs.closeOthers="false",ctrl.closeOthers(group2),expect(group1.isOpen).toBe(!0),expect(group2.isOpen).toBe(!0),expect(group3.isOpen).toBe(!0)}),describe("setting accordionConfig",function(){var originalCloseOthers;beforeEach(inject(function(uibAccordionConfig){originalCloseOthers=uibAccordionConfig.closeOthers,uibAccordionConfig.closeOthers=!1})),afterEach(inject(function(uibAccordionConfig){uibAccordionConfig.closeOthers=originalCloseOthers})),it("should not close other panels if accordionConfig.closeOthers is false",function(){ctrl.closeOthers(group2),expect(group1.isOpen).toBe(!0),expect(group2.isOpen).toBe(!0),expect(group3.isOpen).toBe(!0)})})}),describe("removeGroup",function(){it("should remove the specified panel",function(){var group1,group2,group3;ctrl.addGroup(group1=$scope.$new()),ctrl.addGroup(group2=$scope.$new()),ctrl.addGroup(group3=$scope.$new()),ctrl.removeGroup(group2),expect(ctrl.groups.length).toBe(2),expect(ctrl.groups[0]).toBe(group1),expect(ctrl.groups[1]).toBe(group3)}),it("should ignore remove of non-existing panel",function(){var group1,group2;ctrl.addGroup(group1=$scope.$new()),ctrl.addGroup(group2=$scope.$new()),expect(ctrl.groups.length).toBe(2),ctrl.removeGroup({}),expect(ctrl.groups.length).toBe(2)}),it("should remove a panel when the scope is destroyed",function(){var group1,group2,group3;ctrl.addGroup(group1=$scope.$new()),ctrl.addGroup(group2=$scope.$new()),ctrl.addGroup(group3=$scope.$new()),group2.$destroy(),expect(ctrl.groups.length).toBe(2),expect(ctrl.groups[0]).toBe(group1),expect(ctrl.groups[1]).toBe(group3)})})}),describe("uib-accordion",function(){var scope,$compile,$templateCache,element;beforeEach(inject(function($rootScope,_$compile_,_$templateCache_){scope=$rootScope,$compile=_$compile_,$templateCache=_$templateCache_})),it("should be a tablist",function(){element=$compile("<uib-accordion></uib-accordion>")(scope),scope.$digest(),expect(element.html()).toContain('role="tablist"')}),it("should expose the controller on the view",function(){$templateCache.put("uib/template/accordion/accordion.html","<div>{{accordion.text}}</div>"),element=$compile("<uib-accordion></uib-accordion>")(scope),scope.$digest();var ctrl=element.controller("uibAccordion");expect(ctrl).toBeDefined(),ctrl.text="foo",scope.$digest(),expect(element.html()).toBe('<div class="ng-binding">foo</div>')}),it("should allow custom templates",function(){$templateCache.put("foo/bar.html","<div>baz</div>"),element=$compile('<uib-accordion template-url="foo/bar.html"></uib-accordion>')(scope),scope.$digest(),expect(element.html()).toBe("<div>baz</div>")})}),describe("uib-accordion-group",function(){function isDisabledStyleCheck(){var tpl='<uib-accordion ng-init="a = [1,2,3]"><div uib-accordion-group heading="I get overridden" is-disabled="true"><uib-accordion-heading>Heading Element <span ng-repeat="x in a">{{x}}</span> </uib-accordion-heading>Body</div></uib-accordion>';scope.disabled=!0,element=$compile(tpl)(scope),scope.$digest(),groups=element.find(".panel"),expect(findGroupLink(0).find("span").hasClass("text-muted")).toBe(!0)}var scope,$compile,element,groups,findGroupHeading=function(index){return groups.eq(index).find(".panel-heading").eq(0)},findGroupLink=function(index){return groups.eq(index).find(".accordion-toggle").eq(0)},findGroupBody=function(index){return groups.eq(index).find(".panel-collapse").eq(0)};beforeEach(inject(function(_$rootScope_,_$compile_){scope=_$rootScope_,$compile=_$compile_})),it("should allow custom templates",inject(function($templateCache){$templateCache.put("foo/bar.html","<div>baz</div>");var tpl='<uib-accordion><div uib-accordion-group heading="title 1" template-url="foo/bar.html"></div></uib-accordion>';element=$compile(tpl)(scope),scope.$digest(),expect(element.find("[template-url]").html()).toBe("<div>baz</div>")})),describe("with static panels",function(){beforeEach(function(){spyOn(Math,"random").and.returnValue(.1);var tpl='<uib-accordion><div uib-accordion-group heading="title 1">Content 1</div><div uib-accordion-group heading="title 2">Content 2</div></uib-accordion>';element=angular.element(tpl),$compile(element)(scope),scope.$digest(),groups=element.find(".panel")}),afterEach(function(){element.remove()}),it("should create accordion panels with content",function(){expect(groups.length).toEqual(2),expect(findGroupLink(0).text()).toEqual("title 1"),expect(findGroupBody(0).text().trim()).toEqual("Content 1"),expect(findGroupLink(1).text()).toEqual("title 2"),expect(findGroupBody(1).text().trim()).toEqual("Content 2")}),it("should change selected element on click",function(){findGroupLink(0).click(),scope.$digest(),expect(findGroupBody(0).scope().isOpen).toBe(!0),expect(findGroupHeading(0).html()).toContain('aria-expanded="true"'),findGroupLink(1).click(),scope.$digest(),expect(findGroupBody(0).scope().isOpen).toBe(!1),expect(findGroupHeading(0).html()).toContain('aria-expanded="false"'),expect(findGroupBody(1).scope().isOpen).toBe(!0),expect(findGroupHeading(1).html()).toContain('aria-expanded="true"')}),it("should toggle element on click",function(){findGroupLink(0).click(),scope.$digest(),expect(findGroupBody(0).scope().isOpen).toBe(!0),expect(groups.eq(0).html()).toContain('aria-hidden="false"'),findGroupLink(0).click(),scope.$digest(),expect(findGroupBody(0).scope().isOpen).toBe(!1),expect(groups.eq(0).html()).toContain('aria-hidden="true"')}),it('should add, by default, "panel-open" when opened',function(){var group=groups.eq(0);findGroupLink(0).click(),scope.$digest(),expect(group).toHaveClass("panel-open"),findGroupLink(0).click(),scope.$digest(),expect(group).not.toHaveClass("panel-open")}),it("should toggle element on spacebar when focused",function(){var group=groups.eq(0);findGroupLink(0)[0].focus();var e=$.Event("keypress");e.which=32,findGroupLink(0).trigger(e),expect(group).toHaveClass("panel-open"),e=$.Event("keypress"),e.which=32,findGroupLink(0).trigger(e),expect(group).not.toHaveClass("panel-open")}),it("should not toggle with any other keyCode",function(){var group=groups.eq(0);findGroupLink(0)[0].focus();var e=$.Event("keypress");e.which=65,findGroupLink(0).trigger(e),expect(group).not.toHaveClass("panel-open")}),it("should generate an Id for the heading",function(){var groupScope=findGroupBody(0).scope();expect(groupScope.headingId).toEqual("accordiongroup-"+groupScope.$id+"-1000-tab")}),it("should generate an Id for the panel",function(){var groupScope=findGroupBody(0).scope();expect(groupScope.panelId).toEqual("accordiongroup-"+groupScope.$id+"-1000-panel")})}),describe("with open-class attribute",function(){beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group heading="title 1" open-class="custom-open-class">Content 1</div><div uib-accordion-group heading="title 2" open-class="custom-open-class">Content 2</div></uib-accordion>';element=angular.element(tpl),$compile(element)(scope),scope.$digest(),groups=element.find(".panel")}),afterEach(function(){element.remove()}),it("should add custom-open-class when opened",function(){var group=groups.eq(0);findGroupLink(0).click(),scope.$digest(),expect(group).toHaveClass("custom-open-class"),findGroupLink(0).click(),scope.$digest(),expect(group).not.toHaveClass("custom-open-class")})}),describe("with dynamic panels",function(){var model;beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group ng-repeat="group in groups" heading="{{group.name}}">{{group.content}}</div></uib-accordion>';element=angular.element(tpl),model=[{name:"title 1",content:"Content 1"},{name:"title 2",content:"Content 2"}],$compile(element)(scope),scope.$digest()}),it("should have no panels initially",function(){groups=element.find(".panel"),expect(groups.length).toEqual(0)}),it("should have a panel for each model item",function(){scope.groups=model,scope.$digest(),groups=element.find(".panel"),expect(groups.length).toEqual(2),expect(findGroupLink(0).text()).toEqual("title 1"),expect(findGroupBody(0).text().trim()).toEqual("Content 1"),expect(findGroupLink(1).text()).toEqual("title 2"),expect(findGroupBody(1).text().trim()).toEqual("Content 2")}),it("should react properly on removing items from the model",function(){scope.groups=model,scope.$digest(),groups=element.find(".panel"),expect(groups.length).toEqual(2),scope.groups.splice(0,1),scope.$digest(),groups=element.find(".panel"),expect(groups.length).toEqual(1)})}),describe("is-open attribute",function(){beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group heading="title 1" is-open="open.first">Content 1</div><div uib-accordion-group heading="title 2" is-open="open.second">Content 2</div></uib-accordion>';element=angular.element(tpl),scope.open={first:!1,second:!0},$compile(element)(scope),scope.$digest(),groups=element.find(".panel")}),it("should open the panel with isOpen set to true",function(){expect(findGroupBody(0).scope().isOpen).toBe(!1),expect(findGroupBody(1).scope().isOpen).toBe(!0)}),it("should toggle variable on element click",function(){findGroupLink(0).click(),scope.$digest(),expect(scope.open.first).toBe(!0),findGroupLink(0).click(),scope.$digest(),expect(scope.open.second).toBe(!1)})}),describe("is-open attribute with dynamic content",function(){beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group heading="title 1" is-open="open1"><div ng-repeat="item in items">{{item}}</div></div><div uib-accordion-group heading="title 2" is-open="open2">Static content</div></uib-accordion>';element=angular.element(tpl),scope.items=["Item 1","Item 2","Item 3"],scope.open1=!0,scope.open2=!1,angular.element(document.body).append(element),$compile(element)(scope),scope.$digest(),$animate.flush(),groups=element.find(".panel")}),afterEach(function(){element.remove()}),it("should have visible panel body when the group with isOpen set to true",function(){expect(findGroupBody(0)).toHaveClass("in"),expect(findGroupBody(1)).not.toHaveClass("in")})}),describe("is-open attribute with dynamic groups",function(){beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group ng-repeat="group in groups" heading="{{group.name}}" is-open="group.open">{{group.content}}</div></uib-accordion>';element=angular.element(tpl),scope.groups=[{name:"title 1",content:"Content 1",open:!1},{name:"title 2",content:"Content 2",open:!0}],$compile(element)(scope),scope.$digest(),groups=element.find(".panel")}),it("should have visible group body when the group with isOpen set to true",function(){expect(findGroupBody(0).scope().isOpen).toBe(!1),expect(findGroupBody(1).scope().isOpen).toBe(!0)}),it("should toggle element on click",function(){findGroupLink(0).click(),scope.$digest(),expect(findGroupBody(0).scope().isOpen).toBe(!0),expect(scope.groups[0].open).toBe(!0),findGroupLink(0).click(),scope.$digest(),expect(findGroupBody(0).scope().isOpen).toBe(!1),expect(scope.groups[0].open).toBe(!1)})}),describe("is-open attribute with custom class",function(){beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group ng-repeat="group in groups" heading="{{group.name}}" is-open="group.open" class="testClass">{{group.content}}</div></uib-accordion>';element=angular.element(tpl),scope.groups=[{name:"title 1",content:"Content 1",open:!1},{name:"title 2",content:"Content 2",open:!0}],$compile(element)(scope),scope.$digest(),groups=element.find(".panel")}),it('should add "panel-open" class',function(){expect(groups.eq(0)).not.toHaveClass("panel-open"),expect(groups.eq(1)).toHaveClass("panel-open")})}),describe("`is-disabled` attribute",function(){var groupBody;beforeEach(function(){var tpl='<uib-accordion><div uib-accordion-group heading="title 1" is-disabled="disabled">Content 1</div></uib-accordion>';element=angular.element(tpl),scope.disabled=!0,$compile(element)(scope),scope.$digest(),groups=element.find(".panel"),groupBody=findGroupBody(0)}),it("should open the panel with isOpen set to true",function(){expect(groupBody.scope().isOpen).toBeFalsy()}),it("should not toggle if disabled",function(){findGroupLink(0).click(),scope.$digest(),expect(groupBody.scope().isOpen).toBeFalsy()}),it("should toggle after enabling",function(){scope.disabled=!1,scope.$digest(),expect(groupBody.scope().isOpen).toBeFalsy(),findGroupLink(0).click(),scope.$digest(),expect(groupBody.scope().isOpen).toBeTruthy()}),it("should have text-muted styling",function(){expect(findGroupLink(0).find("span:first")).toHaveClass("text-muted")})}),describe("uib-accordion-heading element",function(){beforeEach(function(){var tpl='<uib-accordion ng-init="a = [1,2,3]"><div uib-accordion-group heading="I get overridden"><uib-accordion-heading>Heading Element <span ng-repeat="x in a">{{x}}</span> </uib-accordion-heading>Body</div></uib-accordion>';element=$compile(tpl)(scope),scope.$digest(),groups=element.find(".panel")}),it("transcludes the <uib-accordion-heading> content into the heading link",function(){expect(findGroupLink(0).text()).toBe("Heading Element 123 ")}),it("attaches the same scope to the transcluded heading and body",function(){expect(findGroupLink(0).scope().$id).toBe(findGroupBody(0).scope().$id)}),it("should wrap the transcluded content in a span",function(){expect(findGroupLink(0).find("span:first").length).toEqual(1)}),it("should have disabled styling when is-disabled is true",isDisabledStyleCheck)}),describe("uib-accordion-heading attribute",function(){beforeEach(function(){var tpl='<uib-accordion ng-init="a = [1,2,3]"><div uib-accordion-group heading="I get overridden"><div uib-accordion-heading>Heading Element <span ng-repeat="x in a">{{x}}</span> </div>Body</div></uib-accordion>';element=$compile(tpl)(scope),scope.$digest(),groups=element.find(".panel")}),it("transcludes the <uib-accordion-heading> content into the heading link",function(){expect(findGroupLink(0).text()).toBe("Heading Element 123 ")}),it("attaches the same scope to the transcluded heading and body",function(){expect(findGroupLink(0).scope().$id).toBe(findGroupBody(0).scope().$id)}),it("should have disabled styling when is-disabled is true",isDisabledStyleCheck)}),describe("uib-accordion-heading, with repeating uib-accordion-groups",function(){it("should clone the uib-accordion-heading for each group",function(){element=$compile('<uib-accordion><div uib-accordion-group ng-repeat="x in [1,2,3]"><uib-accordion-heading>{{x}}</uib-accordion-heading></div></uib-accordion>')(scope),scope.$digest(),groups=element.find(".panel"),expect(groups.length).toBe(3),expect(findGroupLink(0).text()).toBe("1"),expect(findGroupLink(1).text()).toBe("2"),expect(findGroupLink(2).text()).toBe("3")})}),describe("uib-accordion-heading attribute, with repeating uib-accordion-groups",function(){it("should clone the uib-accordion-heading for each group",function(){element=$compile('<uib-accordion><div uib-accordion-group ng-repeat="x in [1,2,3]"><div uib-accordion-heading>{{x}}</div></div></uib-accordion>')(scope),scope.$digest(),groups=element.find(".panel"),expect(groups.length).toBe(3),expect(findGroupLink(0).text()).toBe("1"),expect(findGroupLink(1).text()).toBe("2"),expect(findGroupLink(2).text()).toBe("3")})}),describe("uib-accordion-heading attribute, with custom template",function(){it("should transclude heading to a template using data-uib-accordion-header",inject(function($templateCache){$templateCache.put("foo/bar.html",'<div class="panel"><a uib-accordion-transclude="heading" class="accordion-toggle"><span data-uib-accordion-header></span></a><div ng-transclude></div></div>'),element=$compile('<uib-accordion><div uib-accordion-group  template-url="foo/bar.html"><uib-accordion-heading>baz</uib-accordion-heading></div></uib-accordion>')(scope),scope.$digest(),groups=element.find(".panel"),expect(findGroupLink(0).text()).toBe("baz")}))})})});