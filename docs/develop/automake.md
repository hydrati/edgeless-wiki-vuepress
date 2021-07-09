# 使用Edgeless bot自动构建插件包

## 简介
插件包的构建是一个较为机械的流程，通常步骤如下：
1. 去绿色软件网站下载最新版的绿色软件
2. 将绿色软件适配为插件包，编写外置批处理
3. 上传Edgeless群文件等待管理员审核上架

此流程可以使用机器人自动完成，因此我们编写了Edgeless bot来代替人工执行这些过程。

机器人的运行使用GitHub Actions，构建触发为Push或每日00:00。机器人会从PortableApps网站自动抓取便携版软件更新信息，当存在更新时自动下载新版并制作成Edgeless插件包然后上传到Edgeless插件包服务器。

## 获取
打开Edgeless Hub，打包者名称后缀带（bot）的插件包即由Edgeless bot构建。

## 状态
![workflow status](https://github.com/EdgelessPE/edgeless-bot/actions/workflows/main.yml/badge.svg)

或者访问[GitHub Actions状态页面](https://github.com/EdgelessPE/edgeless-bot/actions)查看机器人的详细运行状况

## 开发
首先您需要具备以下基本能力：
* 拥有GitHub账号并且懂得如何提交Pull Request
* 会使用Node.js技术和npm（或yarn）包管理程序，知道如何全局安装node模块
* 了解插件包的原理和基础制作流程
* 能访问 PortableApps.com 并清楚如何下载绿色软件

然后[点击此处](https://github.com/EdgelessPE/edgeless-bot#开发)