"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.resolveFactory=void 0;var core_1=require("@uirouter/core"),angular=require("angular"),$resolve={resolve:function(invocables,locals,parent){void 0===locals&&(locals={});var parentNode=new core_1.PathNode(new core_1.StateObject({params:{},resolvables:[]})),node=new core_1.PathNode(new core_1.StateObject({params:{},resolvables:[]})),context=new core_1.ResolveContext([parentNode,node]);context.addResolvables(core_1.resolvablesBuilder({resolve:invocables}),node.state);var resolveData=function(parentLocals){var rewrap=function(_locals){return core_1.resolvablesBuilder({resolve:core_1.mapObj(_locals,function(local){return function(){return local}})})};context.addResolvables(rewrap(parentLocals),parentNode.state),context.addResolvables(rewrap(locals),node.state);var tuples2ObjR=function(acc,tuple){return acc[tuple.token]=tuple.value,acc};return context.resolvePath().then(function(results){return results.reduce(tuples2ObjR,{})})};return parent?parent.then(resolveData):resolveData({})}};exports.resolveFactory=function(){return $resolve},angular.module("ui.router").factory("$resolve",exports.resolveFactory);