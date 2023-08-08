var has=Object.prototype.hasOwnProperty,supportsDescriptors=Object.defineProperty&&function(){try{var obj={};Object.defineProperty(obj,"x",{enumerable:!1,value:obj});for(var _ in obj)return!1;return obj.x===obj}catch(e){return!1}}(),ifWindowIt="undefined"==typeof window?xit:it,extensionsPreventible="function"==typeof Object.preventExtensions&&function(){var obj={};return Object.preventExtensions(obj),obj.a=3,3!==obj.a}(),ifExtensionsPreventibleIt=extensionsPreventible?it:xit,canSeal="function"==typeof Object.seal&&function(){var obj={a:3};return Object.seal(obj),delete obj.a,3===obj.a}(),ifCanSealIt=canSeal?it:xit,canFreeze="function"==typeof Object.freeze&&function(){var obj={};return Object.freeze(obj),obj.a=3,3!==obj.a}(),ifCanFreezeIt=canFreeze?it:xit;describe("Object",function(){"use strict";describe(".keys()",function(){var obj={str:"boz",obj:{},arr:[],bool:!0,num:42,"null":null,undefined:void 0},loopedValues=[];for(var key in obj)loopedValues.push(key);var keys=Object.keys(obj);it("should have correct length",function(){expect(keys.length).toBe(7)}),describe("arguments objects",function(){it("works with an arguments object",function(){!function(){expect(arguments.length).toBe(3),expect(Object.keys(arguments).length).toBe(arguments.length),expect(Object.keys(arguments)).toEqual(["0","1","2"])}(1,2,3)}),it("works with a legacy arguments object",function(){var FakeArguments=function(args){args.forEach(function(arg,i){this[i]=arg}.bind(this))};FakeArguments.prototype.length=3,FakeArguments.prototype.callee=function(){};var fakeOldArguments=new FakeArguments(["a","b","c"]);expect(Object.keys(fakeOldArguments)).toEqual(["0","1","2"])})}),it("should return an Array",function(){expect(Array.isArray(keys)).toBe(!0)}),it("should return names which are own properties",function(){keys.forEach(function(name){expect(has.call(obj,name)).toBe(!0)})}),it("should return names which are enumerable",function(){keys.forEach(function(name){expect(loopedValues.indexOf(name)).toNotBe(-1)})}),xit("should throw error for non object",function(){var e={};expect(function(){try{Object.keys(42)}catch(err){throw e}}).toThrow(e)}),describe("enumerating over non-enumerable properties",function(){it("has no enumerable keys on a Function",function(){var Foo=function(){};expect(Object.keys(Foo.prototype)).toEqual([])}),it("has no enumerable keys on a boolean",function(){expect(Object.keys(Boolean.prototype)).toEqual([])}),it("has no enumerable keys on an object",function(){expect(Object.keys(Object.prototype)).toEqual([])})}),it("works with boxed primitives",function(){expect(Object.keys(Object("hello"))).toEqual(["0","1","2","3","4"])}),it("works with boxed primitives with extra properties",function(){var x=Object("x");x.y=1;var actual=Object.keys(x),expected=["0","y"];actual.sort(),expected.sort(),expect(actual).toEqual(expected)}),ifWindowIt("can serialize all objects on the `window`",function(){var windowItemKeys,exception,excludedKeys=["window","console","parent","self","frame","frames","frameElement","external","height","width","top","localStorage","applicationCache"];supportsDescriptors&&Object.defineProperty(window,"thrower",{configurable:!0,get:function(){throw new RangeError("thrower!")}});for(var k in window)if(exception=void 0,windowItemKeys=exception,-1===excludedKeys.indexOf(k)&&has.call(window,k)&&null!==window[k]&&"object"==typeof window[k]){try{windowItemKeys=Object.keys(window[k])}catch(e){exception=e}expect(Array.isArray(windowItemKeys)).toBe(!0),expect(exception).toBeUndefined()}supportsDescriptors&&delete window.thrower})}),describe(".isExtensible()",function(){var obj={};it("should return true if object is extensible",function(){expect(Object.isExtensible(obj)).toBe(!0)}),ifExtensionsPreventibleIt("should return false if object is not extensible",function(){expect(Object.isExtensible(Object.preventExtensions(obj))).toBe(!1)}),ifCanSealIt("should return false if object is sealed",function(){expect(Object.isExtensible(Object.seal(obj))).toBe(!1)}),ifCanFreezeIt("should return false if object is frozen",function(){expect(Object.isExtensible(Object.freeze(obj))).toBe(!1)}),it("should throw error for non object",function(){try{expect(Object.isExtensible(42)).toBe(!1)}catch(err){expect(err).toEqual(jasmine.any(TypeError))}})}),describe(".defineProperty()",function(){var obj;beforeEach(function(){obj={},Object.defineProperty(obj,"name",{value:"Testing",configurable:!0,enumerable:!0,writable:!0})}),it("should return the initial value",function(){expect(has.call(obj,"name")).toBeTruthy(),expect(obj.name).toBe("Testing")}),it("should be setable",function(){obj.name="Other",expect(obj.name).toBe("Other")}),it("should return the parent initial value",function(){var child=Object.create(obj,{});expect(child.name).toBe("Testing"),expect(has.call(child,"name")).toBeFalsy()}),it("should not override the parent value",function(){var child=Object.create(obj,{});Object.defineProperty(child,"name",{value:"Other"}),expect(obj.name).toBe("Testing"),expect(child.name).toBe("Other")}),it("should throw error for non object",function(){expect(function(){Object.defineProperty(42,"name",{})}).toThrow()}),it("should not throw error for empty descriptor",function(){expect(function(){Object.defineProperty({},"name",{})}).not.toThrow()})}),describe(".getOwnPropertyDescriptor()",function(){it("should return undefined because the object does not own the property",function(){var descr=Object.getOwnPropertyDescriptor({},"name");expect(descr).toBeUndefined()}),it("should return a data descriptor",function(){var descr=Object.getOwnPropertyDescriptor({name:"Testing"},"name"),expected={value:"Testing",enumerable:!0,writable:!0,configurable:!0};expect(descr).toEqual(expected)}),it("should return undefined because the object does not own the property",function(){var descr=Object.getOwnPropertyDescriptor(Object.create({name:"Testing"},{}),"name");expect(descr).toBeUndefined()}),it("should return a data descriptor",function(){var expected={value:"Testing",configurable:!0,enumerable:!0,writable:!0},obj=Object.create({},{name:expected}),descr=Object.getOwnPropertyDescriptor(obj,"name");expect(descr).toEqual(expected)}),it("should throw error for non object",function(){try{expect(Object.getOwnPropertyDescriptor(42,"name")).toBeUndefined()}catch(err){expect(err).toEqual(jasmine.any(TypeError))}})}),describe(".getPrototypeOf()",function(){it("should return the [[Prototype]] of an object",function(){var Foo=function(){},proto=Object.getPrototypeOf(new Foo);expect(proto).toBe(Foo.prototype)}),it("should shamone to the `Object.prototype` if `object.constructor` is not a function",function(){var Foo=function(){};Foo.prototype.constructor=1;var proto=Object.getPrototypeOf(new Foo),fnToString=Function.prototype.toString;expect(proto).toBe(fnToString.call(Object.getPrototypeOf).indexOf("[native code]")<0?Object.prototype:Foo.prototype)}),it("should throw error for non object",function(){try{expect(Object.getPrototypeOf(1)).toBe(Number.prototype)}catch(err){expect(err).toEqual(jasmine.any(TypeError))}}),it("should return null on Object.create(null)",function(){var obj=Object.create(null);expect(null===Object.getPrototypeOf(obj)).toBe(!0)})}),describe(".defineProperties()",function(){it("should define the constructor property",function(){var target={},newProperties={constructor:{value:"new constructor"}};Object.defineProperties(target,newProperties),expect(target.constructor).toBe("new constructor")})}),describe(".create()",function(){it("should create objects with no properties when called as `Object.create(null)`",function(){var obj=Object.create(null);expect("hasOwnProperty"in obj).toBe(!1),expect("toString"in obj).toBe(!1),expect("constructor"in obj).toBe(!1);var protoIsEnumerable=!1;for(var k in obj)"__proto__"===k&&(protoIsEnumerable=!0);expect(protoIsEnumerable).toBe(!1),expect(obj instanceof Object).toBe(!1)})})});