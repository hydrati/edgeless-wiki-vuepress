:::warning 您可以不经过Edgeless团队的同意自由更改发布插件作品，但是请不要忘记您的道德操守。

我们不希望看到有违反Edgeless三无精神（无劫持、无广告、无收费）或是违反中华人民共和国相关法律条款的作品出现，也不会承认此类作品与我们有任何关系。

继续开发视为您已经同意此条款
:::

> 如果您希望能上架您的插件包，请[加入内测交流QQ群](https://home.edgeless.top/jump/qqg.html)进行提交


# Edgeless插件载入原理
Edgeless内核启动完成之后，会运行一个脚本。这个脚本即为Launcher.bat（其内容也可以被用户自定义）。

默认情况下，该脚本会查找插件存放的位置，先将所有.7z压缩包解压到%ProgramFiles%\Edgeless，然后并发执行%ProgramFiles%\Edgeless目录下的所有.cmd和.wcs（pecmd脚本）文件，这些脚本文件（即**外置批处理**）将完成各自软件的setup设置。
外置批处理的生命周期被设计为一次性，被执行后他们将会被移动到“安装程序”文件夹内
所以，插件包通常拥有这样的结构：
* 一个文件夹（包含目标程序及其需要的文件）
* 一个.cmd或.wcs脚本（即**外置批处理**，用于执行绿化安装操作）

![](https://pineapple.edgeless.top/picbed/wiki/images/picture13.png)

开发者在为脚本和文件夹命名时要尽可能避免与其他项目重名，保证自己插件的运行目录里面不会出现奇怪的东西（文件夹重名会导致所有重名插件的内容被释放到同一个文件夹，可能会引起错误。当然，根据这个原理也可以开发针对某个插件的拓展包）

<br/>

# 插件包命名规范
新上架的插件包名称格式统一为`名称_版本号_制作人.7z`，版本号一般取4位

例如：`我的绿色软件_1.0.0.0_卡诺.7z`
<br/>

# 典型开发步骤
 ## 一、移植绿色软件
### Step1 测试使用
解压文件，然后在Edgeless环境中测试该程序是否可以直接使用
如果可用，请跳转到Step2

如果不可用，这就比较麻烦了,尝试找到出错原因——如缺失dll文件，就从本地系统（建议从Windows10 64位系统中提取）或网络上找到相应的dll文件放到主程序所在目录或system32/SysWOW64等文件夹内或者注册此dll后再次尝试
> 可以在下载站的`开发辅助`文件夹内下载SxsTrace辅助诊断工具，或者[查看暴力封装教程](force.md)；如果需要.net框架的支持请到运行环境`文件夹内获取.net框架插件

### Step2 打包程序
如果一切顺利，你的程序能够在Edgeless内成功运行了，那么接下来就是打包环节。在这个环节里，你将要为软件的完美运行铺好路。
创建一个文件夹，把绿色版的程序放到这个文件夹（下文简称目标文件夹）内。对程序的配置文件进行优化（并尽可能删除个人使用信息）
>（其实Step2没啥东西，看到这里就可以直接跳到Step3了）

如果需要补充dll或者其他文件，将这些文件放置在目标文件夹内并通过合适的方式编写批处理文件释放他们。
例：需要注册run.dll文件
编写批处理，内容为：
```
regsvr32 run.dll
```
例：需要删除%ProgramFiles%内的refuserun.exe并补充一些dll文件（dll存放在dll文件夹内）
编写批处理，内容为：
```
::删除refuserun.exe
del /f /q %ProgramFiles%\refuserun.exe
::补充dll到SysWOW64文件夹
copy *.dll X:\Windows\SysWOW64\*.dll
```
将以上代码保存在setup.cmd内并放置在目标文件夹中即可
需要其他操作也请一并安排好
*****
### Step3 编写外置批处理
首先需要选择使用cmd格式还是wcs格式的外置批处理，这取决于外置批处理的内容

如果不需要cmd的特有命令，且内容大部分为pecmd脚本，请使用wcs格式（推荐使用）
如果需要用到cmd的特有命令，请使用cmd格式
> wcs脚本与cmd脚本互转——添加/删除pecmd前缀即可：
> 
> wcs： exec %ProgramFiles%\run.exe
> 
> cmd：***pecmd*** exec %ProgramFiles%\run.exe
> 
<br/>

**wcs：如果该插件包只需要创建快捷方式 且/或 进行不太复杂的操作，那么建议使用wcs格式**
新建一个文本文件，命名为“安装我的绿色软件.wcs”，这个批处理和目标文件夹（此处命名为“我的绿色软件”）放在同一个目录内，内容为
```
//创建桌面快捷方式“绿色软件”，指向"X:\Program Files\Edgeless\我的绿色软件\program.exe"
link "X:\Users\Default\Desktop\绿色软件","X:\Program Files\Edgeless\我的绿色软件\program.exe"
```
<br/>

如果需要执行setup.cmd，则写成这样：

```
//创建桌面快捷方式“绿色软件”，指向"X:\Program Files\Edgeless\我的绿色软件\program.exe"
link "X:\Users\Default\Desktop\绿色软件","X:\Program Files\Edgeless\我的绿色软件\program.exe"
//静默运行setup.cmd（！表示静默运行，去掉则显示运行窗口）
exec !"X:\Program Files\Edgeless\我的绿色软件\setup.cmd"
```
<br/>

甚至，如果还需要执行一些要求不是很高的cmd命令，可以使用这样的写法：


```
//创建桌面快捷方式“绿色软件”，指向"X:\Program Files\Edgeless\我的绿色软件\program.exe"
link "X:\Users\Default\Desktop\绿色软件","X:\Program Files\Edgeless\我的绿色软件\program.exe"
//静默运行setup.cmd（！表示静默运行，去掉则显示运行窗口）
exec !"X:\Program Files\Edgeless\我的绿色软件\setup.cmd"
//调用cmd命令创建X:\Users\Icon文件夹（=表示等待运行结束，即等待exec后面的程序运行完再执行下一条命令）
exec =cmd /c "md X:\Users\Icon"
```
<br/>

<br/>

**只能使用wcs的情况：**

如果需要执行的代码中频繁 且/或 大量调用了pecmd，那么外置批处理只能使用wcs格式

以WindowsGame插件包为例

开始时，插件包外置批处理采用了cmd格式，内容为：
```
pecmd link "%Programs%\游戏\扫雷","X:\Program Files\Edgeless\game\saolei.exe"
pecmd link "%Programs%\游戏\中国象棋","X:\Program Files\Edgeless\game\chess.exe"
pecmd link "%Programs%\游戏\三维弹球","X:\Program Files\Edgeless\game\3DPinball\pinball.exe"
pecmd link "%Programs%\游戏\纸牌","X:\Program Files\Edgeless\game\cards\sol.exe"
pecmd link "%Programs%\游戏\蜘蛛纸牌","X:\Program Files\Edgeless\game\spidercards.exe"
```
由于cmd在调用pecmd执行命令时不会与pecmd异步，如果pecmd处于被占用的状态，正在执行某一指令，而此时cmd又发来一条指令，那么他很有可能忽略掉当前发来的这条指令，这就会导致部分指令未被执行的bug。

解决方法就是将cmd脚本改写为wcs脚本，代码段去掉开头的“pecmd ”，内容如下：
```
link "%Programs%\游戏\扫雷","X:\Program Files\Edgeless\game\saolei.exe"
link "%Programs%\游戏\中国象棋","X:\Program Files\Edgeless\game\chess.exe"
link "%Programs%\游戏\三维弹球","X:\Program Files\Edgeless\game\3DPinball\pinball.exe"
link "%Programs%\游戏\纸牌","X:\Program Files\Edgeless\game\cards\sol.exe"
link "%Programs%\游戏\蜘蛛纸牌","X:\Program Files\Edgeless\game\spidercards.exe"
```


**cmd:  如果脚本包含只能用cmd批处理文件才能做到的命令或是使用cmd批处理编写更方便时，推荐使用cmd格式**

例如：需要用到一些无法使用pecmd脚本完成的复杂处理任务
（此处演示的需要比较简单，仅供参考）
*****
新建一个批处理“安装我的绿色软件.cmd”，这个批处理和目标文件夹（此处命名为“我的绿色软件”）放在同一个目录内，内容为
```
::创建桌面快捷方式“绿色软件”，指向"X:\Program Files\Edgeless\我的绿色软件\program.exe"
pecmd link "X:\Users\Default\Desktop\绿色软件","X:\Program Files\Edgeless\我的绿色软件\program.exe"
::切换工作目录到“我的绿色软件”文件夹
cd /d %~dp0我的绿色软件
::使用call命令调用安装批处理文件
call setup.cmd
exit
```
##### 注意：不使用cd命令切换目录直接使用call可能会出现问题！早期的部分Edgeless插件使用了以下写法，现在并不推荐使用！
```
pecmd link "X:\Users\Default\Desktop\绿色软件","X:\Program Files\Edgeless\我的绿色软件\program.exe"
call "X:\Program Files\Edgeless\我的绿色软件\setup.cmd"
exit
```

在最后一行加上exit，否则批处理运行结束后cmd窗口可能不会马上退出，导致后台出现cmd.exe残留

### Step4 完成整理

恭喜，你已经集齐了一个插件包正常工作的所有必要文件！当这个插件包被载入时，Edgeless内核会执行“安装我的绿色软件.cmd”或“安装我的绿色软件.wcs”这个批处理文件（当然你也可以同时放置x个cmd和y个wcs，这些批处理都会被执行），然后通过这个外置批处理来执行插件包安装的相关事项

当然，你也可以把setup.cmd的内容完全放在外置批处理中（使用cd命令切换目录即可）

### Step5 压缩为7z
完成后，将文件夹与外置批处理压缩为7z格式的压缩包，在Edgeless中进行测试和调试，最终完成插件的开发
![](https://pineapple.edgeless.top/picbed/wiki/images/screenshot_1579783771844.png)



> 为了方便开发者调试外置批处理，我们特地开发了插件。请下载使用“开发辅助-插件加载工具”插件包

:::warning 注意
1. 外置批处理被设计为一次性使用的脚本，在完成其使命后将会被移动到“安装程序”文件夹内。因此，请不要依赖外置批处理进行安装（绿化）外的其他操作
2. 由于CMD的path查找缺陷，编写cmd格式外置批处理时请先用pecmd link命令创建快捷方式再cd并call文件夹内的批处理，否则可能导致快捷方式无法被创建
3. 由于CMD的for指令设计缺陷，**外置批处理名称中不能带有空格**，否则可能导致加载失败
4. 如果某些操作需要重启explorer，您可以省略重启explorer这一步骤。在加载全部完成后，Launcher会重启一次explorer。如果仍旧需要重启explorer，请使用如下命令：

cmd脚本：`pecmd kill explorer`

wcs脚本：`kill explorer`
:::

### 拓展阅读（以cmd格式为例，去除pecmd前缀即可转换为wcs格式）：
添加快捷方式并追加参数的命令如下：
```
pecmd link "X:\Users\Default\Desktop\Chrome","X:\Program Files\Edgeless\Chrome49\App\chrome.exe",https://www.baidu.com
```

>为开始菜单添加快捷方式的命令如下：
```
pecmd link "%Programs%\引导编辑\BOOTICEx64","%ProgramFiles%\Edgeless\BOOTICEx64.exe"
```

>添加全局快捷键（慎用！注意与其他常见快捷键的冲突）
```
pecmd HOTK #121,%ProgramFiles%\Edgeless\Orderdrv\orderdrv.cmd        `F10 理顺盘符`
```
>从哪能找到pecmd脚本（即wcs格式）的详情？
注：从3.0.0版本开始，托盘处的pecmd为英文版本，需要中文版本请运行`xcmd`

![](https://pineapple.edgeless.top/picbed/wiki/images/p23.png)


## 二、自己编写脚本
这一开发方案需要开发者具有一定的批处理和/或pecmd脚本编写基础，通常可用于编写自定义执行维护操作的插件。


如果是通过脚本进行维护操作，那么通常情况下插件包内只需要存在一个批处理文件就可以了（.cmd/.wcs）
如果是通过脚本实现类似于软件的功能，请参考“ 一、移植绿色软件”，将依赖文件放置在文件夹内并保留一个外置的安装脚本即可。


# 开发案例
## 一、Chrome49（移植绿色软件）
:::warning 注意：此案例比较陈旧，尤其是在外置批处理的编写上面具有一定的误导性
请以上面的典型开发步骤为准
:::

> （不过这种写法又不是不能用）


首先，在无忧启动论坛找到了tools241优化过的Chrome49资源包把它下载下来，执行Step1，发现可直接运行。

![](https://pineapple.edgeless.top/picbed/wiki/images/picture14.png)


接下来，执行Step2。将内容物进行精简并分离ChromePortable.bat内的安装代码和运行代码。顺便把自带的丑陋图标替换了。

![](https://pineapple.edgeless.top/picbed/wiki/images/picture15.png)

返回上级目录，编写外置批处理Chrome49.cmd（注：下图中使用的绝对路径call写法可能导致某些程序在安装过程中出现故障，请使用最新写法，详情见上方Step3）

![](https://pineapple.edgeless.top/picbed/wiki/images/picture16.png)
其中
```
pecmd link "X:\Users\Default\Desktop\Chrome","X:\Program Files\Edgeless\Chrome49\Chrome.cmd",,"X:\Program Files\Edgeless\Chrome49\Chrome.ico",0
```
表示将"X:\Program Files\Edgeless\Chrome49\Chrome.cmd"在桌面创建快捷方式，图标为"X:\Program Files\Edgeless\Chrome49\Chrome.ico"，名称为Chrome。
这是一个常用的pecmd命令，可以为程序添加桌面快捷方式。
如果不需要额外指定图标，请使用如下语句：
```
pecmd link "X:\Users\Default\Desktop\Chrome","X:\Program Files\Edgeless\Chrome49\Chrome.exe"
```
在最后一行加上exit，否则批处理运行结束后cmd窗口可能不会马上退出，导致后台出现cmd.exe残留

将Chrome49.cmd和Chrome49文件夹压缩为7z，即可完成Chrome49插件包的制作

![](https://pineapple.edgeless.top/picbed/wiki/images/picture17.png)

:::tip 提醒
完成插件包的制作后不要忘记在实际情景中测试哦
:::


## 二、随机壁纸（pecmd脚本插件包示例）
编写wcs脚本（如何编写请自行查找关于pecmd命令行的内容）并添加相应的依赖内容

![](https://pineapple.edgeless.top/picbed/wiki/images/picture19.png)
编写外置批处理文件（拓展名为.wcs）

![](https://pineapple.edgeless.top/picbed/wiki/images/picture20.png)
打包完成（详细过程请参考案例1）


:::warning 看完了还是一脸懵逼？
去下载站下一个插件包拆开看看吧
:::