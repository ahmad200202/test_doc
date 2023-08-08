describe("Function",function(){"use strict";describe("#apply()",function(){it("works with arraylike objects",function(){var arrayLike={length:4,0:1,2:4,3:!0},expectedArray=[1,void 0,4,!0],actualArray=function(){return Array.prototype.slice.apply(arguments)}.apply(null,arrayLike);expect(actualArray).toEqual(expectedArray)})}),describe("#bind()",function(){var actual,testSubject={push:function(o){this.a.push(o)}},func=function(){return Array.prototype.forEach.call(arguments,function(a){this.push(a)},this),this};beforeEach(function(){actual=[],testSubject.a=[]}),it("binds properly without a context",function(){var context;testSubject.func=function(){context=this}.bind(),testSubject.func(),expect(context).toBe(function(){return this}.call())}),it("binds properly without a context, and still supplies bound arguments",function(){var a,context;testSubject.func=function(){a=Array.prototype.slice.call(arguments),context=this}.bind(void 0,1,2,3),testSubject.func(1,2,3),expect(a).toEqual([1,2,3,1,2,3]),expect(context).toBe(function(){return this}.call())}),it("binds a context properly",function(){testSubject.func=func.bind(actual),testSubject.func(1,2,3),expect(actual).toEqual([1,2,3]),expect(testSubject.a).toEqual([])}),it("binds a context and supplies bound arguments",function(){testSubject.func=func.bind(actual,1,2,3),testSubject.func(4,5,6),expect(actual).toEqual([1,2,3,4,5,6]),expect(testSubject.a).toEqual([])}),it("returns properly without binding a context",function(){testSubject.func=function(){return this}.bind();var context=testSubject.func();expect(context).toBe(function(){return this}.call())}),it("returns properly without binding a context, and still supplies bound arguments",function(){var context;testSubject.func=function(){return context=this,Array.prototype.slice.call(arguments)}.bind(void 0,1,2,3),actual=testSubject.func(1,2,3),expect(context).toBe(function(){return this}.call()),expect(actual).toEqual([1,2,3,1,2,3])}),it("returns properly while binding a context properly",function(){var ret;testSubject.func=func.bind(actual),ret=testSubject.func(1,2,3),expect(ret).toBe(actual),expect(ret).not.toBe(testSubject)}),it("returns properly while binding a context and supplies bound arguments",function(){var ret;testSubject.func=func.bind(actual,1,2,3),ret=testSubject.func(4,5,6),expect(ret).toBe(actual),expect(ret).not.toBe(testSubject)}),it("has the new instance's context as a constructor",function(){var actualContext,expectedContext={foo:"bar"};testSubject.Func=function(){actualContext=this}.bind(expectedContext);var result=new testSubject.Func;expect(result).toBeTruthy(),expect(actualContext).not.toBe(expectedContext)}),it("passes the correct arguments as a constructor",function(){var expected={name:"Correct"};testSubject.Func=function(arg){return expect(Object.prototype.hasOwnProperty.call(this,"name")).toBe(!1),arg}.bind({name:"Incorrect"});var ret=new testSubject.Func(expected);expect(ret).toBe(expected)}),it("returns the return value of the bound function when called as a constructor",function(){var oracle=[1,2,3],Subject=function(){return expect(this).not.toBe(oracle),oracle}.bind(null),result=new Subject;expect(result).toBe(oracle)}),it("returns the correct value if constructor returns primitive",function(){for(var Subject=function(oracle){return expect(this).not.toBe(oracle),oracle}.bind(null),primitives=["asdf",null,!0,1],i=0;i<primitives.length;++i)expect(new Subject(primitives[i])).not.toBe(primitives[i]);for(var objects=[[1,2,3],{},function(){}],j=0;j<objects.length;++j)expect(new Subject(objects[j])).toBe(objects[j])}),it('returns the value that instance of original "class" when called as a constructor',function(){var ClassA=function(x){this.name=x||"A"},ClassB=ClassA.bind(null,"B"),result=new ClassB;expect(result instanceof ClassA).toBe(!0),expect(result instanceof ClassB).toBe(!0)}),it("sets a correct length without thisArg",function(){var Subject=function(a,b,c){return a+b+c}.bind();expect(Subject.length).toBe(3)}),it("sets a correct length with thisArg",function(){var Subject=function(a,b,c){return a+b+c+this.d}.bind({d:1});expect(Subject.length).toBe(3)}),it("sets a correct length with thisArg and first argument",function(){var Subject=function(a,b,c){return a+b+c+this.d}.bind({d:1},1);expect(Subject.length).toBe(2)}),it("sets a correct length without thisArg and first argument",function(){var Subject=function(a,b,c){return a+b+c}.bind(void 0,1);expect(Subject.length).toBe(2)}),it("sets a correct length without thisArg and too many argument",function(){var Subject=function(a,b,c){return a+b+c}.bind(void 0,1,2,3,4);expect(Subject.length).toBe(0)})})});