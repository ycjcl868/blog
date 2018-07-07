---
title: Module.exports和exports的区别
---
> 学习`Seajs`时，看到了`exports.doSomething`和`module.exports`，想对这两者的区别一探究竟。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-10/97116137-file_1486708942813_1278d.png)

#### 一、官方解释
因为`SeaJs`和`Nodejs`都是基于`CommonJS`,所以直接看的`Node`的官方文档解释

##### Module.exports
> The **module.exports** object is created by the Module system. Sometimes this is not acceptable; many want their module to be an instance of some class. To do this, assign the desired export object to **module.exports**. Note that assigning the desired object to **exports** will simply rebind the local **exports** variable, which is probably not what you want to do.

> 译文：**module.exports**对象是由模块系统创建的。 有时这是难以接受的；许多人希望他们的模块成为某个类的实例。 为了实现这个，需要将期望导出的对象赋值给**module.exports**。 注意，将期望的对象赋值给**exports**会简单地重新绑定到本地**exports**变量上，这可能不是你想要的。

##### exports
> The **exports** variable is available within a module's file-level scope, and is assigned the value of **module.exports** before the module is evaluated. It allows a shortcut, so that **module.exports.f = ...** can be written more succinctly as **exports.f = ....** However, be aware that like any variable, if a new value is assigned to **exports**, it is no longer bound to **module.exports**:

> 译文：**exports**变量是在模块的文件级别作用域内有效的，它在模块被执行前被赋于 **module.exports** 的值。它有一个快捷方式，以便 **module.exports.f = ...** 可以被更简洁地写成**exports.f = ...**。 注意，就像任何变量，如果一个新的值被赋值给**exports**，它就不再绑定到**module.exports**(其实是**exports.属性**会自动挂载到没有命名冲突的**module.exports.属性**)

##### require
从require导入方式去理解，关键有两个变量(全局变量`module.exports`，局部变量`exports`)、一个返回值(`module.exports`)

```js
function require(...) {
  var module = { exports: {} };
  ((module, exports) => {
    // 你的被引入代码 Start
    // var exports = module.exports = {}; (默认都有的)
    function some_func() {};
    exports = some_func;
    // 此时，exports不再挂载到module.exports，
    // export将导出{}默认对象
    module.exports = some_func;
    // 此时，这个模块将导出some_func对象，覆盖exports上的some_func
     // 你的被引入代码 End
  })(module, module.exports);
 // 不管是exports还是module.exports，最后返回的还是module.exports
  return module.exports;
}
```


#### 二、Demo事例


##### 事例一：`1.js`

```js
console.log(exports); // {}
console.log(module.exports);  // {}
console.log(exports === module.exports);	// true
console.log(exports == module.exports);		// true
/**
 Module {
  id: '.',
  exports: {},
  parent: null,
  filename: '/1.js',
  loaded: false,
  children: [],
  paths:
   [
     '/node_modules' ]
 }
 */
console.log(module);

```

###### 从事例一中，可以看出来

* 1.每个`js`文件一创建，都有一个`var exports = module.exports = {};`，使`exports`和`module.exports`都指向一个空对象。
* 2.`module`是全局内置对象，`exports`是被`var`创建的局部对象。
* 3.`module.exports`和`exports`所指向的内存地址相同

##### 事例二：`2.js`、`3.js`

```js
// 2.js
exports.id = 'exports的id';
exports.id2 = 'exports的id2';
exports.func = function(){
	console.log('exports的函数');
};
exports.func2 = function() {
	console.log('exports的函数2');
};
module.exports = {
	id: 'module.exports的id',
	func:function(){
		console.log('module.exports的函数');
	}

};

```

```js
// 3.js
var a = require('./2.js');
// 当属性和函数在module.exports都有定义时：
console.log(a.id);  // module.exports的id
console.log(a.func()); // module.exports的函数

// 当属性在module.exports没有定义，函数在module.exports有定义
console.log(a.id2);  // undefined
console.log(a.func());  // module.exports的函数

// 当函数在module.exports没有定义，属性在module.exports有定义
console.log(a.id);		// module.exports的id
console.log(a.func2());	// 报错了 TypeError: a.func2 is not a function
```

###### 由例二可以知道：

* 1.`module.exports`像是`exports`的大哥，当`module.exports`以`{}`整体导出时会覆盖`exports`的属性和方法，
* 2.注意，若只是将属性/方法挂载在`module.exports.`/`exports.`上时，`exports.id=1`和`module.exports.id=100`，`module.exports.id=function(){}`和`exports.id=function(){}`，最后id的值取决于`exports.id`和`module.exports.id`的顺序，谁在后，就是最后的值

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-11/3342799-file_1486777354466_11a75.png)

* 3.若`exports`和`module.exports`同时赋值时，`exports`所使用的属性和方法必须出现在`module.exports`，若属性没有在`module.exports`中定义的话，出现`undefined`，若方法没有在`module.exports`中定义，会抛出`TypeError`错误。

##### 例三 `4.js`、`5.js`

`module.exports`的对象、`prototype`、`构造函数`使用

```js
// 4.js
var a = require('./5.js');
// 若传的是类，new一个对象
var person = new a('Kylin',20);
console.log(person.speak()); // my name is Kylin ,my age is 20

// 若不需要在构造函数时初始化参数，直接调用方法/属性
// a.speak();  // my name is kylin ,my age is 20
```


```js
// 5.js
// Person类
function Person(name,age){
	this.name = name;
	this.age = age;
}
// 为类添加方法
Person.prototype.speak = function(){
	console.log('my name is '+this.name+' ,my age is '+this.age);
};

// 返回类
module.exports = Person;

// 若构造函数没有传入参数(name,age)，直接传入对象
// module.exports = new Person('kylin',20);
```



###### 说了这么多，其实建议就是，如果只是单一属性或方法的话，就使用`exports.属性/方法`。要是导出多个属性或方法或使用`对象构造方法`，结合`prototype`等，就建议使用`module.exports = {}`。文章有很多地方描述的可能不是很准确，提到的点也不够全面，如果有不对的地方，还望斧正！



> 参考资料：[Nodejs官方文档(中文)](http://nodejs.cn/api/modules.html#modules_module_exports)、[Node.js Module – exports vs module.exports](http://www.hacksparrow.com/node-js-exports-vs-module-exports.html)、[Understanding module.exports and exports in Node.js](https://www.sitepoint.com/understanding-module-exports-exports-node-js/)、[exports 和 module.exports 的区别](https://cnodejs.org/topic/5231a630101e574521e45ef8)
