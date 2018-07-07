---
title: 全国高校网安联赛Web专场~WriteUp
---
###1、Sign
> 题目：Good Luck！flag{X-nuca@GoodLuck!}

Flag直接写在题目上了，`flag{X-nuca@GoodLuck!}`

###2、BaseCoding
> 提示：这是编码不是加密哦!一般什么编码里常见等号？
题目：这一串字符好奇怪的样子，里面会不会隐藏什么信息？http://question1.erangelab.com/
Base64……

访问后得到一串含有等号的字符，然后base64解码得到flag

###3、BaseInjection
>提示：试试万能密码
题目：不知道密码也能登录。http://question2.erangelab.com/

万能密码  1‘or'1'='1'
轻松拿到flag


###4、BaseReconstruction
> 提示：对数据包进行重构是基本技能
题目：此题看似和上题一样，其实不然。http://question3.erangelab.com/

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/50886843.jpg)

`flag{Cr05sthEjava5cr1pt}`


###5、CountingStars
>提示：一不小心Mac也侧漏
题目：No more $s counting stars. http://question4.erangelab.com/
查看源码可以看到有个提示是说mac系统的，所以直接下载DS_Store，里面可以看到有一个zip

在`http://question4.erangelab.com/.DS_Store`查看源码，发现这么一个名字的压缩包 把压缩包下载来后。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/670690.jpg)

```
<?php
$S="song";
$song="says";
$says="no";
$no="more";
$more="d0llars";
$d0llars="counting";
$counting="star";
$star="S";
echo '<div style="text-align:center">What is $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$S</div>';
?>
```
应该是变量覆盖，直接`echo $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$S`解出来是`d0llars`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/20812182.jpg)

###6、Invisible
> 题目：隐藏IP来保护自己。http://121.195.186.234

发包时直接改`X-Forwarded-For:127.0.0.1`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/93672064.jpg)

###7、Normal_normal
> 提示：phpwind 后台getxxxxx
题目：又是一个bbs。http://question6.erangelab.com/

126邮箱社工拿到后台用户名和密码:`zhangrendao  zhang2010`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/41934336.jpg)

登录后台 翻了下XML  最后拿到Flag

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/30764935.jpg)

`flag{n0rmal_meth0d_n0rmal_l1fe}`

###8、DBexplorer
> 提示：a.SELECT @@datadir 。。。mysql/user.MYD b.user.MYD
题目：Where is my data。http://question7.erangelab.com/（请不要修改密码！）

提示vim，看`db.php.swp`文件，找到了用户名和密码`ctfdb  ctfmysql123`，还有phpmyadmin的地址。但权限不够。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/66830417.jpg)

无意中，看到大牛们导出时出现了这个：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/79136926.jpg)

然后用`topsec  topsec123456`登陆进去拿到flag

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/56027448.jpg)



###9、RotatePicture
> 提示：urlopen file schema
题目：转转转。http://question8.erangelab.com/picrotate

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/5643835.jpg)

首先可以看源码，得到
http://question8.erangelab.com/getredisvalue
然后找了个paper`http://www.tuicool.com/articles/fE7nMv3 `，是Python urllib HTTP Header Injection。
方法就是先设置uuid，然后再get uuid。
这样get uuid 就等于get flag
`flag{url0pen_1s_1nterest1ng}`

###10、AdminLogin
> 题目：On the way in。http://121.195.186.238/index.php

点击进去好像有个链接 然后是我队友注入跑出来了账号密码

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/18238161.jpg)

解出来是
`Ctfadmin    admininistrat0r`
然后尝试去登陆 发现死活登陆不了  看看返回信息。经师傅提示，找到了svn目录，找到了路径。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/18264019.jpg)

好吧 要伪造IP  那简单啦 X-Forwarded-For 轻松解决一切

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/32635280.jpg)

返回了一个图片的包 这个图片base64 那么用base64解出来图片应该就能看到flag了
拿到火狐解一下

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/91009013.jpg)

###11、WeirdCamel(白师傅做的)
> 提示：a.小骆驼的%和@真是蛋疼 b.嗯……URL转义有时候会失效 c.也许变量能够覆盖哦
题目：欢迎报名夏令营，请您仔细阅读公告，之后我们将会审核您的报名信息。http://question10.erangelab.com/

这个一开始完全没思路，500太坑，最后又来了个提示，变量覆盖（post:name=a&name=STATEMENT&name=register.pl），直接拿到了源码

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/13727897.jpg)

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/82014747.jpg)

可以直接命令执行（post: name=1&name=STATEMENT&name=|ls|）
然后翻了下目录，没找到flag，不过有个xnuca_looktheregisternews.pl

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/76746107.jpg)

源码:

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/21303771.jpg)

然后就是弹shell了，上py脚本，直接反弹shell出来
登mysql提示：
Access denied for user 'xnuca_user'@'localhost' to database 'xnuca_news_db' when using LOCK TABLES
我服，写了个py脚本去读所有字段，提示：
ImportError: No module named MySQLdb
我服，还打算写个php的，后来发现内核版本有点老啊，ubuntu的，上exp
https://www.exploit-db.com/exploits/37292/

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/7953510.jpg)

我服，又穿了，中午穿过一次了……
最后看师傅们都在使劲传脚本，弹shell，无奈了，太菜害怕被超，最后十几分钟干了点缺德事，抱歉抱歉……

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-1/45618409.jpg)

不过最后发现，删了以后有点亏，因为拿到了root密码xgsqggxwalspassw0rd，不知道是否通用啊，如果通用的话，那500也就可以拿下了……Orz

###12、OneWayIn
> 题目：How can I get in。http://question11.erangelab.com/

查看源码，发现`crc32($_POST['0kee_username']) === crc32($_POST['0kee_password'])`，弱类型数组绕过。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/48845989.jpg)，url有一个任意文件读取，file参数值需要base64编码一下，num参数是读取第几行数，尝试着读取`index.php`源码，得到：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/62064630.jpg)

做一下代码审计，发现，当`cookie`设置`role_cookie=flagadmin`时，才可以读取`flag.php`文件。读了一下发现`flag.php`被`phpjiami`加密了

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/99272920.jpg)

于是解密得：
```
<?php

	$iipp=$_SERVER["HTTP_HOST"];
	if ($iipp === '127.0.0.1') {
		echo 'ADwAcwBjAHIAaQBwAHQAPgBmAGwAYQBnAHsATAB6AFUAVgB6AEQATwBvAHgAeQBlAG4AYwA4AHAAagBUADkAdwBlAG8AUgB1AE4ATgBJAE8ATQA0AGIAUQAyAH0APAAvAHMAYwByAGkAcAB0AD4';
	}else{
		echo 'We need local...';
	}
?>
```
直接base64解密一下，得到flag

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-31/17441357.jpg)

---------

Team: JSSec
School: 西安科技大学


-------------

最后打进决赛了：

![](http://7xi72v.com1.z0.glb.clouddn.com/public/16-12-4/10241653.jpg)

![](http://7xi72v.com1.z0.glb.clouddn.com/public/16-12-4/44623095.jpg)
