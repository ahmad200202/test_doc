!function(mod){"object"==typeof exports&&"object"==typeof module?mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],mod):mod(CodeMirror)}(function(CodeMirror){function forEach(arr,f){for(var i=0,e=arr.length;e>i;++i)f(arr[i])}function arrayContains(arr,item){if(!Array.prototype.indexOf){for(var i=arr.length;i--;)if(arr[i]===item)return!0;return!1}return-1!=arr.indexOf(item)}function scriptHint(editor,keywords,getToken,options){var cur=editor.getCursor(),token=getToken(editor,cur);if(!/\b(?:string|comment)\b/.test(token.type)){var innerMode=CodeMirror.innerMode(editor.getMode(),token.state);if("json"!==innerMode.mode.helperType){token.state=innerMode.state,/^[\w$_]*$/.test(token.string)?token.end>cur.ch&&(token.end=cur.ch,token.string=token.string.slice(0,cur.ch-token.start)):token={start:cur.ch,end:cur.ch,string:"",state:token.state,type:"."==token.string?"property":null};for(var tprop=token;"property"==tprop.type;){if(tprop=getToken(editor,Pos(cur.line,tprop.start)),"."!=tprop.string)return;if(tprop=getToken(editor,Pos(cur.line,tprop.start)),!context)var context=[];context.push(tprop)}return{list:getCompletions(token,context,keywords,options),from:Pos(cur.line,token.start),to:Pos(cur.line,token.end)}}}}function javascriptHint(editor,options){return scriptHint(editor,javascriptKeywords,function(e,cur){return e.getTokenAt(cur)},options)}function getCoffeeScriptToken(editor,cur){var token=editor.getTokenAt(cur);return cur.ch==token.start+1&&"."==token.string.charAt(0)?(token.end=token.start,token.string=".",token.type="property"):/^\.[\w$_]*$/.test(token.string)&&(token.type="property",token.start++,token.string=token.string.replace(/\./,"")),token}function coffeescriptHint(editor,options){return scriptHint(editor,coffeescriptKeywords,getCoffeeScriptToken,options)}function forAllProps(obj,callback){if(Object.getOwnPropertyNames&&Object.getPrototypeOf)for(var o=obj;o;o=Object.getPrototypeOf(o))Object.getOwnPropertyNames(o).forEach(callback);else for(var name in obj)callback(name)}function getCompletions(token,context,keywords,options){function maybeAdd(str){0!=str.lastIndexOf(start,0)||arrayContains(found,str)||found.push(str)}function gatherCompletions(obj){"string"==typeof obj?forEach(stringProps,maybeAdd):obj instanceof Array?forEach(arrayProps,maybeAdd):obj instanceof Function&&forEach(funcProps,maybeAdd),forAllProps(obj,maybeAdd)}var found=[],start=token.string,global=options&&options.globalScope||window;if(context&&context.length){var base,obj=context.pop();for(obj.type&&0===obj.type.indexOf("variable")?(options&&options.additionalContext&&(base=options.additionalContext[obj.string]),options&&options.useGlobalScope===!1||(base=base||global[obj.string])):"string"==obj.type?base="":"atom"==obj.type?base=1:"function"==obj.type&&(null==global.jQuery||"$"!=obj.string&&"jQuery"!=obj.string||"function"!=typeof global.jQuery?null!=global._&&"_"==obj.string&&"function"==typeof global._&&(base=global._()):base=global.jQuery());null!=base&&context.length;)base=base[context.pop().string];null!=base&&gatherCompletions(base)}else{for(var v=token.state.localVars;v;v=v.next)maybeAdd(v.name);for(var c=token.state.context;c;c=c.prev)for(var v=c.vars;v;v=v.next)maybeAdd(v.name);for(var v=token.state.globalVars;v;v=v.next)maybeAdd(v.name);if(options&&null!=options.additionalContext)for(var key in options.additionalContext)maybeAdd(key);options&&options.useGlobalScope===!1||gatherCompletions(global),forEach(keywords,maybeAdd)}return found}var Pos=CodeMirror.Pos;CodeMirror.registerHelper("hint","javascript",javascriptHint),CodeMirror.registerHelper("hint","coffeescript",coffeescriptHint);var stringProps="charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search".split(" "),arrayProps="length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ".split(" "),funcProps="prototype apply call bind".split(" "),javascriptKeywords="break case catch class const continue debugger default delete do else export extends false finally for function if in import instanceof new null return super switch this throw true try typeof var void while with yield".split(" "),coffeescriptKeywords="and break catch class continue delete do else extends false finally for if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes".split(" ")});