## 症状表现
* （多发）电脑显示`U+ 2.0 CHS EDD HDD+`然后提示按任意键重启
* 有U盘悬浮窗、加载提示等，但是explorer没有启动
* 在Windows Boot Manager界面报错
* 进入PE后蓝屏

![](https://pineapple.edgeless.top/picbed/wiki/images/QQpic20200616130533.jpg)

（图片来自内测群成员@人活着就是为了古贺朋绘）


![](https://pineapple.edgeless.top/picbed/wiki/images/QQpic20190531124822.jpg)

（图片来自内测群成员@重名 已做涂抹处理）


![](https://pineapple.edgeless.top/picbed/wiki/images/QQpic20190531130507.jpg)

（图片来自内测群成员@Scorpioღ）

## 原因分析
1. （常见）电脑年代久远，U+ HDD 2.0方案无法成功引导
1. 下载到了损坏的ISO镜像或在写入过程中出现了问题
2. U盘为劣质产品或者经历了频繁读写出现了物理损坏（比如长期使用NTFS作为U盘分区文件系统）
![](https://pineapple.edgeless.top/picbed/wiki/images/gos.png)

（图片来自内测群成员@F✺K✺B）

## 解决方法
1. 如果是出现`U+ 2.0 CHS EDD HDD+`字样并提示按任意键重启，请返回主系统，运行制作工具并使用`方案0-最大兼容`重新制作，或者查看[寄生启动](../playground/parasitism.md)章节进行寄生启动
2. （最简，无需重新写入）在 下载站Socket文件夹 内或 内测群群文件“离线制作”文件夹 内下载ISO镜像，使用ISO内的sources/boot.wim替换U盘内的sources/boot.wim
3. 如果仍然无法启动，将ISO文件与“启动盘制作工具.exe”放在同一目录内，然后运行“启动盘制作工具.exe”重新制作启动盘

> 一些其他解决方案
>  * 尝试对U盘进行坏道屏蔽
>  * 使用[Rufus](http://rufus.ie/)写入ISO到U盘
>  * 制作“[优启通](https://www.upe.net/)”或其他支持寄生启动Edgeless的PE启动盘，通过[寄生启动](../playground/parasitism.md)特性启动Edgeless