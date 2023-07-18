function getRelated(ids,callback,errback){var overlapping_url="overlapping/"+ids,xhr=new XMLHttpRequest;xhr.open("GET",overlapping_url,!0),xhr.onreadystatechange=function(){if(4==xhr.readyState)if(xhr.status=200)try{var json=JSON.parse(xhr.responseText);callback(json)}catch(e){errback(e)}else errback(xhr)},xhr.send(null)}function getTags(ids,callback,errback){var tags_url="tags/"+ids,xhr=new XMLHttpRequest;xhr.open("GET",tags_url,!0),xhr.onreadystatechange=function(){if(4==xhr.readyState)if(xhr.status=200)try{var json=JSON.parse(xhr.responseText);callback(json)}catch(e){errback(e)}else errback(xhr)},xhr.send(null)}function getGCReports(ids,callback,errback){var gcReportsReceivedCallback=function(data){for(var GCReportsByProcess={},i=0;i<data.length;i++)for(var reports=data[i].reports,j=0;j<reports.length;j++){var report=reports[j];if(report.Operation&&"GC"==report.Operation[0]){var processID=report.ProcessID[0];GCReportsByProcess[processID]?GCReportsByProcess[processID].push(report):GCReportsByProcess[processID]=[report]}}callback(GCReportsByProcess)},tagsReceivedCallback=function(tagdata){var GCTasks=[];for(var taskid in tagdata){var tags=tagdata[taskid];-1!=tags.indexOf("GC")&&GCTasks.push(taskid)}GCTasks.length>0?getReports(GCTasks.join(","),gcReportsReceivedCallback,errback):callback({})},relatedIDsReceivedCallback=function(ids){console.log("Searching for GC data in ids: "+ids.join(",")),getTags(ids.join(","),tagsReceivedCallback,errback)};getRelated(ids,relatedIDsReceivedCallback,errback)}function hash_report(report){return hash=0,report.Agent&&(hash+=("Agent:"+report.Agent[0]).hashCode()),report.Label&&(hash+=("Label:"+report.Label[0]).hashCode()),report.Class&&(hash+=("Class:"+report.Class[0]).hashCode()),hash&hash}window.width=function(){return document.body.clientWidth},window.height=function(){return document.body.clientHeight};var getParameter=function(name){name=name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var regexS="[\\?&]"+name+"=([^&#]*)",regex=new RegExp(regexS),results=regex.exec(window.location.href);return null==results?"":results[1]},getParameters=function(){if(-1==window.location.href.indexOf("?"))return{};var param_strs=window.location.href.substr(window.location.href.indexOf("?")+1).split("&"),params={};return param_strs.forEach(function(str){splits=str.split("="),2==splits.length&&(params[splits[0]]=splits[1])}),params},getReports=function(ids_str,callback,errback){null==ids_str&&errback("No IDs specified");var i=0,batch_size=20;ids=ids_str.split(","),json_ids=[],regular_ids=[];for(var i=0;i<ids.length;i++){var id=ids[i];-1!=id.indexOf(".json")?json_ids.push(id):regular_ids.push(id)}var results=[],jsondone=!1,batchdone=!1,batch_callback=function(json){results=results.concat(json),i++,0==regular_ids.length?(batchdone=!0,jsondone&&batchdone&&callback(results)):(next_request_ids=regular_ids.splice(0,batch_size),console.info("Retrieving batch "+i+":",next_request_ids),getAllReports(next_request_ids.join(),batch_callback,errback))},json_fecthing_id=null,json_batch_callback=function(json){1==json.length&&(json[0].id=json_fecthing_id),results=results.concat(json),0==json_ids.length?(jsondone=!0,jsondone&&batchdone&&callback(results)):(json_fecthing_id=json_ids.splice(0,1),d3.json(json_fecthing_id,json_batch_callback),console.info("Retrieving JSON file "+id))};batch_callback([]),json_batch_callback([])},getAllReports=function(ids,callback,errback){var report_url="reports/"+ids,xhr=new XMLHttpRequest;xhr.open("GET",report_url,!0),xhr.onreadystatechange=function(){if(4==xhr.readyState)if(xhr.status=200){var json=JSON.parse(xhr.responseText);json.forEach(function(trace){sanitizeReports(trace.reports)}),callback(json)}else errback(xhr.status,xhr)},xhr.send(null)},sanitizeReports=function(reports){for(var i=0;i<reports.length;){var report=reports[i];report.hasOwnProperty("node_id")&&report.hasOwnProperty("children")&&1!=!report.node_id.length&&report.children.hasOwnProperty("length")?i++:(reports.splice(i,1),console.warn("Got a bad report:",report))}return reports},createGraphFromReports=function(reports,params){this.show_console_logs&&console.log("Creating graph from DATA"),params.hideagent&&(this.show_console_logs&&console.info("Hiding agent",params.hideagent,"in",reports.length,"reports"),reports=filter_agent_reports(reports,params.hideagent)),this.show_console_logs&&console.info("Removing 'merge' operations in",reports.length,"reports"),reports=filter_merge_reports(reports),params.mapreduceonly&&(this.show_console_logs&&console.info("Filtering mapreduce reports in",reports.length,"reports"),reports=filter_yarnchild_reports(reports)),this.show_console_logs&&console.info("Creating graph nodes");for(var nodes={},i=0;i<reports.length;i++){var report=reports[i];report.hasOwnProperty("node_id")||this.show_console_logs&&console.error("Bad report found with no ID:",report);var id=report.node_id;nodes[id]=new Node(id),nodes[id].report=report}this.show_console_logs&&console.info("Linking graph nodes");for(var nodeid in nodes){var node=nodes[nodeid];node.report.children.forEach(function(parentid){nodes[parentid]&&(nodes[parentid].addChild(node),node.addParent(nodes[parentid]))})}var graph=new Graph;for(var id in nodes)graph.addNode(nodes[id]);return this.show_console_logs&&console.log("Done creating graph from reports"),graph},createJSONFromVisibleGraph=function(graph){for(var nodes=graph.getVisibleNodes(),reports=[],i=0;i<nodes.length;i++){var node=nodes[i],parents=node.getVisibleParents(),report=$.extend({},node.report);report.children=[];for(var j=0;j<parents.length;j++)report.children.push(parents[j].id);reports.push(report)}return{reports:reports}};String.prototype.hashCode=function(){var i,char,hash=0;if(0==this.length)return hash;for(i=0;i<this.length;i++)char=this.charCodeAt(i),hash=(hash<<5)-hash+char,hash&=hash;return hash};var filter_yarnchild_reports=function(reports){for(var yarnchild_process_ids={},i=0;i<reports.length;i++){var report=reports[i];!report.hasOwnProperty("Agent")||"YarnChild"!=report.Agent[0]&&"Hadoop Job"!=report.Agent[0]||(yarnchild_process_ids[report.ProcessID[0]]=!0)}var filter=function(report){return yarnchild_process_ids[report.ProcessID[0]]?!1:!0};return filter_reports(reports,filter)},filter_merge_reports=function(reports){var filter=function(report){return report.Operation&&"merge"==report.Operation[0]};return filter_reports(reports,filter)},filter_agent_reports=function(reports,agent){var filter=function(report){return report.Agent&&report.Agent[0]==agent};return filter_reports(reports,filter)},filter_reports=function(reports,f){for(var retained={},removed={},reportmap={},i=0;i<reports.length;i++){var report=reports[i],id=report.node_id;reportmap[id]=report,f(report)?removed[id]=report:retained[id]=report}var remapped={},remap_parents=function(id){if(!remapped[id]){for(var report=reportmap[id],parents=report.children,newparents={},i=0;i<parents.length;i++)removed[parents[i]]?(remap_parents(parents[i]),reportmap[parents[i]].children.forEach(function(grandparent){newparents[grandparent]=!0})):newparents[parents[i]]=!0;report.children=Object.keys(newparents),remapped[id]=!0}};return Object.keys(retained).map(function(id){return remap_parents(id),retained[id]})},kernelgraph_for_trace=function(trace){return KernelGraph.fromJSON(trace)},yarnchild_kernelgraph_for_trace=function(trace){return trace.reports=filter_yarnchild_reports(trace.reports),trace.reports=filter_merge_reports(trace.reports),kernelgraph_for_trace(trace)},report_id=function(report){return report.node_id},critical_path=function(reports,finalreport){null==finalreport&&(finalreport=reports[reports.length-1]);for(var reportmap={},i=0;i<reports.length;i++)reportmap[report_id(reports[i])]=reports[i];console.log(reportmap);for(var cpath=[],next=finalreport;next&&next.children;){cpath.push(next);var parents=next.children;next=reportmap[parents[0]];for(var i=1;null==next&&i<parents.length;i++)next=reportmap[parents[i]];for(var i=1;i<parents.length;i++){var candidate=reportmap[parents[i]];reportmap[parents[i]]&&Number(candidate.Timestamp[0])>Number(next.Timestamp[0])&&(next=candidate)}}for(var i=0;i<cpath.length;i++)cpath[i].criticalpath=["true"];return cpath};