var BASIC_EXAMPLE_URL="http://localhost:9000/#/basic-example",BasicExamplePageNode=function(nodeLocation){function xpathStringForNodeAtPosition(nodeLocation){var xpathChunks=['//*[@id="tree-root"]'];return nodeLocation.forEach(function(index){xpathChunks.push(subnodesXpath+"["+index+"]")}),xpathChunks.join("/")}var subnodesXpath='ol/li[contains(@class,"angular-ui-tree-node")]',nodeHandlesLocator=by.css("[ui-tree-handle]"),nodeElement=element(by.xpath(xpathStringForNodeAtPosition(nodeLocation))),handle=nodeElement.all(nodeHandlesLocator).first();this.getElement=function(){return nodeElement},this.getHandle=function(){return handle},this.getText=function(){return handle.getText()},this.getSubnodes=function(){return nodeElement.all(by.xpath(subnodesXpath))}},BasicExamplePage=function(){this.get=function(){browser.get(BASIC_EXAMPLE_URL)},this.getRootNodes=function(){return element.all(by.repeater("node in data"))},this.getNodeAtPosition=function(){return new BasicExamplePageNode([].slice.call(arguments))}};module.exports=new BasicExamplePage;