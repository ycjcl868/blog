---
title: Firefox+burpsuite抓取https的正确姿势
---
> 坑了好久，抓取成功与否，与 java版本、证书、firefox配置息息相关。

## 环境要求
* java 1.7以下，我用的 1.6
一定要1.7以下，如果1.7 firefox 以上会提示 `The client failed to negotiate an SSL connection to no cipher suites in common`

## 步骤
#### 配置代理
burpsuite 则在 Proxy -> Options 里，设置端口
firefox 里在 Preferences -> Advanced -> Network 配置与 burpsuite 相同的ip和端口，记住勾选上应用到所有协议。![image.png | left | 720x376](https://cdn.yuque.com/yuque/2018/png/85694/1523430166991-42b8dab7-8eb2-45b3-899a-6cb0caacc94d.png "")

#### 安装证书
地址栏访问：http://burp  点击 CA Certificate 下载证书。![image.png | left | 748x321](https://cdn.yuque.com/yuque/2018/png/85694/1523430098907-a8971389-83bf-4069-9b1e-006269351270.png "")

然后在 Preferences -> Advanced -> Certificates -> Security Devices -> Authorities ，导入下载的证书，勾选信任。
![image.png | left | 554x255](https://cdn.yuque.com/yuque/2018/png/85694/1523430693539-8c09d026-9a77-4105-ab1c-bd01d846f4eb.png "")


#### 配置firefox
地址栏访问 `about:config` ，找到 `security.ssl3.dhe_rsa_aes_128_sha` 和 `security.ssl3.dhe_rsa_aes_256_sha` 将两个设置成 `false` ![image.png | left | 748x378](https://cdn.yuque.com/yuque/2018/png/85694/1523429980123-2a1d55a5-e65a-4db5-a8c4-92ff47388d71.png "")

## 成功抓取
![image.png | left | 680x456](https://cdn.yuque.com/yuque/2018/png/85694/1523430506112-efa43095-96f8-4d77-ba5a-22561dcb6fd2.png "")

> 之前踩了两个坑，一个是 java 版本过高1.8，导致抓取不了，google好久未能解决。另一个是 firefox ssl 配置不对，也抓取不了。

