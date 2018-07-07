---
title: 深入学习下AJAX
---
> AJAX虽说是最早接触的，但一直只停留在业务层面，没能对其内部进行深究，今天就对AJAX和JSONP深入学习下。

## AJAX

### 一、概念
[AJAX维基百科解释](https://zh.wikipedia.org/wiki/AJAX)

### 二、核心对象XMLHttpRequest

> The XMLHttpRequest.abort() method aborts the request if it has already been sent. When a request is aborted, its readyState is set to 0 (UNSENT), but the readystatechange event is not fired (译文：XMLHttpRequest 是一个API, 它为客户端提供了在客户端和服务器之间传输数据的功能。它提供了一个通过 URL 来获取数据的简单方式，并且不会使整个页面刷新。这使得网页只更新一部分页面而不会打扰到用户。XMLHttpRequest 在 AJAX 中被大量使用。)

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/65992791-file_1487145378879_ef8e.png)

该对象请求是**异步执行**的，所以要通过**回调函数(onreadystatechange)**获得响应，对象主要是通过`open()`、`send()`、方法并组合`readyState`、`status`、`responseText`属性来完成的。 下面来说下`AJAX`步骤：

### 三、步骤

#### ① 创建兼容的XMLHttpRequest对象
该对象需要兼容下浏览器(毕竟奇葩的 IE)，通用的兼容方法：

```js
// 跨浏览器兼容
var xhr;
if(typeof XMLHttpRequest != "undefined"){
	xhr = new XMLHttpRequest();
}else if(window.ActiveXObject){
	var aVersions = ["Microsoft.XMLHttp","Msxml2.XMLHttp.5.0","Msxml2.XMLHttp.4.0","Msxml2.XMLHttp.3.0","Msxml2.XMLHttp"];
	for(var i=0;i<aVersions.length;i++){
		try{
			xhr = new ActiveXObject(aVersions);
			break;
		}catch(e){}
	}
}
```



#### ② 初始化连接open()
`xhr.open(method,url[,async, user, password])`，有三个参数，`method`有`GET`、`POST`、`PUT`、`DELETE`方法，`url`是数据接口地址，`async(可选)`是否异步(`true`(默认)/`false`)，`user(可选)、password(可选)`使用的比较少。

然后建立连接：

```js
xhr.open('GET','http://localhost:3000/api/test');
```

#### ③ 发送请求send()
`xhr.send(data)`，`data`可以是任意类型的数据，若是`GET` 请求方式，`data`可以为空/`null`。

发送请求：

```js
xmlHttp.send();
```

#### ④ 等待回调结果

使用`onreadystatechange`回调函数，处理数据各种状态。当`readyState`为4，且`status`为200时，就返回成功。其它状态请参考下图。

`readyState`码：

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/50710653-file_1487145412385_5308.png)


HTTP状态码(`status`)：

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/14231422-file_1487144870551_12d0c.png)

```js
xhr.onreadystatechange = function(){ // 状态发生变化时，函数被回调
	if(xhr.readyState === 4){ // 成功完成
		// 判断响应结果：
		if(xhr.status === 200){
			// 成功
			document.write(xhr.responseText);
			document.write('\n');
		}else{
			// 失败
			document.write('失败\n');
		}
	}else{
		document.write('还在请求中...\n');
	}
};
```



## 解决跨域问题

> 首先需要知道，什么是跨域？同一域有哪些条件？

### 一、什么是跨域

下图是我在`http://localhost`(默认80端口)，去访问`http://localhost:3000/api/test`的数据接口，结果无法访问，就涉及到跨域问题。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/63081559-file_1487137267455_14420.png)

### 二、同域条件
1. 域名相同(http://ycjcl.cc和http://ycjcl.cc)是不一样的
2. 端口一样(http://localhost:80和http://localhost:3000)是不一样的 (可能少数浏览器支持端口不一致访问，毕竟极少)
3. 协议一致(要么是https，要么是http)

### 三、解决方案

#### 1、设置header头(cors)` Access-Control-Allow-Origin: *`

此方法只需要在服务器端设置，`*`代表任意请求来源，如果只想让特定的域名访问，直接改成`http://example`

```js
router.get('/api/test',function(req,res,next){
	var json = {
		'title':'Kylin',
		'Content':'AjaxTest'
	};
	res.header('Access-Control-Allow-Origin','*');
	res.json(json);
});

```

#### 2、JSONP(服务器端+客户端):

[JSONP(JSON with Padding)解释](https://zh.wikipedia.org/wiki/JSONP)，

##### 服务器端
如果是`Express`写得后台，可以使用JSONP封装方法`res.jsonp()`，其它语言/框架写得后台，转换方法就是将`data`转成`callback(data)`，用一个函数名callback(其它名也可以，需要和前端约定，默认为callback)将数据包起来，原理通过比较理解。

通过比较`res.json()`和`res.jsonp()`发现，`JSONP`是利用`<script src="url"></script>`脚本可以跨域的特点，去访问外部资源。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/86025620-file_1487137267627_3397.png)

通过比较源码，差别如下：
1.增加了`callback`变量，`app.get('jsonp callback name')`值默认为`callback`，这行代码是获取`url地址上的?callback=`后面的回调函数名。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/92245160-file_1487137646413_5383.png)

2.源码中的`X-Content-Type-Options: nosniff`是用来增强安全性，防止`js`脚本被恶意执行。参考[HTTP安全响应头 X-Content-Type-Options](https://imququ.com/post/web-security-and-response-header.html#toc-3)、[MDN X-Content-Type-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options)

3.后面代码`body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';`大致意思就是将`data`数据传成`callback(data)`这 种形式


##### 客户端

通过创建`script`标签去获取：

```js
var url = "http://localhost:3000/api/test?callback=callback";
// 创建script标签，设置其属性
var script = document.createElement('script');
script.setAttribute('src', url);
// 把script标签加入head，此时调用开始
document.getElementsByTagName('head')[0].appendChild(script);

var callback =  function(data){
	var sum='';
	for(var i in data){
        sum += data['title'];
	}
    document.getElementsByTagName('body')[0].innerHTML = sum;
};
```

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/27783969-file_1487140563630_bdfb.png)

### 3、Node服务器代理(服务器)：
就是开一个 node 服务，去代理请求，做一层转发，然后将前端放在 node 服务上。

#### 4、Fetch(客户端):

> [GlobalFetch](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch)、[FetchAPI](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)、[这个API很“迷人”](https://www.w3ctech.com/topic/854?utm_source=tuicool&utm_medium=referral)

新的 API 请求属性，使用也很简便，也能跨域。

```js
var myImage = document.querySelector('img');

var myRequest = new Request('flowers.jpg');

fetch(myRequest).then(function(response) {
  return response.blob();
}).then(function(response) {
  var objectURL = URL.createObjectURL(response);
  myImage.src = objectURL;
});
```

#### 5、postMessage

主页面向子页面发请求：

```js
window.onload=function(){
 window.frames[0].postMessage('hello','http://ycjcl.cc');
}
```

子页面监听并响应信息：

```js
window.addEventListener('message',function(e){
    if(e.source!=window.parent) return;
    var hello='world';
    window.parent.postMessage(hello,'*');
},false);
```

#### 6、webpack proxyTable 代理跨域
在 webpack 里直接配置 `proxyTable` 属性就行了，这样当访问 `/api` 时，实际上访问的是 `http://api.ycjcl.cc/info`

```js
proxyTable: {
      '/api': {
        target: 'http://api.ycjcl.cc/info/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
```

文章有很多地方描述的可能不是很准确，提到的点也不够全面，如果有不对的地方，还望斧正！

> 参考：[AJAX Getting_Started](https://developer.mozilla.org/zh-CN/docs/AJAX/Getting_Started)、[MDN XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)、[维基百科JSONP](https://zh.wikipedia.org/wiki/JSONP)、[HTTP状态码](http://www.cnblogs.com/zhouj/p/5818761.html)、[廖大神AJAX教程](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434499861493e7c35be5e0864769a2c06afb4754acc6000)、[Ajax总结篇](http://www.jianshu.com/p/c94e49772123)

