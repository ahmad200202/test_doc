!function(angular){"use strict";var services;try{services=angular.module("attunity.genFactories")}catch(names){services=angular.module("attunity.genFactories",["ngResource"])}services.factory("commonInterceptor",["$q",function($q){return{request:function(config){var deferred=$q.defer();return window.parent.attCypressHack?(window.parent.attCypressHack(config).then(function(result){result&&(config.cypress=result),deferred.resolve(config)},function(){deferred.resolve(config)}),deferred.promise):config},requestError:function(rejection){return $q.reject({data:rejection})},response:function(response){window.parent.attCypressHack&&(response.config.headers["Access-Control-Allow-Origin"]="*");var appStatus=response.headers("Application-Status"),appMessage=response.headers("Application-Message"),detailedMessage=response.headers("Application-Detailed-Message");return null!=appStatus&&"200"!=appStatus?$q.reject({data:{appMessage:appMessage,detailedMessage:detailedMessage,statusCode:appStatus}}):(response.config.cypress&&(response.data=response.config.cypress),response)},responseError:function(rejection){return rejection&&401==rejection.status&&location.reload(!0),$q.reject({data:rejection})}}}])}(angular);