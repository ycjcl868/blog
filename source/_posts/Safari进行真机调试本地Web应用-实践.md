---
title: Safari进行真机调试本地Web应用-实践
---
#### 真机调试本地Web应用-实践
> 之前，移动端的开发测试一直是很头痛的问题。通常的测试方法是使用Chrome模拟器，但模拟器对移动端手势操作的测试几乎束手无策。

然后就实践了一下`Safari`真机本地调试web应用。


* 首先打开将*真机*和*电脑*置于同一网段下，对*手机*进行如下配置：`设置`-> `Safari` -> `高级` ，将`Web检查器`开启。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-7/59450549.jpg)，而*电脑*端，将`Safari`进行以下配置：`偏好设置` -> `高级` -> `在菜单栏中显示『开发』菜单`
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-7/39241933.jpg)
* 然后将用USB线将*手机*和*电脑*连接起来
* 这时候，用*手机*的`Safari`打开网页时，就会看到*电脑*的`Safari`有如下变化：
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-7/69280545.jpg)
* 点击进入后，作为前端来说看到这些，就知道怎样调试了，不再累述。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-7/71196810.jpg)
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-7/85549723.jpg)
* `Safari`移动调试器真的是太强大了。。。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-7/86931823.jpg)

