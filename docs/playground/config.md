# 功能开关

（原自定义一些功能）

:::tip 功能开关使用前提
在U盘的Edgeless文件夹内新建一个“Config”文件夹，在Config文件夹内进行操作
:::
* **启动时使用自定义分辨率/禁止自动调节分辨率**（Edgeless_Beta_2.2.0以上版本）：
新建一个文本文件命名为“分辨率.txt”，内容如下（PECMD DISP命令的参数）
```
w1024 h768 b32 f60
格式：宽(w) 高(h) 色位(b) 刷新率(f)
```
>注：
>1. **此开关在某些使用UEFI引导启动的场合下不适用**
>2. 将内容改为`DisableAutoSuit`可以阻止Edgeless设置分辨率，有效解决启动过程中因为分辨率过高导致显示器无法显示的问题
>3. 在Edgeless_Beta_2.2.0中，分辨率.txt应被放置在Edgeless文件夹内。在Edgeless_Beta_2.2.0以上版本中，放置在Edgeless文件夹内的分辨率.txt会被自动移动到Config文件夹内



* **使外置Launcher脚本的警告失效**（Edgeless_Beta_2.2.0以上版本）：新建`Developer`文件夹
（警告仍然会弹出，但是只是起到警示的作用，不会暂停外置批处理的运行）


* **禁用过期插件包检测与提醒功能**（Edgeless_Beta_2.2.0以上版本）：新建`NoOutDateCheck`文件夹


* **禁用U盘管家（桌面上的悬浮窗及其配套软件）**（Edgeless_Beta_3.0.0以上版本）：新建`DisableUSBManager`文件夹


* **禁用智能虚拟光驱**（Edgeless_Beta_3.0.6以上版本）：新建`DisableSmartISO`文件夹
禁用之后资源管理器将会接管.iso文件的关联



* **展开资源管理器上方功能区**（Edgeless_Beta_3.0.5以上版本）：
新建`UnfoldRibbon`文件夹


* **电源键默认重启**（Edgeless_Beta_3.1.0以上版本）：新建`RebootDefault`文件夹


* **禁用回收站**（Edgeless_Beta_3.0.6以上版本）：新建`DisableRecycleBin`文件夹



* **启用全局无人值守安装**（Edgeless_Beta_3.0.0以上版本）：
新建`AutoUnattend`文件夹：运行原版Windows镜像的setup.exe或使用NTSetup时，程序会自动使用Edgeless内置的无人值守文件作为系统安装的自动应答文件
>1. 理论上支持Windows7/8/8.1/10/2008/2008 R2/2012/2012 R2/2016/2019
>2. 基本能力：免填写安装序列号、自动开通免密码的Administrator账号（隶属于Administrators组）登录桌面；中文环境、时区选择、网络等等OOBE配置
>3. 方案来源于[无忧启动论坛](http://bbs.wuyou.net/forum.php?mod=viewthread&tid=414837)，感谢[chiannet](http://bbs.wuyou.net/home.php?mod=space&uid=282390)



*  **干预盘符整理过程**（Edgeless_Beta_3.0.0以上版本）：
  新建`UpActDrv`文件夹：将程序找到的第一块硬盘（通常是SSD）活动分区所在的盘符排在所有盘符之前（如果没有启用此开关，程序不改变硬盘分区盘符顺序，盘符排列的顺序和在磁盘管理软件中看到的一样）
  新建`WinFirst`文件夹：如果磁盘上没有活动分区，将程序找到的第一块硬盘（通常是SSD）含有Windows系统的分区盘符放在第一位；如果有活动分区，将含有活动分区所在的盘符排在第一位
>注：由于WinFirst开关实际上是UpActDrv的高级版本，因此如果同时打开了这两个开关，程序会使用WinFirst开关的方案



* **使用微PE同款的盘符整理方案**（Edgeless_Beta_3.0.5以上版本，感谢@VirallSHUO）：
>注：Edgeless自带的盘符整理程序与[victor888](http://bbs.wuyou.net/home.php?mod=space&uid=131142)大神发布的最新版本保持同步，至少为2019年及之后发布的版本；而此开关调用的盘符整理程序为victor888大神于2013-09-25发布的版本，因此如果您启用了此开关但是没有看到显著的效果属于正常现象

新建`OrderDrvAnotherWay`文件夹



* **禁用开机启动图（LoadScreen）**（Edgeless_Beta_3.1.0以上版本）：

新建`DisableLoadScreen`文件夹



* **挂载所有分区**（Edgeless_Beta_3.1.5以上版本）：

新建`MountEveryPartition`文件夹



# 自定义壁纸
（Edgeless_Beta_2.1以上版本）将壁纸图片转换为jpg格式并替换Edgeless文件夹内的`wp.jpg`
PS:在2.1.4以上的版本中，您可以在桌面右击选择更换壁纸（临时更换，重启后失效）


# 补充/替换Windows文件夹内的文件
（Edgeless_Beta_2.1.4以上版本）在Edgeless文件夹内新建一个`Windows`文件夹，这个目录内的文件（夹）将被覆盖复制到X:\Windows内


# 系统安装包文件夹 创建快捷方式
（Edgeless_Beta_2.2.0以上版本）将系统镜像（iso/wim/esd）放置在U盘**任意分区**的根目录内的`System`文件夹内，Edgeless会为其创建桌面快捷方式



# 自定义Launcher启动脚本（开发者选项）
将批处理文件命名为`Launcher.cmd`放在Edgeless文件夹内
>在Edgeless2.2.0以上版本中加入了外置Launcher安全警告，会造成不必要的时间浪费影响开发进度。
解决方案见上文"功能开关"章节


PS:如果需要在Launcher.bat的基础上制作Launcher.cmd，请在编辑时务必删除开头处用于调用新版Launcher的判断语句（有注释提示），防止出现死循环调用