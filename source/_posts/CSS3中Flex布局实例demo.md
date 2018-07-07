---
title: CSS3中Flex布局实例demo
---
> 很多大牛，都提到了`flex`布局，说是css快速布局的新利器。于是学习了一下。

教程，我推荐**阮一峰**老师的文章。老师分别写了[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)、[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)。我跟着老师的文章，动手做了几个实例，体会了一下`flex`布局，简直是太方便了。

------

![](http://7xi72v.com1.z0.glb.clouddn.com/17-1-4/97496200-file_1483539131458_1421c.png)

flex容器属性：

* `flex-direction`：决定元素的排列方向
* `flex-wrap`：决定元素如何换行(排列不下时)
* `flex-flow` `flex-direction`和`flex-wrap`的简写
* `justify-content`：元素在主轴上的对齐方式
* `align-items`：元素在交叉轴的对齐方式

> `flex-direction: columns`其实是将默认情况下的`row`，逆时针旋转90度。

flex元素属性：

* `flex-grow`：当有多余空间时，元素的放大比例
* `flex-shrink`：当空间不足时，元素的缩小比例
* `flex-basis`：元素在主轴上占据的空间
* `flex`是`grow、shrink、basis`的简写
* `order`：定义元素的排列顺序
* `align-self`：定义元素自身的交叉轴对齐方式


####Demo1
实现`flex item`的各种居中、对齐、位置：

html骨架结构：

```html
<div class="box">
	<span class="item"></span>
</div>
```

```css
.box{
	display: flex;
	height: 300px;
}
.item{
	background: #000;
	width: 50px;
	height: 50px;
	border-radius: 50px;
}
```


初始化后是这样的：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/60548568.jpg)

如果我想让黑色的圆垂直居中的话，我就这样写了：

```css
.box{
	display: flex;
	height: 300px;
	justify-content: center;
	align-items: center;

}
.item{
	background: #000;
	width: 50px;
	height: 50px;
	border-radius: 50px;
}
```


![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/85911727.jpg)



####Demo2

多个黑色的球：

html结构：

```html
<div class="box">
	<span class="item one"></span>
	<span class="item two"></span>
	<span class="item three"></span>
</div>

```

css:

```css
.box{
	display: flex;
	height: 300px;

}
.item{
	background: #000;
	width: 50px;
	height: 50px;
	border-radius: 50px;
}
.one{

}
.two{

}
.three{

}
```

默认情况下：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/71086070.jpg)

当css改变：

```css
.box{
	display: flex;
	justify-content: space-between;
	height: 300px;
}
```
球将均匀分开(和上面的一样)：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/6046671.jpg)

如果再改变下主轴方向`flex-direction:column;`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/12547629.jpg)

再弄个斜对角:

```css
.box{
	display: flex;
	justify-content: space-between;
	height: 300px;
	flex-direction:column;
}
.item{
	background: #000;
	width: 50px;
	height: 50px;
	border-radius: 50px;
}
.one{
	/* align-self: flex-start;  其实是默认的 */
}
.two{
	align-self:center;
}
.three{
	align-self:flex-end;

}
```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/82841544.jpg)



####Demo3-网格布局
网格大概是这种的：
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/72746650.jpg)


html结构:

```html
<div class="grid">
	<div class="grid-cell">111</div>
	<div class="grid-cell">222</div>
	<div class="grid-cell">333</div>
	<div class="grid-cell">444</div>
</div>
```

css:

```css
.gird{
	display: flex;
	display: -webkit-flex;

}
.grid-cell{
	flex: 1;
	border: 1px solid #000;
}
```
出来的效果是这样的：
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/38476854.jpg)

然后更改项目的`flex`配比，可以获得不同的空间。


html:

```html
<div class="grid">
	<div class="grid-cell" id="one">111</div>
	<div class="grid-cell" id="two">222</div>
	<div class="grid-cell" id="three">333</div>
	<div class="grid-cell" id="four">444</div>
</div>
```

css:

```css
#one{
	flex: 1;
}
#two{
	flex: 2;
}
#three{
	flex: 3;
}
#four{
	flex: 4;
}
```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-25/91878061.jpg)

> flex:0;  其实代表着宽高auto，自适应。如果flex: a b c;  a值是空间配比，b值是缩小的比例（若为0，则不缩放），c值是宽度(width) 或 高度(height)

### 实战:
#### 一、手机页面

<script async src="//jsfiddle.net/ycjcl868/9do06LdL/6/embed/result,html,css/"></script>

#### 二、圣杯布局

[MDN官方圣杯示例](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes#圣杯布局示例)

<script async src="//jsfiddle.net/ycjcl868/9do06LdL/15/embed/result,html,css/"></script>

#### 二、产品列表
<script async src="//jsfiddle.net/ycjcl868/9do06LdL/7/embed/result,html,css/"></script>


#### 三、PC页面布局

<script async src="//jsfiddle.net/ycjcl868/9do06LdL/8/embed/result,html,css/"></script>

#### 四、完美居中

<script async src="//jsfiddle.net/ycjcl868/9do06LdL/9/embed/result,html,css/"></script>


> 资料：[一劳永逸的搞定 flex 布局](https://mp.weixin.qq.com/s?__biz=MzA5Njc3Njk5NA==&mid=2650529122&idx=1&sn=d87231facb9d13e55e39b3ebc927f943&chksm=88a59b2fbfd2123965e60b78b7b8ffa5c8a8bd3c91208c592a91a807f8354a50cdc80fb9c634&scene=0&key=f5988406d54d074e0b40d7aa25898f604df94f9cf10df367d1d2ea2880a6ccc392917257e5b4a1f8469980dcc914223465ea4dcd7df0f354af0c5e279e78a996017636d86d03cea88243f595c9c65c67&ascene=0&uin=MjA0MzUxMzA2Mw%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.12.1+build(16B2657)&version=12020510&nettype=WIFI&fontScale=100&pass_ticket=%2BSBoJPwi2t8B7iYV9WC6%2BYFk%2B%2Fqog7%2FSEAhrxbvVxkeXjlzhYSzcd0iXHEsx74n8)
