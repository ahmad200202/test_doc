angular.module("ui.bootstrap.stackedMap",[]).factory("$$stackedMap",function(){return{createNew:function(){var stack=[];return{add:function(key,value){stack.push({key:key,value:value})},get:function(key){for(var i=0;i<stack.length;i++)if(key===stack[i].key)return stack[i]},keys:function(){for(var keys=[],i=0;i<stack.length;i++)keys.push(stack[i].key);return keys},top:function(){return stack[stack.length-1]},remove:function(key){for(var idx=-1,i=0;i<stack.length;i++)if(key===stack[i].key){idx=i;break}return stack.splice(idx,1)[0]},removeTop:function(){return stack.pop()},length:function(){return stack.length}}}}});