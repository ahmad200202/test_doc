!function(mod){"object"==typeof exports&&"object"==typeof module?mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],mod):mod(CodeMirror)}(function(CodeMirror){"use strict";function startListening(cm,state){function check(){cm.display.wrapper.offsetHeight?(stopListening(cm,state),cm.display.lastWrapHeight!=cm.display.wrapper.clientHeight&&cm.refresh()):state.timeout=setTimeout(check,state.delay)}state.timeout=setTimeout(check,state.delay),state.hurry=function(){clearTimeout(state.timeout),state.timeout=setTimeout(check,50)},CodeMirror.on(window,"mouseup",state.hurry),CodeMirror.on(window,"keyup",state.hurry)}function stopListening(_cm,state){clearTimeout(state.timeout),CodeMirror.off(window,"mouseup",state.hurry),CodeMirror.off(window,"keyup",state.hurry)}CodeMirror.defineOption("autoRefresh",!1,function(cm,val){cm.state.autoRefresh&&(stopListening(cm,cm.state.autoRefresh),cm.state.autoRefresh=null),val&&0==cm.display.wrapper.offsetHeight&&startListening(cm,cm.state.autoRefresh={delay:val.delay||250})})});