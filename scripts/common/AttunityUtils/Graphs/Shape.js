!function(global){"use strict";global.AttuGraph.shapes=global.AttuGraph.shapes||{},global.AttuGraph.shapes.rectangle={draw:function(node,nodeEl){var text=(d3.select(nodeEl).append("rect").attr("class",node.class),d3.select(nodeEl).append("text"));text.text(node.display_name)},getBBox:function(node,el){return d3.select(el).select("rect").node().getBBox()},size:function(node,el){var node_bbox={height:node.height||50,width:node.width||50},rect=d3.select(el).select("rect"),text=d3.select(el).select("text");rect.attr("width",node_bbox.width).attr("height",node_bbox.height),text.attr("text-anchor","middle").attr("x",node_bbox.width).attr("y",25)},update:function(){}},global.AttuGraph.shapes.circle={draw:function(node,nodeEl){var text=(d3.select(nodeEl).append("circle").attr("cy","25").attr("cx","25").attr("class",node.class),d3.select(nodeEl).append("text").attr("text-anchor","middle").attr("x",25).attr("y",25));text.text(node.display_name)},getBBox:function(node,el){return d3.select(el).select("circle").node().getBBox()},size:function(node,el){{var node_bbox={height:node.height||25,width:node.width||25},circle=d3.select(el).select("circle");d3.select(el).select("text")}circle.attr("r",node_bbox.width/2)}},global.AttuGraph.shapes.sub_Graph={draw:function(node,nodeEl){var g=d3.select(nodeEl).append("g").attr("class","SUB_GRAPH");g.append("rect"),d3.select(nodeEl).append("polygon").attr("points","380,5 390,5 385,15").classed("expander",!0);var text=d3.select(nodeEl).append("text");text.text(node.display_name);new AttuGraph.GraphComponent(nodeEl,{nodes:node.subGraphData.nodes,edges:node.subGraphData.edges},{layout:new AttuGraph.layouts.dagreLayout({nodeSep:50,edgeSep:12,rankSep:200,rankDir:"LR"}),zoomPanEnabled:!0,dynamic:!0})},getBBox:function(node,el){return d3.select(el).node().getBBox()},size:function(node,el){var node_bbox={height:200,width:400},rect=d3.select(el).select("rect"),text=d3.select(el).select("text");rect.attr("width",node_bbox.width).attr("height",node_bbox.height),text.attr("text-anchor","middle").attr("x",node_bbox.width/2).attr("y",10)}},global.AttuGraph.shapes.topologyNode={draw:function(node,nodeEl){var nodeShapeId=getNodeShapeByType(node.type),hubHtml=defsLoader.getById(nodeShapeId);$(nodeEl).append(hubHtml);var text=d3.select(nodeEl).append("text").attr("text-anchor","middle").attr("x",20);text.text(node.display_name),text.attr("y","50")},getBBox:function(node,el){var nodeShapeId=getNodeShapeByType(node.type);return d3.select(el).select("#"+nodeShapeId).node().getBBox()},size:function(){}};var point=function(d){return{x:AttuGraph.Utils.nodePosition.x(d),y:AttuGraph.Utils.nodePosition.y(d)}};global.AttuGraph.shapes.arrowWithHead={draw:function(edge){var points=[],pointTarget=point(edge.target),pointSource=point(edge.source);return pointSource.x=pointSource.x+edge.source.bbox.width/2,pointSource.y=pointSource.y+edge.source.bbox.height/2,pointTarget.x=pointTarget.x+edge.target.bbox.width/2,pointTarget.y=pointTarget.y+edge.target.bbox.height/2,points.push(pointTarget),points.push(pointSource),d3.svg.line().x(function(d){return d.x}).y(function(d){return d.y}).interpolate("basis")(points)}},global.AttuGraph.shapes.ArcArrow={draw:function(edge){var arcWidthMarker=7,arcLengthMarker=22,deg90=Math.PI/2,sourceX=AttuGraph.Utils.nodePosition.x(edge.source),sourceY=AttuGraph.Utils.nodePosition.y(edge.source),targetX=AttuGraph.Utils.nodePosition.x(edge.target),targetY=AttuGraph.Utils.nodePosition.y(edge.target),arcDx=targetX-sourceX,arcDy=targetY-sourceY,arcDr=Math.sqrt(arcDx*arcDx+arcDy*arcDy),arcTheta=Math.atan2(arcDy,arcDx)+Math.PI/7.85,arcDtxs=targetX-6*Math.cos(arcTheta),arcDtys=targetY-6*Math.sin(arcTheta),arcD90Theta=deg90-arcTheta,arrowPath="M"+sourceX+","+sourceY+"A"+arcDr+","+arcDr+" 0 0 1,"+targetX+","+targetY+"A"+arcDr+","+arcDr+" 0 0 0,"+sourceX+","+sourceY,markerPath="M"+arcDtxs+","+arcDtys+"l"+(arcWidthMarker*Math.cos(arcD90Theta)-arcLengthMarker*Math.cos(arcTheta))+","+(-arcWidthMarker*Math.sin(arcD90Theta)-arcLengthMarker*Math.sin(arcTheta))+"L"+(arcDtxs-arcWidthMarker*Math.cos(arcD90Theta)-arcLengthMarker*Math.cos(arcTheta))+","+(arcDtys+arcWidthMarker*Math.sin(arcD90Theta)-arcLengthMarker*Math.sin(arcTheta))+"z";return arrowPath+markerPath}},global.AttuGraph.shapes.diagonal={draw:function(edge){var sourceBBox=edge.source.bbox,targetBBox=edge.target.bbox,sourceX=global.AttuGraph.Utils.nodePosition.x(edge.source)+sourceBBox.width/2,sourceY=global.AttuGraph.Utils.nodePosition.y(edge.source)+sourceBBox.height/2,targetX=global.AttuGraph.Utils.nodePosition.x(edge.target)+targetBBox.width/2,targetY=global.AttuGraph.Utils.nodePosition.y(edge.target)+targetBBox.height/2;return d3SvgDiagonal({source:{x:sourceX,y:sourceY},target:{x:targetX,y:targetY}})}};var d3SvgDiagonal=d3.svg.diagonal().source(function(d){return{x:d.source.y,y:d.source.x}}).target(function(d){return{x:d.target.y,y:d.target.x}}).projection(function(d){return[d.y,d.x]}),getNodeShapeByType=(d3.svg.diagonal.radial().projection(function(d){return[d.y,d.x/180*Math.PI]}),function(nodeType){var res="";return"hub"==nodeType?res="hubActiveFullShape":"center"==nodeType&&(res="centerActiveFullShape"),res})}(this);