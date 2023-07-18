!function(angular){"use strict";var stackedBarChartModule=angular.module("attStackedBarChart",[]);stackedBarChartModule.directive("attStackedBarChart",["attChartSelectionService","attChartOverlayService","GlobalEvents",function(AttChartSelectionService,AttChartOverlayService,GlobalEvents){return{restrict:"E",scope:{config:"=",data:"="},templateUrl:"scripts/angular.common/attCharts/attStackedBarChart/attStackedBarChart.html",link:function(scope,element){window.onresize=function(){return scope.$apply()};var self=this;scope.attStackedBarRender=function(data,config){if(data.length>0&&void 0!=data[0].size){var length=config.yAxisTitle.indexOf("(");config.yAxisTitle=config.yAxisTitle.substring(0,length)+"("+data[0].size+")"}var configObj=self.getDefaultConfig();$.extend(configObj,ObjectUtils.deepClone(config)),self.validateConfig(configObj);var selector=configObj.selector+" .attStackedBarChartChart",width=parseInt(configObj.width),height=parseInt(configObj.height),pad=configObj.padding,chart=d3.selectAll(selector);chart.selectAll("*").remove(),AttChartOverlayService.removeOverlay(scope,element);var svg=chart.append("svg:svg").attr("width",width).attr("height",height).append("svg:g");$(svg.node()).parent().width(width);AttChartUtils.addChartTitle(configObj,svg,height,width);if(!data||data.length<1)return void AttChartOverlayService.addOverlay(scope,element,width,height);AttChartUtils.sortArrayByAggregationLevel(data,"label","ascending");var stacks=self.transposeStackData(configObj,data),scaley=AttChartUtils.autoSelectScale(stacks,"y",height-pad[3],pad[1],!1,configObj.yIsTime,configObj.specialLabel),legendReturn=self.doLegend(configObj,pad,scaley,svg);pad=legendReturn.pad;var yreturn=self.doYAxis(configObj,scaley,width,height,pad,svg);pad=yreturn.pad;var xreturn=self.doXAxis(configObj,data,stacks,width,height,pad,svg,scaley);height=xreturn.height,self.doShapes(configObj,data,stacks,width,height,pad,scaley,xreturn.xscale,svg,xreturn.labelValues),configObj.addLegend&&AttChartUtils.adjustChartTitle(svg),d3.selectAll(configObj.selector+" svg").attr("width",width).attr("height",height).style("height",height+"px").style("width",width),d3.selectAll(configObj.selector+" svg g").attr("width",width).attr("height",height).style("height",height+"px").style("width",width),self.overrideLibs(svg,width,height),AttChartUtils.adjustResolutionSelector(element[0].parentElement.id,width,GlobalEvents)},scope.$watchGroup(["data","config"],function(newVals){return!newVals||newVals.length<1?scope.attStackedBarRender(newVals):scope.attStackedBarRender(newVals[0],newVals.length>1?newVals[1]:void 0)})},getDefaultConfig:function(){return{id:"att-stacked-bar-chart",selector:"",title:"",width:"500",height:"350",padding:[30,30,15,20],chartStack:[],xAxisTitle:"",yAxisTitle:"",zAxisTitle:"",yAxisRightTitle:"",xElement:"label",yElement:"value",yIsInt:!1,yIsTime:!1,yRightIsInt:!1,yRightIsTime:!1,addLegend:!1,legendClickable:!0,xAxisClickable:!0,xContiguous:!1,yContiguous:!1,clearChartSelections:!0,handleSelections:!0,handleLabelSelections:!0,specialLabel:"att-stacked-chart",showHorizontalRules:!1,showXLabelHover:!1,showXLabels:!0,"single-x-select":!1,"single-y-select":!1,"full-y-select":!1,groupingAttribute:"label",selectorCharts:[],selectedColor:AttChartUtils.getAttunityChartSelectionColor(),trendLineColor:AttChartUtils.getAttunityChartTrendLineColor(),colorScheme:AttChartUtils.getAttunityColorScheme(),selectedOpacity:AttChartUtils.getAttunityChartSelectedOpacity(),unselectedOpacity:AttChartUtils.getAttunityChartUnselectedOpacity(),bottomLabelFormatter:function(x){return x},tooltipFormatInfo:{yValueType:"",yValueDecorator:"",zVerbOrPreposition:"for",xVerbOrPreposition:"in"},metaDelimiter:"::",metaPreposition:"for"}},overrideLibs:function(svg,width,height){AttChartUtils.setD3Size(svg,width,height,!0),$(svg.node()).parent().css("display","inline-block")},validateConfig:function(configObj){return configObj?void(configObj.selector=(configObj.selector&&"string"==typeof configObj.selector?configObj.selector:"")+" .attStackedBarChartContainer"):void console.log("Error reading stacked bar chart configuration.")},selectBars:function(configObj,bars,isSelect){isSelect?bars.attr("selected","1").attr("pivotSelected","1").style("stroke",configObj.selectedColor).style("stroke-width","3px"):bars.attr("selected","0").attr("pivotSelected","0").style("stroke",function(){return d3.select(this).attr("data-fill")})},getColorIndex:function(arr,name){for(var i=0;i<arr.length;i++)if(arr[i]===name)return i;return console.log('getColorIndex: Could not find "'+name+'" in array'),0},transposeStackData:function(configObj,data){var self=this;return d3.layout.stack()(configObj.chartStack.map(function(attributeName){return data.map(function(d){var dataAmount="undefined"==typeof d[attributeName]?0:+d[attributeName];return{x:d[configObj.groupingAttribute],y:dataAmount/("undefined"==typeof d.total?1:d.total),orig:d[attributeName],colorIndex:self.getColorIndex(configObj.chartStack,attributeName)}})}))},doShapes:function(configObj,data,stacks,width,height,pad,scaley,xscale,svg,labelValues){var specialLabel=configObj.specialLabel,colorScheme=configObj.colorScheme,chartStack=configObj.chartStack,origChartStack=configObj.origChartStack,hasOrigStack=origChartStack&&origChartStack.length>0?!0:!1,cause=svg.selectAll("g."+specialLabel+"-attribute").data(stacks).enter().append("svg:g").attr("class",function(d,i){return specialLabel+"-attribute "+specialLabel+" "+specialLabel+"-"+chartStack[i]}).attr("categoryNum",function(d,i){return i}).attr("category",function(d,i){return chartStack[i]}).attr("categoryOrig",function(d,i){return hasOrigStack?origChartStack[i]:""}),xfunc=function(x1,x2,dataLength){return 1==dataLength?function(){return x1+(x2-x1)/2-Math.min.apply(null,[xscale.rangeBand(),100])/2}:function(d){return xscale(d.x)}}(pad[0],width-pad[2],labelValues.length),self=this,barCount=0,rect=cause.selectAll("rect").data(Object).enter().append("svg:rect").attr("x",xfunc).attr("y",function(d){return scaley.scale((d.y0+d.y)/scaley.factor)}).attr("height",function(d){return scaley.scale(0)-scaley.scale(d.y/scaley.factor)}).attr("width",Math.min.apply(null,[xscale.rangeBand(),100])).attr("selected",0).attr("pivotSelected",0).attr("selector",configObj.selector).attr("selection-id",function(){return"attStackedBarChart-bar-"+barCount++}).attr("category",function(){return d3.select(this.parentNode).attr("category")}).attr("categoryNum",function(){return d3.select(this.parentNode).attr("categoryNum")}).attr("xBar",function(d){return d.x}).attr("xBarNum",function(d,i){return i}).attr("fill",function(d){return colorScheme[d.colorIndex]}).style("stroke",function(d){return colorScheme[d.colorIndex]}).style("stroke-width","1px").attr("data-fill",function(d){return colorScheme[d.colorIndex]}).attr("pivotData",function(d){var pivotPoint={};return configObj.xPivotFilterName&&(pivotPoint[configObj.xPivotFilterName]=d3.select(this).attr("xBar")),configObj.yPivotFilterName&&(pivotPoint[configObj.yPivotFilterName]=d.orig),configObj.pivotField&&(pivotPoint[configObj.pivotField]=configObj.pivotAttribute?d[configObj.pivotAttribute]:d3.select(this).attr("category")),AttChartUtils.buildChartPivots(pivotPoint)}).style("cursor","pointer").on("mouseover",function(d){var category=d3.select(this.parentNode).attr("category"),hasMeta=category.indexOf(configObj.metaDelimiter)>-1;if(hasMeta){var parts=category.split(configObj.metaDelimiter);parts.length>1&&(category=parts[1]+" ("+configObj.metaPreposition+" "+parts[0]+")")}d.category=category;var origCategory="";null!==d3.select(this.parentNode).attr("categoryOrig")&&d3.select(this.parentNode).attr("categoryOrig")!==d3.select(this.parentNode).attr("category")&&(origCategory=" ["+d3.select(this.parentNode).attr("categoryOrig")+"]"),d.origCategory=origCategory,d.yAxisTitle=configObj.yAxisTitle,d.xAxisTitle=configObj.xAxisTitle,d.yLabelFormatter=configObj.yLabelFormatter,AttChartUtils.getPowertip(this,AttChartUtils.getTooltipLines(d,configObj.tooltipFormatInfo,"orig"))}).on("mouseout",function(){AttChartUtils.hideAllPowertips()});self.addBarClickMethod(configObj,rect),cause.selectAll("rect[height='0']").remove(),d3.select(configObj.selector+" svg").attr("width",width).attr("height",height)},doXAxis:function(configObj,data,stacks,width,height,pad,svg,scaley){var chartWidth=width-pad[2],xscale=d3.scale.ordinal().rangeRoundBands([pad[0],chartWidth],.2),xDomainValues=stacks[0].map(function(d){return d.x});xscale.domain(xDomainValues);var xDomainFormatted=stacks[0].map(function(d){return configObj.bottomLabelFormatter(d.x)}),rotationInfo=AttChartUtils.getLabelRotationInfo(xDomainFormatted,xscale,void 0,void 0,configObj.selector),rotateLabels=rotationInfo.shouldRotate,xLabelHeight=configObj.showXLabels?rotateLabels?rotationInfo.rotatedPixelHeight+10:15:10;configObj.xAxisTitle&&configObj.xAxisTitle.length>0&&(xLabelHeight+=20),height+=xLabelHeight,height=AttChartUtils.drawXAxisTitle(svg,configObj.xAxisTitle,1,pad[0]+(chartWidth-pad[0])/2,height,scaley.scale(0)+xLabelHeight,!1),d3.selectAll(configObj.selector+" svg").attr("width",width).attr("height",height).style("height",height+"px").style("width",width),d3.selectAll(configObj.selector+" svg g").attr("width",width).attr("height",height).style("height",height+"px").style("width",width);var labelValues=AttChartUtils.clearExtraLabels(configObj.selector,xDomainValues,chartWidth-pad[0]),text_xcenter=function(x1,x2,dataLength){return 1==dataLength?function(){return x1+(x2-x1)/2}:function(d){return xscale(d)+Math.min.apply(null,[xscale.rangeBand(),100])/2}}(pad[0],chartWidth,labelValues.length),label=svg.selectAll("nothing").data(configObj.showXLabels?labelValues:[]).enter().append("svg:text").attr("text-anchor",rotateLabels?"end":"middle").attr("dx",rotateLabels?"-.28em":"0").attr("dy",rotateLabels?".25em":".71em").attr("selected",0).attr("xBar",function(x){return x}).attr("transform",function(d){return 0===d||d?"translate("+text_xcenter(d)+", "+(scaley.scale(0)+6)+") rotate("+(rotateLabels?-65:0)+",0,0)":void 0}).text(configObj.bottomLabelFormatter).style("cursor","pointer").on("click",function(){if(configObj.xAxisClickable){var xBar=d3.select(this).attr("xBar"),rect=d3.select(configObj.selector).selectAll("rect[xBar='"+xBar+"']"),xNum=rect.attr("xBarNum"),selected=1==rect.attr("selected")?0:1;if(selected){rect.attr("selected",1).attr("pivotSelected",1);var selectedAdjacents=d3.select(configObj.selector).selectAll("rect[selected='1']"),minNum=xNum,maxNum=xNum;selectedAdjacents[0].length>1&&configObj.xContiguous&&(minNum=d3.min(selectedAdjacents[0],function(d){return+d3.select(d).attr("xBarNum")}),maxNum=d3.max(selectedAdjacents[0],function(d){return+d3.select(d).attr("xBarNum")})),configObj.handleLabelSelections;for(var j=parseInt(minNum);j<=parseInt(maxNum);j++)d3.select(configObj.selector).selectAll("rect[xBarNum='"+j+"']").attr("selected","1").attr("pivotSelected","1").style("stroke",configObj.selectedColor).style("stroke-width","3px")}else d3.select(configObj.selector).selectAll("rect[selected='1']").attr("selected",0).attr("pivotSelected",0).style("fill",d3.select(this).attr("data-fill")).style("stroke",function(d){return configObj.colorScheme[d.colorIndex]}).style("stroke-width","1px");configObj.handleSelections&&AttChartSelectionService.notifyChartsSelected("attStackedBarChart; label selection")}});return configObj.showXLabelHover&&label.append("svg:title").text(function(d,i){return stacks[0][i].x}),{xscale:xscale,height:height,labelValues:labelValues}},doYAxis:function(configObj,scaley,width,height,pad,svg){var ymin=scaley.min,ymax=scaley.max,yfactor=scaley.factor,yscale=scaley.scale;AttChartUtils.drawYAxisTitle(svg,configObj.yAxisTitle,void 0,yfactor,height,pad,configObj.yIsTime);var yticks=yscale.ticks(configObj.yIsInt&&1==yfactor&&10>ymax-ymin?ymax-ymin:10),yLabelFormatter=AttChartUtils.formatTicks(yticks);pad[0]+=AttChartUtils.getPaddingSpaceForAxis(yticks,yLabelFormatter);var yrule=svg.selectAll("g.rule").data(yticks).enter().append("svg:g").attr("class","rule").attr("text-anchor","end").attr("transform",function(d){return"translate(0,"+yscale(d)+")"}),horizLines=yrule.append("svg:line").attr("x1",pad[0]).attr("x2",width-pad[2]);return configObj.showHorizontalRules&&horizLines.style("stroke",function(){return"#000"}).style("stroke-opacity",function(d){return d?.3:null}),yrule.append("svg:text").attr("x",pad[0]-10).attr("dy",".35em").attr("text-anchor","end").text(function(d){return yLabelFormatter(d)}),{pad:pad}},doLegend:function(configObj,pad,scaley,svg){if(configObj.addLegend){for(var chartStack=configObj.chartStack,legendStack=[],i=0;i<chartStack.length;i++){var y=scaley.scale(0)+-20*(i+1);if(!(y>0))break;legendStack.push(chartStack[i])}pad[0]+=AttChartUtils.getChartsLegendSize();var theLegend=svg.selectAll(".legend").data(legendStack).enter().append("g").attr("class","legend").attr("transform",function(d,i){return"translate(0,"+(scaley.scale(0)+-20*(i+1))+")"}),rects=theLegend.append("rect").attr("x",pad[0]-30).attr("width",18).attr("height",18).attr("selected",0).attr("legend","1").attr("data-fill",function(d,i){return configObj.colorScheme[i]}).attr("category",function(d,i){return chartStack[i]}).style("fill",function(d,i){return configObj.colorScheme[i]}).style("cursor",function(){return configObj.legendClickable?"pointer":"default"});this.addLegendClickMethod(configObj,rects);var maxStringLength=AttChartUtils.getChartsMaxTextLength();theLegend.append("text").attr("x",pad[0]-35).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(d,i){var hasMeta=chartStack[i].indexOf(configObj.metaDelimiter)>-1,text=chartStack[i];if(hasMeta){var parts=text.split(configObj.metaDelimiter);parts.length>1&&(text=parts[1])}return Utils.shortenText(text,maxStringLength,!0)}).on("mouseover",function(d,i){var hasMeta=chartStack[i].indexOf(configObj.metaDelimiter)>-1,text=chartStack[i];if(hasMeta){var parts=text.split(configObj.metaDelimiter);parts.length>1&&(text=parts[1]+" ("+configObj.metaPreposition+" "+parts[0]+")")}AttChartUtils.getPowertip(this,[text])})}return{pad:pad}},addLegendClickMethod:function(configObj,legendRects){var self=this,clickMethod=function(){if(configObj.legendClickable){var selected=1==d3.select(this).attr("selected")?0:1;if(configObj["full-y-select"])self.selectBars(configObj,d3.select(configObj.selector).selectAll("rect[xBar]"),selected);else{var xBar=d3.select(this).attr("category");self.clearBarSelections(configObj);var allCategoryBars=d3.select(configObj.selector).selectAll("rect[xBar][category='"+xBar+"']");self.selectBars(configObj,allCategoryBars,selected),allCategoryBars.attr("pivotData",function(d){var pivotPoint={};return configObj.xPivotFilterName&&(pivotPoint[configObj.xPivotFilterName]=d3.select(this).attr("xBar")),configObj.yPivotFilterName&&(pivotPoint[configObj.yPivotFilterName]=d.orig),configObj.pivotField&&(pivotPoint[configObj.pivotField]=configObj.pivotAttribute?d[configObj.pivotAttribute]:d3.select(this).attr("category")),AttChartUtils.buildChartPivots(pivotPoint)})}d3.select(this).attr("selected",selected),AttChartSelectionService.notifyChartsSelected("attStackedBarChart; legend selection")}};legendRects.on("click",clickMethod)},addBarClickMethod:function(configObj,bars){var self=this,clickMethod=function(d,i){var selectedBars,selected=0==d3.select(this).attr("selected")?1:0;if(selectedBars=d3.select(configObj.selector).selectAll(configObj["single-x-select"]?"rect[selected='2']":"rect[selected='1']"),d3.select(configObj.selector).selectAll("rect[legend='1']").attr("selected",0),d3.select(configObj.selector).selectAll("text[selected='1']").attr("selected",0),configObj.handleSelections&&self.clearBarSelections(configObj),selected){if(configObj["full-y-select"]){configObj.handleSelections&&(self.clearBarSelections(configObj),self.selectBars(configObj,selectedBars,!0));var xBarNum=d3.select(this).attr("xBarNum");if(self.selectBars(configObj,d3.select(configObj.selector).selectAll("rect[xBarNum='"+xBarNum+"']"),!0),configObj.xContiguous){var axisVarRev="xBar",selectedBars=d3.select(configObj.selector).selectAll("rect[selected='1']");if(selectedBars[0].length>1){var minNum=d3.min(selectedBars[0],function(d){return+d3.select(d).attr(axisVarRev+"Num")}),maxNum=d3.max(selectedBars[0],function(d){return+d3.select(d).attr(axisVarRev+"Num")});selectionsCleared=!0;for(var j=parseInt(minNum);j<=parseInt(maxNum);j++)d3.select(configObj.selector).selectAll("rect["+axisVarRev+"Num='"+j+"']").attr("selected","1").attr("pivotSelected","1").style("stroke",configObj.selectedColor).style("stroke-width","3px")}}}else{self.selectBars(configObj,d3.select(this),!0),self.selectBars(configObj,selectedBars,!0);var xBar=d3.select(this).attr("xBar"),category=d3.select(this).attr("category"),selectionsCleared=!1;d3.select(configObj.selector).selectAll("rect[selected='1']").each(function(){var xBar2=d3.select(this).attr("xBar"),category2=d3.select(this).attr("category");xBar2==xBar&&!configObj["single-y-select"]||category2==category||self.selectBars(configObj,d3.select(this),!1)});for(var axisVars=["xBar","category"],contiguousAxis=["yContiguous","xContiguous"],i=0;i<axisVars.length;i++){var axisVar=axisVars[i],axisVarValue=d3.select(this).attr(axisVar),axisVarRev=axisVars[axisVars.length-i-1],selectedAdjacents=d3.select(configObj.selector).selectAll("rect[selected='1']["+axisVar+"='"+axisVarValue+"']");if(selectedAdjacents[0].length>1&&configObj[contiguousAxis[i]]){var minNum=d3.min(selectedAdjacents[0],function(d){return+d3.select(d).attr(axisVarRev+"Num")}),maxNum=d3.max(selectedAdjacents[0],function(d){return+d3.select(d).attr(axisVarRev+"Num")});self.clearBarSelections(configObj),selectionsCleared=!0;for(var j=parseInt(minNum);j<=parseInt(maxNum);j++){var elements=d3.select(configObj.selector).select("rect["+axisVarRev+"Num='"+j+"']["+axisVar+"='"+axisVarValue+"']");self.selectBars(configObj,elements,!0)}}}}if(!selectionsCleared)if(configObj["full-y-select"]){var xBarNum=d3.select(this).attr("xBarNum");self.selectBars(configObj,d3.select(configObj.selector).selectAll("rect[xBarNum='"+xBarNum+"']"),!0)}else self.selectBars(configObj,d3.select(this),selected)}else configObj.handleSelections?self.clearBarSelections(configObj):configObj.handleSelections||self.selectBars(configObj,d3.select(configObj.selector).selectAll("rect[selected='1']"),!1);AttChartSelectionService.notifyChartsSelected("attStackedBarChart; bar selection")};bars.on("click",clickMethod)},clearBarSelections:function(configObj){d3.select(configObj.selector).selectAll("text").attr("selected",0),d3.select(configObj.selector).selectAll("rect").attr("selected",0).attr("pivotSelected",0).style("stroke",function(){return d3.select(this).attr("data-fill")}).style("stroke-width","1px")}}}])}(angular);