---
title: Nisp之道
---
# Nisp

## 什么是Nisp ？
详情请见[YsMood_Nisp](https://github.com/ysmood/nisp)，[Nisp上手文档](https://github.com/ysmood/nisp/wiki/Nisp%E4%B8%8A%E6%89%8B%E6%96%87%E6%A1%A3)

`Nisp`一种跨平台的语言，`Nisp`是一种思想，一切皆函数`[fun ]`，`fun`为`Nisp`提供的原子函数或用户自定义的方法，借鉴`Lisp`分治和线性思想，`nisp`内核只提供一种解析机制和部分原子函数，用户可以自定义方法，来满足自身业务需求，`Nisp`给用户无限的想像！

## 表达式
表达式类似于前缀表达式，将`fun`方法(如`+-/*:|`等)放置参数之前

## 安装
`npm install nisp --save`完成安装

## 快速上手

[在线测试地址](https://runkit.com/ysmood/nisp-demo/1.0.2)

```javascript
// 引入nisp
var nisp = require("nisp").default;
// 定义加法方法
var sandbox = {
    "+": (...args) => args.reduce((a, b) => a + b)
};
// 表达式
var exp = ["+", 1, 2, ["+", 1, 2]];
// 调用nisp方法，传入(表达式，方法)
nisp(exp, sandbox); // => 6
```

同时，也可以采用`ES6`的写法

```javascript
// 引入nisp
import nisp from 'nisp'
// 定义加法方法
var sandbox = {
    '+': (a, b) => a + b
};
// 表达式
var exp = ['+', 1, 2, ['+', 1, 2]];
// 调用nisp方法，传入(表达式，方法)
nisp(exp, sandbox); // => 6
```

## 内核源码分析

```typescript
/**
 * Eval an nisp ast
 * @param {any} ast The abstract syntax tree of nisp.
 * It's a common flaw that array cannot carry plain data,
 * such as `['foo', [1,2]]`, The `1` will be treat as a function name.
 * So it's recommended to use object to carry plain data,
 * such as translate the example to `['foo', { data: [1, 2] }]`.
 * @param {Sandbox} sandbox The interface to the real world.
 * It defined functions to reduce the data of each expression.
 * @param {any} env The system space of the vm.
 * @param {any} parent Parent context, it is used to back trace the execution stack.
 */
export default function (ast: any, sandbox: Sandbox, env?, parent?: Context, index = 0) {
    return nisp({ ast, sandbox, env, parent, index })
}

function nisp (ctx: Context) {
    if (!ctx) error(ctx, "ctx is required");

    let { sandbox, ast } = ctx

    if (!sandbox) error(ctx, "sandbox is required");

    if (isArray(ast)) {
        if (ast.length === 0) return

        let action = arg(ctx, 0)

        if (isFunction(action)) {
            return apply(action, ctx)
        }

		// 使用沙盒里的方法
        if (action in sandbox) {
            let fn = sandbox[action];
            return isFunction(fn) ? apply(fn, ctx) : fn;
        } else {
            error(ctx, `function "${action}" is undefined`);
        }
    } else {
        return ast;
    }
}
```

## 常用方法解析

### $

基本表达式：`['$', any ]`
将原始输入值转成规范的基本数据类型(Number/Boolean/String)，调用其它方法时，同时也会在外包一层`$`，转成基本数据类型。

源码：
```typescript
/**
 * Return the second ast as raw data
 */
export default macro(ctx => {
    return ctx.ast[1]
});
```

[在线测试地址](https://runkit.com/ycjcl868/nisp-/3.0.0)

```javascript
var nisp = require("nisp").default;
var $ = require("nisp/lib/$").default;
var sandbox = {
    "$": $
};
var exp = ['$', [1, "ok"]];
nisp(exp, sandbox); // => [1,"ok"]
```


### dict

基本语法：`[: key value]`，用来输出一个`{"key":"value"}`对象，


源码：

```typescript
// 实现原理：('list',k1,v1,k2,v2)`dict`-> 用`obj[k] = v`，生成JSON，
// ["list", k1, v1, k2, v2, ...]
export default function () {
    var dict = {};
    var args = arguments

    for (var i = 0, j; i < args.length; i = ++j) {
        j = i + 1;
        dict[args[i]] = args[j];
    }

    return dict;
};
```

[ 在线测试地址](https://runkit.com/ycjcl868/nisp-dict1/1.0.1)

```javascript
var nisp = require("nisp").default;
var dict = require("nisp/lib/dict").default;

var sandbox = {
    ":": dict
};

var exp = [":", 1, 2];

nisp(exp, sandbox); // => {1:2}
```


### if

基本语法`['?',a,b,c]`，相当于`if`判断语句中的`a ? b : c`，如果`a`存在为`b`，不存在为`b`

[在线测试地址](https://runkit.com/ycjcl868/nisp-if/3.0.0)

```javascript
var nisp = require("nisp").default;
var $if = require("nisp/lib/if").default;
var sandbox = {
    "?": $if
};
var exp = ['?', 1 , 'a' , 'b'];
var exp2 = ['?', 0 , 'a' , 'b'];
console.log(nisp(exp, sandbox)); // => a
console.log(nisp(exp2, sandbox)); // => b
```

### list
基本语法`['list',1,2,3]`，将多个值转成数组。
[在线测试地址](https://runkit.com/ycjcl868/nisp-list/3.0.0)
源码：

```typescript
// 实现原理：["list",a,b,c,d]  直接用`arr.push(args[i])`
// ["list", a, b, c, ...]
export default function () {
    var arr = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
        arr.push(arguments[i]);
    }
    return arr;
};

```


```javascript
var nisp = require("nisp").default;
var list = require("nisp/lib/list").default;
var sandbox = {
    "|": list
};
var exp = ['|', 1 , 'a' , 'b'];
nisp(exp, sandbox); // => [1,'a','b']
```

### fn
源码：

```typescript
// ["fn", [<arg1>, <arg2>, ...], <exp>]
// There are two closures: one is when the function is created,
// another one is when the function is called.
export default macro((ctx) => {
    return function (this: Context) {
        if (countStack(this) > maxStackSize)
            error(this, 'call stack overflow')

        let { ast } = ctx

        // generate a closure sandbox based on the parent sandbox
        var closure = Object.create(ctx.sandbox)

        // overwrite arguments to closure
        for (let i = 0, len = ast[1].length; i < len; i++) {
            closure[ast[1][i]] = arguments[i];
        }

        return run(ast[2], closure, ctx.env, this, ctx.index);
    };
})
```
