(function(){var callWithJQuery;(callWithJQuery=function(pivotModule){return"object"==typeof exports&&"object"==typeof module?pivotModule(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],pivotModule):pivotModule(jQuery)})(function($){return $.pivotUtilities.export_renderers={"TSV Export":function(pivotData,opts){var agg,colAttrs,colKey,colKeys,defaults,i,j,k,l,len,len1,len2,len3,len4,len5,m,n,r,result,row,rowAttr,rowAttrs,rowKey,rowKeys,text;for(defaults={localeStrings:{}},opts=$.extend(!0,{},defaults,opts),rowKeys=pivotData.getRowKeys(),0===rowKeys.length&&rowKeys.push([]),colKeys=pivotData.getColKeys(),0===colKeys.length&&colKeys.push([]),rowAttrs=pivotData.rowAttrs,colAttrs=pivotData.colAttrs,result=[],row=[],i=0,len=rowAttrs.length;len>i;i++)rowAttr=rowAttrs[i],row.push(rowAttr);if(1===colKeys.length&&0===colKeys[0].length)row.push(pivotData.aggregatorName);else for(j=0,len1=colKeys.length;len1>j;j++)colKey=colKeys[j],row.push(colKey.join("-"));for(result.push(row),k=0,len2=rowKeys.length;len2>k;k++){for(rowKey=rowKeys[k],row=[],l=0,len3=rowKey.length;len3>l;l++)r=rowKey[l],row.push(r);for(m=0,len4=colKeys.length;len4>m;m++)colKey=colKeys[m],agg=pivotData.getAggregator(rowKey,colKey),row.push(null!=agg.value()?agg.value():"");result.push(row)}for(text="",n=0,len5=result.length;len5>n;n++)r=result[n],text+=r.join("	")+"\n";return $("<textarea>").text(text).css({width:$(window).width()/2+"px",height:$(window).height()/2+"px"})}}})}).call(this);