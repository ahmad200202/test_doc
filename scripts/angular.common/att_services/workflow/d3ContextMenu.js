!function(global){global.AttuGraph=global.AttuGraph||{},global.AttuGraph.contextMenu=function(opts){this.openCallback=null,this.closeCallback=null,this.create=function(){"function"==typeof opts?this.openCallback=opts:(opts=opts||{},this.openCallback=opts.onOpen,this.closeCallback=opts.onClose),d3.selectAll(".d3-context-menu").data([1]).enter().append("div").attr("class","d3-context-menu"),d3.select("body").on("click.d3-context-menu",function(){d3.select(".d3-context-menu").style("display","none"),this.closeCallback&&this.closeCallback()})};var self=this;this.show=function(menu,data,index){var elm=this;self.createContextMenuElements(menu,data,index,elm),self.openCallback&&self.openCallback(data,index)===!1||(d3.event.preventDefault(),d3.event.stopPropagation())},this.createContextMenuElements=function(menu,data,index,elm){d3.selectAll(".d3-context-menu").html("");var list=d3.selectAll(".d3-context-menu").append("ul");list.selectAll("li").data("function"==typeof menu?menu(data):menu).enter().append("li").html(function(d){return"string"==typeof d.title?d.title:d.title(data)}).on("click",function(d){d.action(elm,data,index),d3.select(".d3-context-menu").style("display","none"),self.closeCallback&&self.closeCallback()}).on("mouseenter",function(d){return d.children&&d.children.length>0?(d3.select(this).selectAll("ul").remove(),void d3.select(this).append("ul").selectAll("li").data(d.children).enter().append("li").html(function(d){return"string"==typeof d.title?d.title:d.title(data)}).on("click",function(d){d.action(elm,data,d.ctxData),d3.select(".d3-context-menu").style("display","none"),d3.event.preventDefault(),d3.event.stopPropagation()})):!1}).on("mouseleave",function(d){d.children&&d.children.length>0&&d3.select(this).selectAll("ul").style("display","none")}),d3.select(".d3-context-menu").style("left",d3.event.pageX-2+"px").style("top",d3.event.pageY-2+"px").style("display","block")}}}(this);