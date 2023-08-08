!function(window,angular){"use strict";function $$CookieWriter($document,$log,$browser){function buildCookieString(name,value,options){var path,expires;options=options||{},expires=options.expires,path=angular.isDefined(options.path)?options.path:cookiePath,angular.isUndefined(value)&&(expires="Thu, 01 Jan 1970 00:00:00 GMT",value=""),angular.isString(expires)&&(expires=new Date(expires));var str=encodeURIComponent(name)+"="+encodeURIComponent(value);str+=path?";path="+path:"",str+=options.domain?";domain="+options.domain:"",str+=expires?";expires="+expires.toUTCString():"",str+=options.secure?";secure":"",str+=options.samesite?";samesite="+options.samesite:"";var cookieLength=str.length+1;return cookieLength>4096&&$log.warn("Cookie '"+name+"' possibly not set or overflowed because it was too large ("+cookieLength+" > 4096 bytes)!"),str}var cookiePath=$browser.baseHref(),rawDocument=$document[0];return function(name,value,options){rawDocument.cookie=buildCookieString(name,value,options)}}angular.module("ngCookies",["ng"]).info({angularVersion:"1.8.2"}).provider("$cookies",[function(){function calcOptions(options){return options?angular.extend({},defaults,options):defaults}var defaults=this.defaults={};this.$get=["$$cookieReader","$$cookieWriter",function($$cookieReader,$$cookieWriter){return{get:function(key){return $$cookieReader()[key]},getObject:function(key){var value=this.get(key);return value?angular.fromJson(value):value},getAll:function(){return $$cookieReader()},put:function(key,value,options){$$cookieWriter(key,value,calcOptions(options))},putObject:function(key,value,options){this.put(key,angular.toJson(value),options)},remove:function(key,options){$$cookieWriter(key,void 0,calcOptions(options))}}}]}]),$$CookieWriter.$inject=["$document","$log","$browser"],angular.module("ngCookies").provider("$$cookieWriter",function(){this.$get=$$CookieWriter})}(window,window.angular);