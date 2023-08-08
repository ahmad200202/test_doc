"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Ng1LocationServices=void 0;var core_1=require("@uirouter/core"),core_2=require("@uirouter/core"),Ng1LocationServices=function(){function Ng1LocationServices($locationProvider){this._urlListeners=[],this.$locationProvider=$locationProvider;var _lp=core_2.val($locationProvider);core_2.createProxyFunctions(_lp,this,_lp,["hashPrefix"])}return Ng1LocationServices.monkeyPatchPathParameterType=function(router){var pathType=router.urlMatcherFactory.type("path");pathType.encode=function(x){return null!=x?x.toString().replace(/(~|\/)/g,function(m){return{"~":"~~","/":"~2F"}[m]}):x},pathType.decode=function(x){return null!=x?x.toString().replace(/(~~|~2F)/g,function(m){return{"~~":"~","~2F":"/"}[m]}):x}},Ng1LocationServices.prototype.dispose=function(){},Ng1LocationServices.prototype.onChange=function(callback){var _this=this;return this._urlListeners.push(callback),function(){return core_2.removeFrom(_this._urlListeners)(callback)}},Ng1LocationServices.prototype.html5Mode=function(){var html5Mode=this.$locationProvider.html5Mode();return html5Mode=core_2.isObject(html5Mode)?html5Mode.enabled:html5Mode,html5Mode&&this.$sniffer.history},Ng1LocationServices.prototype.baseHref=function(){return this._baseHref||(this._baseHref=this.$browser.baseHref()||this.$window.location.pathname)},Ng1LocationServices.prototype.url=function(newUrl,replace,state){return void 0===replace&&(replace=!1),core_1.isDefined(newUrl)&&this.$location.url(newUrl),replace&&this.$location.replace(),state&&this.$location.state(state),this.$location.url()},Ng1LocationServices.prototype._runtimeServices=function($rootScope,$location,$sniffer,$browser,$window){var _this=this;this.$location=$location,this.$sniffer=$sniffer,this.$browser=$browser,this.$window=$window,$rootScope.$on("$locationChangeSuccess",function(evt){return _this._urlListeners.forEach(function(fn){return fn(evt)})});var _loc=core_2.val($location);core_2.createProxyFunctions(_loc,this,_loc,["replace","path","search","hash"]),core_2.createProxyFunctions(_loc,this,_loc,["port","protocol","host"])},Ng1LocationServices}();exports.Ng1LocationServices=Ng1LocationServices;