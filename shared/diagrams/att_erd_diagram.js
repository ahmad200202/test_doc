!function(angular){var attErdDiagram=angular.module(window.AppName+".attErdDiagram",[]);attErdDiagram.directive("attErdDiagram",function(){return{restrict:"E",scope:{data:"=",showAttributes:"=?",clickFunc:"&"},template:'<div style="height:100%;width:100%;"> <svg id="graphContainer" width="100%" height="100%" class="attErdDiagram"></svg></div>',link:function(scope,element){scope.isFull=scope.showAttributes;var renderFunc=function(newVal,oldVal){if(0!=newVal.nodes.length||oldVal.nodes!=newVal.nodes){for(var renderContentFunc=scope.isFull?createTableEntity:createDiv,g=(new dagreD3.graphlib.Graph).setGraph({}),j=0;j<newVal.nodes.length;j++){g.setNode("node"+newVal.nodes[j].id,{labelType:"html",label:renderContentFunc(newVal.nodes[j]),paddingTop:0,paddingRight:0,paddingLeft:0,paddingBottom:0});for(var k=0;k<newVal.nodes[j].attributes.length;k++)newVal.nodes[j].attributes[k].type==DO.ACDataType.NotSupported&&g.setEdge("node"+newVal.nodes[j].id,"node"+newVal.nodes[j].attributes[k].id,{})}var render=new dagreD3.render,svg=d3.select(element[0]).select("#graphContainer");$(element[0]).find("#graphContainer").empty(),element.find("#graphWrapper").addClass("attErdDiagram");var svgGroup=svg.append("g"),zoom=d3.behavior.zoom().on("zoom",function(){svgGroup.attr("transform","translate("+d3.event.translate+")scale("+d3.event.scale+")")});svg.call(zoom),render(svgGroup,g),svgGroup.selectAll(".node button").on("click",function(){null!=scope.data&&"function"==typeof scope.data.onAttributeLineageFunc&&scope.data.onAttributeLineageFunc(d3.select(this).attr("node_id"))});var xCenterOffset=($(svg[0]).width()-g.graph().width)/2;svgGroup.attr("transform","translate("+xCenterOffset+", 20)")}};scope.$watch("data",renderFunc,!0)}}});var createTableEntity=function(entity){var div=$('<div class="entityTableHeader"><strong class="ellipsisStyle" style="float: left;width: 100%">'+entity.name.toUpperCase()+"</strong></div>");div.attr("title",entity.name.toUpperCase());for(var table=document.createElement("table"),i=0;i<entity.attributes.length;i++){var tempTr=d3.select(table).append("tr"),divWrap=tempTr.append("div"),lbl=divWrap.append("label");lbl.text(entity.attributes[i].name).attr("class","ellipsisStyle"),lbl.attr("title",entity.attributes[i].name);var btn=divWrap.append("button");btn.attr("node_id",entity.attributes[i].id),btn.attr("class","modal-attBtn ModelEditMarkStyle"),btn.append("span").attr("class","att-glyph icon-gl-Lineage")}var div2=$("<div></div>");return div2.append(div),div2.append(table),div2[0]},createDiv=function(entity){var div=$('<div class="entityTableHeader"><strong>'+entity.name.toUpperCase()+"</strong></div>");return div[0]}}(angular);