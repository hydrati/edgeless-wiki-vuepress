# 其他姿势启动
**仅供参考，不提供具体的技术支持**。如果您有好的建议，欢迎在内测群反馈，感谢您的帮助！

由于Edgeless的启动加载具有**需要二次加载的特殊性**，如果不使用U盘刻录启动这种方式的话可能会在启动时遇到一些困难。

下面罗列了一些并不是很推荐使用的启动方式，感兴趣的同学们可以折腾一下玩玩

> PS:在实践这些启动方式之前，建议先了解一下如何使用UltraISO对Edgeless的镜像文件进行编辑。具体内容参考“**在虚拟机内启动**”章节。一般情况下，请使用编辑iso的方式对Edgeless进行自定义，**下面部分章节提到的在其他位置放置Edgeless文件夹的方式仅供理论参考，可能不可用！**

:::warning 注意
无论您采用何种方式启动Edgeless，请确保在U盘的根目录中存在`Edgeless`文件夹，此文件夹并非由您手动创建，而是从Edgeless的ISO镜像中复制得到
:::


## 获取ISO
[点击查看](../faq/getiso.md)


## 在虚拟机内启动
[点击查看](../develop/devenvironment.md)


## 使用DriveDroid挂载启动（参考）
[点击查看](https://www.coolapk.com/feed/11167765?shareKey=M2NmM2IyMjkzNjE1NWNhZGM0MTE~&shareUid=1077555&shareFrom=com.coolapk.market\_9.1-alpha3)

## 寄生启动
[点击查看](../playground/parasitism.md)



## 安装到移动硬盘
在写入Ventoy时勾选`配置文件-显示所有设备`，然后按照正常步骤完成制作

![](https://pineapple.edgeless.top/picbed/wiki/img/010154.jpg)



## 安装到本地硬盘
:::warning 警告
1. 此方法仅适用于Win8/8.1/低版本10系统；如果您的系统不符合安装条件，请在BIOS启用CSM后使用EasyBCD添加Edgeless的ISO镜像然后使用Legacy引导系统，但是我们非常不推荐使用这种做法。

2. 此安装方式的原理是替换系统的WinRE启动文件，如需要恢复WinRE请在PE中进入`系统：\Recovery\WindowsRE\`目录，将`Winre.wim.bak`覆盖`Winre.wim`
:::

正常制作U盘并启动Edgeless，运行`开始菜单-Edgeless服务-安装Edgeless到硬盘`后根据提示操作

![](https://pineapple.edgeless.top/picbed/wiki/img/011219.jpg)




:::tip 上文没有提到你想要的启动方式？
Edgeless提供的内核具有很高的精简度与自由度，其启动逻辑基本符合微软官方提供的WinPE的逻辑。因此您还可以以各种各样的方式启动Edgeless。

而要使其能正确使用Edgeless的插件等相关功能，您只需要做到：

**在某一盘的根目录内放置Edgeless文件夹**

Edgeless文件夹的内容必须符合规范（可通过挂载Edgeless官方提供的ISO镜像获取）。如果多个根目录下都存在符合条件的Edgeless文件夹，内核会选择初次启动时盘符相对靠前的进行操作
:::