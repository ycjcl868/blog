---
title: 腾讯云极速配置NodeJS+LNMP运行环境
---
> 需求： 之前使用 `PHP+Mysql` 做开发，近年来`NodeJS`有点火，且不需要`Apache`、`Nginx`、`Tomcat`做容器，想在不影响之前`PHP`开发环境下，也能体验`NodeJS+Mysql`玩法。国内搜索了很多也没有发现有关`LNMP+Nodejs`的具体部署教程，于是踩了很多坑，终于配出了**NodeJS+LNMP+PHPMyAdmin**

## 一、购买服务器

#### 1.选择服务器配置
因为NodeJS**异步**、**非阻塞**的特性，所以**多核CPU**对NodeJS算比较浪费吧，所以主要提高内存的大小，所以选了**腾讯云1核、2G 内存**的服务器。

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/55884377.jpg)

#### 2.选择镜像
> 这个比较重要，镜像要是选得好，配置起来各种高效率。这里我推荐的系统是**CentOS 7+**  (主要是因为CentOS 6使用的是Python 2.6，**yum**各种坑，想升级成Python 2.7坑还多)。

镜像选择 **PHP运行环境（CentOS7.1 64位 Nginx | PHP多版本）**，**腾讯云**里的服务提供商**上海微柳**这家提供的`oneinstack` 太强大了，工具和文档都很详细，并且和其它的镜像不一样的是，`ssh`连接时，会有暗红高亮，相当好用。然后直接买、买、买就行了（较其它主机提供商，腾讯云的学生机相当给力）。



![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/19776864.jpg)




然后就配好了，访问服务器80端口，下载镜像的文档(超级方便的各种脚本)：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/80203594.jpg)

## 二、基本配置

> 注意：有些服务器需要在腾讯云的控制台上设置安全组，不然22端口将无法开放，就会导致才买的服务器通过`ssh`连不上。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/53347020-file_1487151858921_15c5a.png)

首先开启FTP，方便传文件：
#### 1.开启FTP服务器
`service pureftpd start`开启，这样就可以配置FTP了。  首先进入`oneinstack`目录 -> 运行`./pureftpd_vhost.sh` -> 添加一个FTP用户

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/72972548.jpg)


#### 2.更改Mysql密码
`oneinstack`目录下，运行 `./reset_db_root_password.sh`，输入数据库密码。
![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/68090101.jpg)


## 三、配置NodeJS

#### 1.yum更新

主要的目的是为了当npm安装比较"娇气"的模块时不报错。

```bash
$ yum -y update
$ yum -y install zlib-devel curl-devel openssl-devel perl cpio expat-devel gettext-devel openssl zlib autoconf tk perl-ExtUtils-MakeMaker gcc make gcc-c++ openssl-devel wget
```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/12134840.jpg)





#### 2.安装`NodeJS`
这里采用`nvm`来安装`nodejs`，是因为`nvm`对`nodejs`进行版本管理，这就方便多了，比如我`Ghost`博客的`Node`版本只能是`0.10.x || 0.12.0`。而一般用的，是`4.x.x`了。所以非常有必要。

```bash
$ git clone https://github.com/creationix/nvm.git ~/.nvm
$ source ~/.nvm/nvm.sh
$ vi ~/.bashrc 或者 ~/.profile 或者 ~/.zshrc`
$ nvm install node版本号
```

这样的话，下次ssh上去时，才不会发现`nvm`未安装。
参考[nvm的Usage](https://github.com/creationix/nvm)

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-5/30105026.jpg)



> 安装完 node 后，安装一下 [nrm](https://github.com/Pana/nrm) ，用于更换 `npm` 源，加快模块安装速度。

```bash
// 安装nrm
$ npm install -g nrm
// 查看下有哪些好用的源
$ nrm ls
// 切换cnpm源
$ nrm use cnpm
```


#### 3.安装forever模块，永久运行node

```bash
$ npm install -g forever
```
![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-5/60815964.jpg)


## 四、配置Ngnix

#### 1.虚拟主机的配置
新建后，会在产生2个重要文件(以我的域名test.ycjcl.cc为例)

```
虚拟主机的配置文件(到时候运行nodejs时，需要更改成反向代理):             /usr/local/nginx/conf/vhost/test.ycjcl.cc.conf
项目目录(node项目，可以通过ftp传上去):                 /data/wwwroot/test.ycjcl.cc
```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-4/56277679.jpg)


#### 2.防火墙设置
这里我生成了一个`express`项目，端口为3000，但是并不能访问到3000端口

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-5/6929252.jpg)

需要防火墙忽略3000端口，所以执行以下命令：

```bash
// 允许 3000 端口
$ iptables -I INPUT 4 -p tcp -m state --state NEW -m tcp --dport 3000 -j ACCEPT
// 保存 iptables 规则
$ service iptables save
```

就可以ip+端口访问了：

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-5/9495109.jpg)


#### 3.将node服务和域名进行绑定
修改配置：**(中间的location都删了，直接加这个)**

```bash
$ vi /usr/local/nginx/conf/vhost/test.ycjcl.cc.conf
```

```bash
    location /
    {
        proxy_redirect off;
        proxy_set_header   X-Real-IP            $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host                   $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection "";
        proxy_http_version 1.1;
        proxy_pass        http://127.0.0.1:3000;
    }
```

然后重启nginx ,`service nginx restart`

然后用域名访问成功，！！！

![](http://7xi72v.com1.z0.glb.clouddn.com/16-11-5/58499048.jpg)

需要 phpMyAdmin,直接用 `ip/phpMyAdmin`，可以进行mysql的管理。



## 五、安装Mongodb(可选)
#### 1.首先将mongodb源添加到yum中。`vim /etc/yum.repos.d/mongodb.repo`编辑添加以下内容：

**如果是64位CentOS 7系统**

```bash
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-31/76029784.jpg)

**如果是32位系统**

```bash
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/i686/
gpgcheck=0
enabled=1
```

###### 2.先更新yum，然后安装mongodb

```bash
// 更新
$ yum -y update
// 安装mongodb
$ yum -y install mongodb-org mongodb-org-server
```

###### 3.运行mongodb(默认27017端口)
```bash
$ systemctl {start|status|stop} mongod
```

![](http://7xi72v.com1.z0.glb.clouddn.com/16-8-31/35405771.jpg)

> 注意：从MongoDB“赎金事件”中，建议一定要使用`db.addUser`和`db.changeUserPassword`更改用户名和密码。

## 六、常见问题

> 如果重装系统，ssh上去时，出现以下错误，用`ssh-keygen -R IP地址` 来解决

![](http://7xi72v.com1.z0.glb.clouddn.com/16-7-22/68866015.jpg)

> 有时候开启node服务时，提示某个端口被占用。此时要用命令查看端口`fuser -n tcp 端口号`，或查看服务`ps -ef | grep 服务名`，kill掉`kill -9 pID进程号`。如果大型访问量时，优雅软重启的使用`kill -HUP pID进程号`。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-2-15/83014875-file_1487151517505_2138.png)
