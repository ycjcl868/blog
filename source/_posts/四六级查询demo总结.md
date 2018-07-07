---
title: 四六级查询demo总结
---
> 7月份时，闲着无聊，做了一个全国四六级的查询，体会了独立从设计、前端、后台、开发、部署、推广、服务器运维的过程，现做个总结。[demo演示](http://cet.ycjcl.cc)

当天的PV量和IP量：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-21/83481037.jpg)

---------

####前端
因为是在手机上访问的，所以前端UI层其实没多大量。我个人比较喜欢像**Google**、**苹果**、**微信**的设计，所以前端的UI层采用了[`WeUI`](http://weui.io)，交互层的JS框架采用了[`VueJS`](http://cn.vuejs.org) + [`Zepto`](http://zeptojs.com/)。写CSS时就使用的`Less`预处理(Less直接一保存，自动转成CSS)。


![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/11294235.jpg)

####后端
后端为了支持短时间内的高并发，使用了`NodeJS`。非阻塞的异步I/O操作果然很强势。数据库连接开启了`pool`连接池和索引，查询起来压力不大。

####服务器
其实最大的考验在于服务器的支撑上，买了两台学生机（阿里云9.9元 + 腾讯云1元）😂做的负载均衡

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/16013969.jpg)

为了不给服务器大的压力，前端将该压缩的都压缩了。从**html**、**CSS**、**js**、**图片**全都压缩。

然后用`tingyun`看了一下监测：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/1087078.jpg)

最后的访问量用百度统计看了一下，感觉一般，毕竟不是官方推荐的入口，只是自己心血来潮做个玩玩，同时免准考证查询接口临时改加密算法也是无奈。[推文](http://mp.weixin.qq.com/s?__biz=MzA5NTIxOTg4Ng==&mid=2459553686&idx=1&sn=865e36dbb33e8f1a91e1886d1b350550&scene=1&srcid=0820cy3wk1L8aHTmqGTLfk8G#rd)写的也不是很好。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/76553376.jpg)




####不足之处

* 当时测试调用`学信网`接口时，没有加`XFF`头，导致了查询当天，查询了大概10几个分数后，就无法使用了。没办法，马上写了一个`RandomIp()`的方法。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/350532.jpg)

* 抓取完后，解析**学信网**宿舍信息时，用的是正则表达式，写了很长，没有用`cheerio`模块。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/20309480.jpg)

* 原先测试时，`99宿舍`免准考证查询是可以用的，结果出分的前一天晚上，换了加密算法。导致除`99宿舍`的所有第三方都无法查到准考证号。然后临时将**免准考证查询**的选项卡去除。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-22/39685576.jpg)

* 第一次处理那种大量用户查询服务，像这种服务有这样的特点：**不确定性**、**即时性**、**高并发性**，查询前一天晚上发现免准接口用不了了，心里是崩溃的。同时也就隐隐感受到了淘宝双十一时的那种心情，真的是一个传奇。

####附目录结构
```
项目目录结构
├── api.js
├── app.js
├── bin
│   └── www
├── conf
│   └── db.js
├── demo.html
├── gulpfile.js
├── node_modules
├── package.json
├── public
│   ├── bower.json
│   ├── bower_components
│   ├── css
│   ├── favicon.ico
│   ├── images
│   ├── js
│   └── min
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.ejs
    └── index.ejs
```


