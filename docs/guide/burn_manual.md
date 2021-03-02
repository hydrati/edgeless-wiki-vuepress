:::tip 提示
如果您不正在使用Windows10 64位系统或因为其他原因无法使用Edgeless Hub制作启动盘，您可以参考本篇教程手动完成启动盘的制作，且制作完成后的启动盘符合官方规范，可以在未来被Edgeless Hub等软件正确识别
:::

1. 下载依赖文件

从以下链接下载依赖文件：

* [Ventoy](https://www.ventoy.net/cn/download.html)（如果您正在使用linux，请下载linux版，本教程以Windows版为例）
* [ventoy wim插件](https://www.ventoy.net/cn/plugin_wimboot.html)
* [Edgeless ISO镜像](https://pineapple.edgeless.top/api/v2/info/iso_addr)

2. 安装Ventoy

解压从第一个链接下载到的`ventoy-xxx-windows.zip`，运行`Ventoy2Disk.exe`，选中您的目标设备，点击安装

![](https://pineapple.edgeless.top/picbed/wiki/img/145759.jpg)

3. 复制文件

在U盘内新建一个`ventoy`文件夹，将从第二个链接下载到的`ventoy_wimboot.img`复制到此文件夹内

![](https://pineapple.edgeless.top/picbed/wiki/img/152202.jpg)

使用压缩软件打开或直接双击挂载从第三个链接下载到的`Edgeless_xxxx_xxx.iso`，将其中的`sources/boot.wim`复制到U盘根目录，然后将其重命名为`Edgeless_xxxx_xxx.wim`

![](https://pineapple.edgeless.top/picbed/wiki/img/152504.jpg)

再复制其中的`Edgeless`文件夹到U盘根目录

![](https://pineapple.edgeless.top/picbed/wiki/img/152608.jpg)

4. 启动测试

重启电脑进入Edgeless，[如何启动](https://home.edgeless.top/guide/)