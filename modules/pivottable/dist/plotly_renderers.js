(function(){var callWithJQuery;(callWithJQuery=function(pivotModule){return"object"==typeof exports&&"object"==typeof module?pivotModule(require("jquery"),require("plotly.js")):"function"==typeof define&&define.amd?define(["jquery","plotly.js"],pivotModule):pivotModule(jQuery,Plotly)})(function($,Plotly){var makePlotlyChart,makePlotlyScatterChart;return makePlotlyChart=function(traceOptions,layoutOptions,transpose){return null==traceOptions&&(traceOptions={}),null==layoutOptions&&(layoutOptions={}),null==transpose&&(transpose=!1),function(pivotData,opts){var colKeys,columns,d,data,datumKeys,defaults,fullAggName,groupByTitle,hAxisTitle,i,layout,result,rowKeys,rows,titleText,traceKeys;if(defaults={localeStrings:{vs:"vs",by:"by"},plotly:{},plotlyConfig:{}},opts=$.extend(!0,{},defaults,opts),rowKeys=pivotData.getRowKeys(),colKeys=pivotData.getColKeys(),traceKeys=transpose?colKeys:rowKeys,0===traceKeys.length&&traceKeys.push([]),datumKeys=transpose?rowKeys:colKeys,0===datumKeys.length&&datumKeys.push([]),fullAggName=pivotData.aggregatorName,pivotData.valAttrs.length&&(fullAggName+="("+pivotData.valAttrs.join(", ")+")"),data=traceKeys.map(function(traceKey){var datumKey,j,labels,len,trace,val,values;for(values=[],labels=[],j=0,len=datumKeys.length;len>j;j++)datumKey=datumKeys[j],val=parseFloat(pivotData.getAggregator(transpose?datumKey:traceKey,transpose?traceKey:datumKey).value()),values.push(isFinite(val)?val:null),labels.push(datumKey.join("-")||" ");return trace={name:traceKey.join("-")||fullAggName},"pie"===traceOptions.type?(trace.values=values,trace.labels=labels.length>1?labels:[fullAggName]):(trace.x=transpose?values:labels,trace.y=transpose?labels:values),$.extend(trace,traceOptions)}),transpose?(hAxisTitle=pivotData.rowAttrs.join("-"),groupByTitle=pivotData.colAttrs.join("-")):(hAxisTitle=pivotData.colAttrs.join("-"),groupByTitle=pivotData.rowAttrs.join("-")),titleText=fullAggName,""!==hAxisTitle&&(titleText+=" "+opts.localeStrings.vs+" "+hAxisTitle),""!==groupByTitle&&(titleText+=" "+opts.localeStrings.by+" "+groupByTitle),layout={title:titleText,hovermode:"closest",width:window.innerWidth/1.4,height:window.innerHeight/1.4-50},"pie"===traceOptions.type){columns=Math.ceil(Math.sqrt(data.length)),rows=Math.ceil(data.length/columns),layout.grid={columns:columns,rows:rows};for(i in data)d=data[i],d.domain={row:Math.floor(i/columns),column:i-columns*Math.floor(i/columns)},data.length>1&&(d.title=d.name);1===data[0].labels.length&&(layout.showlegend=!1)}else layout.xaxis={title:transpose?fullAggName:null,automargin:!0},layout.yaxis={title:transpose?null:fullAggName,automargin:!0};return result=$("<div>").appendTo($("body")),Plotly.newPlot(result[0],data,$.extend(layout,layoutOptions,opts.plotly),opts.plotlyConfig),result.detach()}},makePlotlyScatterChart=function(){return function(pivotData,opts){var colKey,colKeys,data,defaults,j,k,layout,len,len1,renderArea,result,rowKey,rowKeys,v;for(defaults={localeStrings:{vs:"vs",by:"by"},plotly:{},plotlyConfig:{}},opts=$.extend(!0,{},defaults,opts),rowKeys=pivotData.getRowKeys(),0===rowKeys.length&&rowKeys.push([]),colKeys=pivotData.getColKeys(),0===colKeys.length&&colKeys.push([]),data={x:[],y:[],text:[],type:"scatter",mode:"markers"},j=0,len=rowKeys.length;len>j;j++)for(rowKey=rowKeys[j],k=0,len1=colKeys.length;len1>k;k++)colKey=colKeys[k],v=pivotData.getAggregator(rowKey,colKey).value(),null!=v&&(data.x.push(colKey.join("-")),data.y.push(rowKey.join("-")),data.text.push(v));return layout={title:pivotData.rowAttrs.join("-")+" vs "+pivotData.colAttrs.join("-"),hovermode:"closest",xaxis:{title:pivotData.colAttrs.join("-"),automargin:!0},yaxis:{title:pivotData.rowAttrs.join("-"),automargin:!0},width:window.innerWidth/1.5,height:window.innerHeight/1.4-50},renderArea=$("<div>",{style:"display:none;"}).appendTo($("body")),result=$("<div>").appendTo(renderArea),Plotly.newPlot(result[0],[data],$.extend(layout,opts.plotly),opts.plotlyConfig),result.detach(),renderArea.remove(),result}},$.pivotUtilities.plotly_renderers={"Horizontal Bar Chart":makePlotlyChart({type:"bar",orientation:"h"},{barmode:"group"},!0),"Horizontal Stacked Bar Chart":makePlotlyChart({type:"bar",orientation:"h"},{barmode:"relative"},!0),"Bar Chart":makePlotlyChart({type:"bar"},{barmode:"group"}),"Stacked Bar Chart":makePlotlyChart({type:"bar"},{barmode:"relative"}),"Line Chart":makePlotlyChart(),"Area Chart":makePlotlyChart({stackgroup:1}),"Scatter Chart":makePlotlyScatterChart(),"Multiple Pie Chart":makePlotlyChart({type:"pie",scalegroup:1,hoverinfo:"label+value",textinfo:"none"},{},!0)}})}).call(this);