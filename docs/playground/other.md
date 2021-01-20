# **仅供参考，不提供具体的技术支持**
>如果您有好的建议，欢迎在内测群反馈！感谢您的帮助

>由于Edgeless的启动加载具有**需要二次加载的特殊性**，如果不使用U盘刻录启动这种方式的话可能会在启动时遇到一些困难。
>下面罗列了一些并不是很推荐使用的启动方式，感兴趣的同学们可以折腾一下玩玩

>PS:在实践这些启动方式之前，建议先了解一下如何使用UltraISO对Edgeless的镜像文件进行编辑。具体内容参考“**在虚拟机内启动**”章节。一般情况下，请使用编辑iso的方式对Edgeless进行自定义，**下面部分章节提到的在其他位置放置Edgeless文件夹的方式仅供理论参考，可能不可用！**
<br/>

<br/>

# 获取ISO
在下载站的Socket文件夹内，或是在内测群的“离线制作”文件夹内找到ISO文件并下载；如果您已经使用过启动盘制作工具，您也可以在core文件夹中找到Edgeless.iso或是运行`辅助工具-生成ISO`


<br/>


<br/>


<br/>

## [在虚拟机内启动](Edgeless开发环境的搭建.md)
<br/>

## [使用DriveDroid挂载启动（参考）](https://www.coolapk.com/feed/11167765?shareKey=M2NmM2IyMjkzNjE1NWNhZGM0MTE~&shareUid=1077555&shareFrom=com.coolapk.market\_9.1-alpha3)
<br/>

## 寄生启动
依托于已有的PE启动Edgeless，见上一章节
<br/>


## 安装到移动硬盘
下载[Rufus](http://rufus.ie/)，选择Edgeless的ISO文件进行写入。注意勾选“高级设备选项——显示USB外置硬盘”
![](images/QQ图片20190816131311.png)

<br/>

## 安装到本地硬盘启动（不推荐）
1、使用UltraISO打开Edgeless的ISO文件，将Edgeless文件夹复制到硬盘某一分区的根目录内，然后**删除ISO文件内的Edgeless文件夹**，保存并关闭。将编辑好的ISO文件放置在硬盘某一目录内（建议目录名不要出现中文，否则可能导致bug）
2、对Edgeless文件夹进行操作（添加插件等）
3、下载并运行EasyBCD，添加启动项。
![](images/EasyBCD添加ISO镜像启动项GIF教程_314.jpg)
4、重启进入引导界面（推荐使用按住Shift键点击重启），选择Edgeless即可进入。
**PS:注意，可能需要在BIOS内打开CSM方可正常使用。这可能会导致进入正常系统时开机速度变慢，因此我们不推荐将Edgeless安装到本地硬盘启动**

<br/>

<br/>

# 上文没有提到你想要的启动方式？
## Edgeless提供的内核具有很高的精简度与自由度，其启动逻辑基本符合微软官方提供的WinPE的逻辑。因此您还可以以各种各样的方式启动Edgeless。而要使其能正确使用Edgeless的插件等相关功能，您只需要做到：
> ## **在启动后的Edgeless能识别出的某一盘的根目录内（可以是本地硬盘或可移动存储设备）存在Edgeless文件夹**
## Edgeless文件夹的内容可以通过挂载Edgeless官方提供的ISO镜像获取。如果多个根目录下都存在符合条件的Edgeless文件夹，内核会选择初次启动时盘符相对靠前的进行操作
