var DirectedAcyclicGraphHistory=function(){var history=History();return history.addSelection=function(d,name){if(0!=d.length){var item={};return item.apply=function(){d.forEach(function(e){e.visible(!1)})},item.unapply=function(){d.forEach(function(e){e.visible(!0)})},item.name=name,item.selection=d,history.add(item)}},history},History=function(){var seed=0,history=[];return history.add=function(item){return item.id=seed++,history.push(item),item.apply(),item},history.remove=function(item){var i=history.indexOf(item);-1!=i&&history.splice(i,1),item.unapply();for(var i=0;i<history.length;i++)history[i].apply();return item},history};