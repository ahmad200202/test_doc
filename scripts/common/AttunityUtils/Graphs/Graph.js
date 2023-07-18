!function(global){"use strict";function GraphComponent(targetElement,graphData,options){function dragstart(d){d.startPosition={x:AttuGraph.Utils.nodePosition.x(d),y:AttuGraph.Utils.nodePosition.y(d)},d3.event.sourceEvent.stopPropagation(),thisGraph.state.translate=zoom.translate(),thisGraph.state.scale=zoom.scale(),rootSVG.on("mousedown.zoom",null).on("mousewheel.zoom",null).on("mousemove.zoom",null).on("DOMMouseScroll.zoom",null).on("dblclick.zoom",null).on("touchstart.zoom",null).on("touchmove.zoom",null).on("touchend.zoom",null)}function dragmove(d){d.px=AttuGraph.Utils.nodePosition.x(d)+d3.event.dx,d.py=AttuGraph.Utils.nodePosition.y(d)+d3.event.dy,thisGraph.draw(!1)}function dragend(d){var curNodePosition={x:AttuGraph.Utils.nodePosition.x(d),y:AttuGraph.Utils.nodePosition.y(d)},nodeInSamePlace=!1;curNodePosition.x==d.startPosition.x&&curNodePosition.y==d.startPosition.y&&(nodeInSamePlace=!0),thisGraph.instanceOptions.onNodeDragEnd&&thisGraph.instanceOptions.onNodeDragEnd(d,nodeInSamePlace),d.startPosition=null,initZoomBehavior()}function edgeid(d){return thisGraph.instanceOptions.edgeIdFn?thisGraph.instanceOptions.edgeIdFn(d):d.source.id+"_"+d.target.id}{var rootSVG=d3.select(targetElement).append("svg").classed("rootSVG H100W100",!0).attr("width","100%").attr("height","100%"),graphSVG=rootSVG.append("svg").attr("width","100%").attr("height","100%").attr("class","graph-attach"),graphGroup=null;options.defaultEdgeShape}if(global.AttuGraph.contextMenu&&(this.contextMenuEl=new global.AttuGraph.contextMenu,this.contextMenuEl.create()),this.state={translate:[0,0],scale:1},this.id=++idGenerator,options.graphEvents)for(var ev in options.graphEvents)graphSVG.on(ev,options.graphEvents[ev]);initGraph.call(this,graphData,options),this.instanceOptions=options,this.addNode=function(node,parentId){this.nodesList.push(node);var nodeId=nodeid(node);this.nodes[nodeId]=node,null!=parentId&&this.addEdge(parentId,nodeId)},this.getNodeById=function(id){return this.nodes[id]},this.getNodeByProperty=function(property,value){for(var key in this.nodes)if(this.nodes[key][property]&&this.nodes[key][property]==value)return this.nodes[key];return null},this.removeNode=function(nodeId){var node=this.nodes[nodeId];this.nodesList.splice(this.nodesList.indexOf(node),1),delete this.nodes[nodeId]},this.removeChildren=function(nodeId){for(var i=0;i<this.edges.length;i++){var edge=this.edges[i];nodeid(edge.source)==nodeId&&(this.edges.splice(i,1),i--,this.removeNode(edge.target),this.removeChildren(nodeid(edge.target)))}},this.forceLayout=function(){_layout.call(rootSVG.select(".graph").node(),thisGraph.nodesList,thisGraph.edges,options.layout);for(var i=0;i<thisGraph.nodesList.length;i++){var node=thisGraph.nodesList[i];node.px=node.x,node.py=node.y}thisGraph.draw()},this.addEdge=function(sourceId,targetId){this.edges.push({source:this.getNodeById(sourceId),target:this.getNodeById(targetId)})},this.removeEdgeById=function(id){for(var i=0;i<this.edges.length;i++){var edge=this.edges[i];if(edgeid(edge)==id){this.edges.splice(i,1);break}}},this.removeEdge=function(sourceOrTargetId){for(var i=0;i<this.edges.length;i++){var edge=this.edges[i];(nodeid(edge.source)==sourceOrTargetId||nodeid(edge.target)==sourceOrTargetId)&&(this.edges.splice(i,1),i--)}},this.getGraphTypedContainingElem=function(elem){var res=null;return $(elem).parents(".node").length>0||$(elem).hasClass("node")?res={type:"node",data:d3.select($(elem).parents(".node")[0]).data()[0]}:$(elem).parents(".graph")&&(res={type:"graph"}),res},this.changeNodeShape=function(node,shape){var nodeEl=graphSVG.select("#"+nodeIdForSelect(node));null!=nodeEl.node()&&(removeNode.call(nodeEl.node(),node),node.shape=shape,drawNode(node,nodeEl.node(),this),this.draw())},this.enableZoomPan=function(enable){enable?initZoomBehavior():zoom&&zoom.on("zoom",null)},this.getRootElement=function(){return rootSVG},this.destroy=function(){$(targetElement).empty();var nodes=rootSVG.selectAll(".node");if(options.nodeEvents)for(var ev in options.nodeEvents)nodes.on(ev,null);var edges=rootSVG.selectAll(".edge");if(options.edgeEvents)for(var ev in options.edgeEvents)edges.on(ev,null)},this.firstRender=!0;var thisGraph=this;this.draw=function(recalcLayout){null==recalcLayout&&(recalcLayout=!0),initGraph.call(this,graphData,options);var selection=graphSVG.datum(graphData);selection.each(function(data){var svg=d3.select(this).selectAll("svg").data([data]);null==graphGroup&&(graphGroup=svg.enter().append("svg").append("g").attr("class","graph").classed("animate",animate)),svg.attr("width","100%"),svg.attr("height","100%");var edges=thisGraph.edges,nodes=thisGraph.nodesList,parentNode=svg.select(".graph"),existing_edgesTemp=svg.select(".graph").selectAll(".edgeContainer");existing_edgesTemp=existing_edgesTemp.filter(function(){return this.parentNode==parentNode.node()});var existing_edges=existing_edgesTemp.data(edges,edgeid),existing_nodesTemp=svg.select(".graph").selectAll(".node");existing_nodesTemp=existing_nodesTemp.filter(function(){return this.parentNode==parentNode.node()});var existing_nodes=existing_nodesTemp.data(nodes,nodeid),removed_edges=existing_edges.exit(),removed_nodes=existing_nodes.exit(),new_edges=existing_edges.enter().insert("g",":first-child").attr("id",edgeid).attr("class","edgeContainer");new_edges.insert("path",":first-child").attr("class","edge userVisible entering"),new_edges.append("path").attr("class","edge clickable entering");var new_nodes=existing_nodes.enter().append("g").attr("class","node entering");if(new_nodes.each(function(nodeData){drawNode(nodeData,this,thisGraph)}),existing_nodes.each(updateNode),removed_nodes.each(removeNode),removeEdges(removed_edges),existing_nodes.classed("pre-existing",!0),recalcLayout&&_layout.call(svg.select(".graph").node(),nodes,edges,options.layout),existing_nodes.classed("pre-existing",!1),animate?(svg.select(".graph").selectAll(".edgeContainer").each(function(d){var userVis=d3.select(this).select(".userVisible"),path=drawEdge.call(userVis.node(),d);userVis.attr("d",path);var clickable=d3.select(this).select(".clickable");clickable.attr("d",path)}),existing_nodes.attr("transform",nodeTranslate)):(svg.select(".graph").selectAll(".edgeContainer").each(function(d){var userVis=d3.select(this).select(".userVisible"),path=drawEdge.call(userVis.node(),d);userVis.attr("d",path);var clickable=d3.select(this).select(".clickable");clickable.attr("d",path)}),existing_nodes.attr("transform",nodeTranslate)),new_nodes.each(newnodetransition),new_edges.selectAll(".edge").attr("d",drawEdge).classed("visible",!0),existing_nodes.classed("visible",!0),options.nodeEvents)for(var ev in options.nodeEvents)new_nodes.on(ev,options.nodeEvents[ev]);if(options.edgeEvents)for(var ev in options.edgeEvents)new_edges.on(ev,options.edgeEvents[ev]);if(new_nodes.on("contextmenu",function(d){if(thisGraph.instanceOptions.onNodeContextMenu&&thisGraph.contextMenuEl){var menu=thisGraph.instanceOptions.onNodeContextMenu(d,thisGraph);null!=menu&&0!=menu.length&&thisGraph.contextMenuEl.show.call(this,menu,d)}}),new_edges.on("contextmenu",function(d){if(thisGraph.instanceOptions.onEdgeContextMenu&&thisGraph.contextMenuEl){var menu=thisGraph.instanceOptions.onEdgeContextMenu(d,thisGraph);null!=menu&&0!=menu.length&&thisGraph.contextMenuEl.show.call(this,menu,d)}}),rootSVG.on("contextmenu",function(d){if(thisGraph.instanceOptions.onGraphContextMenu&&thisGraph.contextMenuEl){var mousePosArr=d3.mouse(graphSVG.select(".graph").node()),pos={x:mousePosArr[0],y:mousePosArr[1]},menu=thisGraph.instanceOptions.onGraphContextMenu(d,pos,thisGraph);null!=menu&&0!=menu.length&&thisGraph.contextMenuEl.show.call(this,menu,d)}}),options.dynamic){var node_drag=d3.behavior.drag().on("dragstart",dragstart).on("drag",dragmove).on("dragend",dragend);new_nodes.call(node_drag)}}),thisGraph.firstRender=!1,thisGraph.instanceOptions.onAfterDraw&&thisGraph.instanceOptions.onAfterDraw(thisGraph.nodesList,thisGraph.edges)};var zoom=null;this.fnSetZoomScale=function(translate,scale,animated,onZoomStartFunc,onZoomEndFunc){onZoomStartFunc&&onZoomStartFunc(),onZoomPanRescaleEnd(translate,scale);var animationDuration=0;animated&&0!=options.zoom_duration?(animationDuration=options.zoom_duration||800,rootSVG.select(".graph").transition().duration(animationDuration).attr("transform","translate("+thisGraph.state.translate+") scale("+scale+")").each("end",function(){onZoomEndFunc&&zoom&&onZoomEndFunc(zoom.translate(),zoom.scale())})):rootSVG.select(".graph").attr("transform","translate("+thisGraph.state.translate+") scale("+scale+")")},this.fixSuccessors=function(nodeId){try{for(var layoutGraph=this.instanceOptions.layout.graphObj,nodePredsAll=[nodeId],nodeTemp=nodeId,nodePreds=layoutGraph.predecessors(nodeTemp);nodePreds.length>0;){Array.prototype.push.apply(nodePredsAll,nodePreds);for(var nodePredsTmp=[],i=0;i<nodePreds.length;i++)Array.prototype.push.apply(nodePredsTmp,layoutGraph.predecessors(nodePreds[i]));nodePreds=nodePredsTmp}for(var i=0;i<this.nodesList.length;i++){var node=this.nodesList[i];nodePredsAll.indexOf(node.id)<0&&(node.px=node.px+150)}this.draw(!1)}catch(e){console.log("unable to fix node "+nodeId+"position")}},this.onZoomManual=function(zoomIn,animated,onZoomStartFunc,onZoomEndFunc){var height=parseFloat(targetElement.clientHeight),width=parseFloat(targetElement.clientWidth);if(zoomIn)var newZoom=1.5*zoom.scale(),newX=1.5*(zoom.translate()[0]-width/2)+width/2,newY=1.5*(zoom.translate()[1]-height/2)+height/2;else var newZoom=.75*zoom.scale(),newX=.75*(zoom.translate()[0]-width/2)+width/2,newY=.75*(zoom.translate()[1]-height/2)+height/2;zoom.scale(newZoom).translate([newX,newY]),this.fnSetZoomScale([newX,newY],newZoom,animated,onZoomStartFunc,onZoomEndFunc)},this.fnCenterGraph=function(resetTranslate,resetScale,animated,fixScale){null==resetTranslate&&(resetTranslate=!0),null==resetScale&&(resetScale=!0),null==animated&&(animated=!1);var graphCurbbox=graphGroup.node().getBBox(),translate=[0,0],scale=thisGraph.state.scale;if(resetScale){var scaleByWidth=targetElement.offsetWidth/(graphCurbbox.width+graphCurbbox.x/2),scaleByHeight=targetElement.offsetHeight/(graphCurbbox.height+graphCurbbox.y/2);scale=Math.min(scaleByHeight,scaleByWidth),thisGraph.instanceOptions.maxZoomVal&&0!=thisGraph.instanceOptions.maxZoomVal&&(scale=Math.min(thisGraph.instanceOptions.maxZoomVal,scale)),fixScale&&(scale=Math.max(scale-fixScale,1))}if(resetTranslate){var tx=((targetElement.offsetWidth/scale-graphCurbbox.width)/2-graphCurbbox.x)*scale,ty=((targetElement.offsetHeight/scale-graphCurbbox.height)/2-graphCurbbox.y)*scale;translate=[tx,ty]}this.fnSetZoomScale(translate,scale,animated)},this.fnCenterNode=function(source){var scale=(graphSVG.node().getBBox(),zoom.scale()),x=-source.x,y=-source.y;scale=1.2,x=x*scale+$(targetElement).width()/2,y=y*scale+$(targetElement).height()/2,zoom.translate([x,y]).scale(scale),this.fnSetZoomScale([x,y],scale,!0)},this.selectNode=function(node){this.fnCenterNode(node)};var onZoomPanRescaleEnd=function(translate,scale){thisGraph.state.translate=translate||thisGraph.state.translate,thisGraph.state.scale=scale||thisGraph.state.scale,zoom&&(zoom.translate(thisGraph.state.translate),zoom.scale(thisGraph.state.scale),options.onZoomEnd&&options.onZoomEnd(thisGraph.state.translate,thisGraph.state.scale))},initZoomBehavior=function(){options.minZoomVal=options.minZoomVal||.001,options.maxZoomVal=options.maxZoomVal||2,zoom=d3.behavior.zoom().scaleExtent([options.minZoomVal,options.maxZoomVal]),zoom.on("zoom",rescale),onZoomPanRescaleEnd(),rootSVG.call(zoom),rootSVG.on("dblclick.zoom",null)},rescale=function(){var translate=d3.event.translate,scale=d3.event.scale;rootSVG.select(".graph").attr("transform","translate("+translate+") scale("+scale+")"),thisGraph.state.translate=d3.event.translate,thisGraph.state.scale=d3.event.scale,zoom&&options.onZoomEnd&&options.onZoomEnd(d3.event.translate,d3.event.scale)},drawEdge=function(edge){if(null!=edge.shape&&edge.shape.draw){var res=edge.shape.draw(edge,this);if(res)return res}return options.layout.getEdgePath?options.layout.getEdgePath(edge,this):void console.log("edge draw fn was not defined for edge: "+edgeid(edge))},updateNode=function(node){node.shape.size(node,this),node.shape.update&&node.shape.update(node,this,thisGraph),options.globalNodesUpdateFn&&options.globalNodesUpdateFn(node,this)};this.draw(),(options.zoomPanEnabled||void 0===options.zoomPanEnabled)&&initZoomBehavior()}global.AttuGraph=global.AttuGraph||{};var animate=!1,idGenerator=0,initGraph=function(graphData,options){this.nodes={},this.nodesList=[],this.nodesList=getnodes.call(this,graphData,options);for(var i=0;i<this.nodesList.length;i++)this.nodes[nodeid(this.nodesList[i])]=this.nodesList[i];this.edges=getedges.call(this,graphData,options);for(var k=0;k<this.edges.length;k++){var edge=this.edges[k],sourceId=nodeid(edge.source);null!=sourceId&&(edge.source=this.nodes[sourceId]);var targetId=nodeid(edge.target);null!=targetId&&(edge.target=this.nodes[targetId])}},newnodetransition=function(){d3.select(this).classed("visible",!0).attr("transform",nodeTranslate)},nodeTranslate=function(d){var pos=nodepos(d);return"translate("+pos.x+","+pos.y+")"},nodepos=function(d){return{x:AttuGraph.Utils.nodePosition.x(d),y:AttuGraph.Utils.nodePosition.y(d)}},drawNode=function(node,nodeEl,api){node.shape.draw(node,nodeEl,api),d3.select(nodeEl).attr("id",nodeIdForSelect(node)),node.shape.size(node,nodeEl)},removeNode=function(){animate?d3.select(this).classed("visible",!1).transition().duration(200).remove():d3.select(this).classed("visible",!1).remove()},removeEdges=function(removed_edges){animate?removed_edges.classed("visible",!1).transition().duration(500).remove():removed_edges.classed("visible",!1).remove()},_layout=function(nodes_d,edges_d,graphLayout){d3.select(this).selectAll(".node").each(function(d){d.bbox=bbox.call(this,d),d.width=d.bbox.width,d.height=d.bbox.height}),graphLayout.run(nodes_d,edges_d);for(var i=0;i<nodes_d.length;i++){var node=nodes_d[i];0!=node.px&&null!=node.px||0!=node.py&&null!=node.py||(node.px=node.x,node.py=node.y)}},nodeIdForSelect=function(node){return"_"+nodeid(node)},getnodes=function(d,options){return options.getNodesFn?options.getNodesFn(d):d.nodes},getedges=function(d,options){return options.getEdgesFn?options.getEdgesFn(d):d.edges},nodeid=function(d){return d.id},bbox=function(d){return d.shape.getBBox(d,this)};global.AttuGraph.GraphComponent=GraphComponent}(this);