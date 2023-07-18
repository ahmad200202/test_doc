!function(angular){"use strict";var attLoader=angular.module("attGlobalLoader",[]);attLoader.factory("AttLoaderService",["$injector","$rootScope",function($injector,$rootScope){var $attModelService=null,$compileService=null,attLoaderService={data:{},show_loader:function(loader_type,loader_text,mode,hide_overlay,cssClass){loader_type=loader_type||"ball-clip-rotate-multiple",loader_text=loader_text||"",mode=mode||"BOTH",cssClass=cssClass||"",$attModelService=$attModelService||$injector.get("modalService");var activeModal=$attModelService.getActiveModalElement();if($compileService=$compileService||$injector.get("$compile"),!activeModal||"BOTH"!=mode&&"MODAL"!=mode){if("BOTH"==mode||"BODY"==mode){var $body=$("body");$body.find(".loader").remove(),$body.find("#loaderDiv").remove(),loaderScope=$rootScope.$new(),1==hide_overlay?$body.prepend('<div style="top:40px; background-color: transparent; opacity: 0" id="loaderDiv"></div>').append($compileService('<att-loader loader-type="'+loader_type+'" loader-text=" '+loader_text+' "></att-loader>')(loaderScope)):$body.prepend('<div style="top:40px;" id="loaderDiv" class='+cssClass+"></div>").append($compileService('<att-loader loader-type="'+loader_type+'" loader-text=" '+loader_text+' "></att-loader>')(loaderScope))}}else{activeModal=$(activeModal);var loaderDirective=activeModal.find(".loader"),loaderScope=null;loaderDirective.length>0?loaderScope=angular.element(loaderDirective[0]).scope():activeModal.find(".modal-body").length>0&&(loaderScope=$rootScope.$new(),1==hide_overlay?activeModal.find(".modal-body").prepend('<div style="top:40px;background-color: transparent; opacity: 0" id="loaderDiv"></div>').append($compileService('<att-loader loader-type="'+loader_type+'" loader-text=" '+loader_text+' "></att-loader>')(loaderScope)):activeModal.find(".modal-body").prepend('<div style="top:40px;" id="loaderDiv"></div>').append($compileService('<att-loader loader-type="'+loader_type+'" loader-text=" '+loader_text+' "></att-loader>')(loaderScope)))}},hide_loader:function(ignore_selector){ignore_selector?($("body").find(".loader").not(ignore_selector).remove(),$("body").find("#loaderDiv").not(ignore_selector).remove()):($("body").find(".loader").remove(),$("body").find("#loaderDiv").remove())}};return attLoaderService}]),attLoader.directive("attLoader",function(){return{restrict:"E",replace:!0,scope:{loaderType:"@",loaderText:"@",loaderTextClass:"@",customClass:"@"},template:'<div class="{{customClass}}"><div class="loader-inner"></div> <span class="spinnerText"></span> </div>',link:function(scope,element){function addLoader(){var divsArr=[];switch(scope.loaderType){case"ball-pulse":divsArr=addDivs(3);break;case"ball-grid-pulse":divsArr=addDivs(9);break;case"ball-clip-rotate":divsArr=addDivs(1);break;case"ball-clip-rotate-pulse":divsArr=addDivs(2);break;case"square-spin":divsArr=addDivs(1);break;case"ball-clip-rotate-multiple":divsArr=addDivs(3);break;case"ball-pulse-rise":divsArr=addDivs(5);break;case"ball-rotate":divsArr=addDivs(1);break;case"cube-transition":divsArr=addDivs(2);break;case"ball-zig-zag":divsArr=addDivs(2);break;case"ball-zig-zag-deflect":divsArr=addDivs(2);break;case"ball-triangle-path":divsArr=addDivs(3);break;case"ball-scale":divsArr=addDivs(1);break;case"line-scale":divsArr=addDivs(5);break;case"line-scale-party":divsArr=addDivs(4);break;case"ball-scale-multiple":divsArr=addDivs(3);break;case"ball-pulse-sync":divsArr=addDivs(3);break;case"ball-beat":divsArr=addDivs(3);break;case"line-scale-pulse-out":divsArr=addDivs(5);break;case"line-scale-pulse-out-rapid":divsArr=addDivs(5);break;case"ball-scale-ripple":divsArr=addDivs(1);break;case"ball-scale-ripple-multiple":divsArr=addDivs(3);break;case"ball-spin-fade-loader":divsArr=addDivs(8);break;case"line-spin-fade-loader":divsArr=addDivs(8);break;case"triangle-skew-spin":divsArr=addDivs(1);break;case"pacman":divsArr=addDivs(5);break;case"ball-grid-beat":divsArr=addDivs(9);break;case"semi-circle-spin":divsArr=addDivs(1)}element.find(".loader-inner").append(divsArr)}function setLoaderText(){element.find(".spinnerText").text(scope.loaderText)}function addDivs(count){for(var arr=[],i=1;count>=i;i++)arr.push("<div></div>");return arr}null==scope.customClass&&(scope.customClass="loader"),(null==scope.loaderTextClass||""==scope.loaderTextClass)&&element.find(".spinnerText").attr("style","float:left; position:relative; top:20px; left: -50%; font-weight:bold;"),null==element.attr("style")&&element.attr("style","z-index:9999;position: fixed;top: 50%;left: 50%"),element.find(".loader-inner").addClass(scope.loaderType),addLoader(),setLoaderText()}}})}(angular);