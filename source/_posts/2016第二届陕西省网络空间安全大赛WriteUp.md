---
title: 2016第二届陕西省网络空间安全大赛WriteUp
---
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/88204668.jpg)

#####2016年5月27号(比赛前夜)
比赛前一天晚上，入驻`陕西电子商务酒店`。进行签到，发比赛服装(真心不好看，最后也没穿过)
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/31523174.jpg)
还没开始比赛，酒店里都开打起来了，wifi都被玩坏，最后连本地的DNS都被篡改了。（我为了防止`中间人`，拿下一个路由器，在管理界面开了`AP隔离`）
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/45933516.jpg)
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/74528206.jpg)
然后在酒店里，看了会电影就早早休息了。

#####2016年5月28号(正式比赛)
有选择题和实践题，俩队员在弄选择题时，我去拿了`web1`的一血。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/62433167.jpg)
-------
######0x01 web
是一道代码审计题，发包，返回了源代码：

```php
<?php
  if (isset($_GET['view-source'])) {
  header('Location: http://challenge1.xa.honyasec.com/index.php');
  show_source(__FILE__);
         exit();
    }
if (isset($_POST["submit"]))
{
  if (isset($_POST['hihi']))
  {
    if (ereg("^[a-zA-Z0-9]+$", $_POST['hihi']) === FALSE)
    {
      exit('<script>alert("have fun:)")</script>');
    }
    elseif (strlen($_POST['hihi']) < 11 && $_POST['hihi'] > 999999999)
    {
      if (strpos($_POST['hihi'], '#HONG#') !== FALSE)
      {
        if (!is_array($_POST['hihi'])) {
        include("flag.php");
        echo "Congratulations! FLAG is : ".$flag;
        }
        else
      {
        exit('<script>alert("nonono")</script>');
      }
      }
      else
      {
        exit('<script>alert("nonono")</script>');
      }
    }
    else
    {
      exit('<script>alert("sorry")</script>');
    }
  }
}
?>
<a href="?view-source">view-source</a>
```

根据正则表达式，构造绕过拿到`flag`:

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/1501704.jpg)

######0x02 web
web2是一道综合题，先是`password`注入，队员用`sqlmap`跑出来密码为空，用不了。最后发现是文件包含，但是一直没绕过。赛后问出题人，就这个题要先用`action`参数到根目录，然后再文件包含该目录下的文件。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/20436834.jpg)

######0x03 xxx(题目太多，记得不清)
一道社工题，flag就是该人的身份证号。队员社工到：`杜伟M 14010619841****812 2011-11-15 11:37:3313663513074山西省太原市迎泽区朝阳街1号5楼3  ***`然后，只有四位，写个脚本判断身份证是否正确：

```python
# -- coding: utf-8 --
import requests
url = ''

import re
#Errors=['验证通过!','身份证号码位数不对!','身份证号码出生日期超出范围或含有非法字符!','身份证号码校验错误!','身份证地区非法!']
def checkIdcard(idcard):
    Errors=['验证通过!','身份证号码位数不对!','身份证号码出生日期超出范围或含有非法字符!','身份证号码校验错误!','身份证地区非法!']
    area={"11":"北京","12":"天津","13":"河北","14":"山西","15":"内蒙古","21":"辽宁","22":"吉林","23":"黑龙江","31":"上海","32":"江苏","33":"浙江","34":"安徽","35":"福建","36":"江西","37":"山东","41":"河南","42":"湖北","43":"湖南","44":"广东","45":"广西","46":"海南","50":"重庆","51":"四川","52":"贵州","53":"云南","54":"西藏","61":"陕西","62":"甘肃","63":"青海","64":"宁夏","65":"新疆","71":"台湾","81":"香港","82":"澳门","91":"国外"}
    idcard=idcard.strip()
    idcard_list=list(idcard)
    #地区校验
    if(not area[(idcard)[0:2]]):
        print idcard+" "+Errors[4]
    #15位身份号码检测
    if(len(idcard)==15):
        if((int(idcard[6:8])+1900) % 4 == 0 or((int(idcard[6:8])+1900) % 100 == 0 and (int(idcard[6:8])+1900) % 4 == 0 )):
            erg=re.compile('[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$')#//测试出生日期的合法性
        else:
            ereg=re.compile('[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$')#//测试出生日期的合法性
        if(re.match(ereg,idcard)):
            print idcard+" "+Errors[0]
        else:
            print idcard+" "+Errors[2]
    #18位身份号码检测
    elif(len(idcard)==18):
        #出生日期的合法性检查
        #闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
        #平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
        if(int(idcard[6:10]) % 4 == 0 or (int(idcard[6:10]) % 100 == 0 and int(idcard[6:10])%4 == 0 )):
            ereg=re.compile('[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$')#//闰年出生日期的合法性正则表达式
        else:
            ereg=re.compile('[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$')#//平年出生日期的合法性正则表达式
        #//测试出生日期的合法性
        if(re.match(ereg,idcard)):
            #//计算校验位
            S = (int(idcard_list[0]) + int(idcard_list[10])) * 7 + (int(idcard_list[1]) + int(idcard_list[11])) * 9 + (int(idcard_list[2]) + int(idcard_list[12])) * 10 + (int(idcard_list[3]) + int(idcard_list[13])) * 5 + (int(idcard_list[4]) + int(idcard_list[14])) * 8 + (int(idcard_list[5]) + int(idcard_list[15])) * 4 + (int(idcard_list[6]) + int(idcard_list[16])) * 2 + int(idcard_list[7]) * 1 + int(idcard_list[8]) * 6 + int(idcard_list[9]) * 3
            Y = S % 11
            M = "F"
            JYM = "10X98765432"
            M = JYM[Y]#判断校验位
            if(M == idcard_list[17]):#检测ID的校验位
                print idcard+" "+Errors[0]
            else:
                print idcard+" "+Errors[3]
        else:
            print idcard+" "+Errors[2]
    else:
        print idcard+" "+Errors[1]

for i in range(0,2):
	for j in range(0,9):
		for k in range(0,9):
			for m in range(0,9):
				str = '14010619841%s%s%s%s812' % (i,j,k,m)
				checkIdcard(str)


```

最后跑出来：
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/92346919.jpg)

######0x03 xxx(题目太多，记得不清)
题目是:`随手加密了个md5——c44c6bfe1ba4ca9a3fd4df785eb8440e，只想着明文是：flag{xxxx_hello_world_xxxxx}这种格式，xxxx是1000-9999之内数字，xxxxx是60000-99999之间的数字`。写个小脚本跑出来：

```python
# -- coding:utf-8 --
#
#
import hashlib

a = 'c44c6bfe1ba4ca9a3fd4df785eb8440e'

for i1 in range(1000,9999):
    for i2 in range(60000,99999):
        md5 = hashlib.md5()
        b = 'flag{%04d_hello_world_%05d}'%(i1,i2)
        md5.update(b)
        if md5.hexdigest() == a:
        	print '%s   %s' %(md5.hexdigest() b)

```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/65035307.jpg)

######0x04 上传绕过
直接上传一个一句话图片木马，`content-type`改成`image`形式，`filename`改成`pht`绕过：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/86816367.jpg)

######0x05 PS拼接
题目给了:![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/48983431.jpg)，根据二维码生成特点，应该是有三个"回"字形，所以，左上角那个小的块，应该是要放大的。然后把每个块弄成透明，拼在一起：
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/88359469.jpg)
解出来`flag{eecece36874e068e18df9e565351bd53}`

######0x06 web代码审计

```php
<?php
$IsMatch= preg_match("/hongya.*ho.*ngya.{4}hongya{3}:\/.\/(.*hongya)/i", trim($_POST["id"]), $match);
if( $IsMatch ){
  die('Flag: '.$flag);
}
?>
```

直接绕过:

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/89508151.jpg)

######0x07 代码审计

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/66541493.jpg)

序列化问题，先写个php序列化程序读取文件：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/10891244.jpg)

######0x08 Misc2
修复一下PNG头，得到:

![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/61045325.jpg)

######中间有很多题忘记了，说下渗透3吧
 前两个队员直接拿到系统权限，创建了用户，交了flag,flag3是一个加密的rar，先说是6位的爆了好久都没有·出来，最后比赛结束，说是4位的于是就出来了。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/21571959.jpg)
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/38692080.jpg)

最后是第11名，拿了三等奖。认识自身不足，以后加以改进。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/56826209.jpg)
![](http://7xi72v.com1.z0.glb.clouddn.com/16-5-29/4223876.jpg)
