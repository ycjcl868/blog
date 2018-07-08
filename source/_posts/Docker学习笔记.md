---
title: Docker学习笔记
---
> 在美团∙点评前端基础技术团队里，需要装`Docker`，平台运行测试在`Docker`里，于是有了下文的`Docker`入坑记。


## 下载

[Docker官网地址](https://docs.docker.com/engine/installation/)

[各种系统版本(Windows/MacOS/Linux)](https://docs.docker.com/engine/installation/#platform-support-matrix)


装好后，就是个小鲸鱼的图标，

![](http://7xi72v.com1.z0.glb.clouddn.com/17-3-13/46642938-file_1489389332728_d5e7.png)

## 使用

一般使用是在`终端`里，所以打开终端，先运行三条命令，测试下`docker`安装情况：

```bash
$ docker --version
Docker version 17.03.0-ce, build 60ccb22

$ docker-compose --version
docker-compose version 1.11.2, build dfed245

$ docker-machine --version
docker-machine version 0.10.0, build 76ed2a6
```

#### 开启容器
这里，运行`nginx`，将本机的80端口映射到`docker`里的80端口，容器名为`webserver`

```bash
$ docker run -d -p 80:80 --name webserver nginx
```

然后访问`http://localhost`，就看到配好的`nginx`。

![](http://7xi72v.com1.z0.glb.clouddn.com/17-3-13/71278965-file_1489389325557_1792b.png)

#### 关闭容器

关闭容器，先得知道`容器的id`，所以这里先查看一下`容器的id`,使用`docker ps -a`或者`docker images`

```bash
$ docker ps -a

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                     PORTS               NAMES
96d00fcc948b        nginx               "nginx -g 'daemon ..."   19 minutes ago      Exited (0) 5 minutes ago                       webserver
```

然后有一个id号`96d00fcc948b`，关闭时，只需要输入前几名就可以了，

```bash
$ docker stop 96d0
```

#### 删除容器

输入`docker`镜像的`name`名(查看方法用`docker ps -a`)，删除就用

```bash
$ docker rm -f webserver1
```

### 在Docker里安装Kali

- 首先在终端输入(使用了国内的镜像，官方的超级慢)

```bash
$ docker pull hub.c.163.com/vamvam/kalilinux:latest
```

- 安装完成后，查看下镜像

```bash
$ docker images
```

- 直接运行

```bash
$ docker run --name Kali -t -i hub.c.163.com/vamvam/kalilinux /bin/bash
```

- 更新各种软件

因为使用了国内镜像，所以 `apt-get` 的源也是国内的，非常之快

```bash
$ apt-get update && apt-get upgrade && apt-get dist-upgrade -y
```

安装渗透工具

```bash
$ apt-get install metasploit-framework nmap git sqlmap websploit kali-linux-wireless aircrack-ng pciutils
 -y
```


- 安装完后，需要保存容器状态， Ctrl-p + Ctrl-q.

```bash
$ docker commit -m "add hydra" 容器id REPOSITORY
```

![](http://i1.piimg.com/567571/a62ce4d543bd125d.png)

为了与本机Mac实现共享数据，在 Mac 中新建了一个共享空目录 `/Users/jcl/Desktop/Kali_File` ，在 `Kali` 中新建了一个目录 `/jcl`  ，然后使用在 `docker run` 命令之后添加 `-v /Users/jcl/Desktop/Kali_File:/jcl` 来挂载本机目录。


退出时，直接输入 `exit` 。
使用时，输入自定义的命令开启(我在 `.zshrc` 中的自定义)



```bash
$ vim ~/.zshrc 或者 ~/.bash_profile

alias="alias run-kali="docker run -it -v /Users/jcl/Desktop/Kali_File:/jcl kali /bin/bash"
```

![](http://i4.buimg.com/567571/cc1ab98331f6fb91.png)


$ docker build -t {hash} .
$ docker ps
$ docker kill {containerName}
$ docker run -d -P {hash}



> 参考: [Kali Linux and Metasploit With Docker](https://miteshshah.github.io/mac/kali-linux-and-metasploit-with-docker/)、[10张图带你深入理解Docker容器和镜像](http://dockone.io/article/783)、[在docker容器中运行kali linux ](http://wobushi.cn/?p=123123308)、[Docker从入门到实践](https://xudafeng.github.io/slide/archives/docker-in-practice/)
