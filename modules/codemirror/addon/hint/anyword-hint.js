!function(mod){"object"==typeof exports&&"object"==typeof module?mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],mod):mod(CodeMirror)}(function(CodeMirror){"use strict";var WORD=/[\w$]+/,RANGE=500;CodeMirror.registerHelper("hint","anyword",function(editor,options){for(var word=options&&options.word||WORD,range=options&&options.range||RANGE,cur=editor.getCursor(),curLine=editor.getLine(cur.line),end=cur.ch,start=end;start&&word.test(curLine.charAt(start-1));)--start;for(var curWord=start!=end&&curLine.slice(start,end),list=options&&options.list||[],seen={},re=new RegExp(word.source,"g"),dir=-1;1>=dir;dir+=2)for(var line=cur.line,endLine=Math.min(Math.max(line+dir*range,editor.firstLine()),editor.lastLine())+dir;line!=endLine;line+=dir)for(var m,text=editor.getLine(line);m=re.exec(text);)(line!=cur.line||m[0]!==curWord)&&(curWord&&0!=m[0].lastIndexOf(curWord,0)||Object.prototype.hasOwnProperty.call(seen,m[0])||(seen[m[0]]=!0,list.push(m[0])));return{list:list,from:CodeMirror.Pos(cur.line,start),to:CodeMirror.Pos(cur.line,end)}})});