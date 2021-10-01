# API 参考

## 基础信息

位置： `package` 表

### name
`String`

包名，简名标识资源包内容的字段

需要与文件名中的包名相同；不包含`_`

:::tip
如果需要使用`_`分割内容，请用空格或`-`达到近似目的；例如 `nodejs-runtime` 或 `Idea community`

*不要*在包名中提供代指版本号的数字，请在对应的版本号中体现；例如 `VMware Workstation 16` 就是一个不规范的名称，这会导致用户无法接收大版本更新，因此请将其改为 `VMware Workstation`
:::

### type
`Enum<String>`

资源包内容类型

下列值中的一个：`{"Software", "Driver", "Essential", "Dependency", "Theme"}`

:::tip
`Enum<String>`表示这是一个 String 类型的枚举类
:::

### version
`String`

资源包内容版本号

需要满足正则：`/^\d+.\d+.\d+(.\d+)?$/`；需要与文件名中的版本号相同


:::tip
取 3 位或 4 位版本号

如果是软件推荐使用主程序的产品版本，如果是驱动推荐使用设备管理器中标识的驱动程序版本，如果已知上游内容版本号推荐将其缩短至 4 位以内使用，其他情况推荐令前三位遵守 [Semver](https://semver.org/lang/zh-CN/) 规范

根据校验规则，禁止在版本号中出现非数字且非`.`的字符，请考虑将不规范的版本字符删除或移动到包名中；对于 `-beta` `-rc` 这类标识版本阶段的字符，我们建议在版本号与正式版不冲突时删掉它们，或是不制作此阶段的资源，等待上游发布正式版
:::

### authors
`Array<String>`

打包者与内容作者

打包者（第一个成员）需要与文件名中的打包者相同
:::tip
统一将打包者作为第一个成员提供，如果打包者同时也是内容作者则只需保留一个成员即可

推荐打包者通过附加`<@github_id>`来提供对应的 GitHub ID
:::

### compat <Badge text="可选" />
`Array<String>`

资源包兼容的 Edgeless 版本，缺省表示全部兼容

需要满足正则：`/^[><]=?\s*\d+.\d+.\d+$/`


:::tip
允许的前缀：`[">=" , "<=" , ">" , "<"]`
:::

### tested
`Array<String>`

经打包者测试可用的 Edgeless 版本

需要满足正则：`/^\d+.\d+.\d+$/`

## 内置变量

**步骤状态类**

### ExitCode
`int`

上一个步骤的执行状态，`==0`表示成功，`!=0`表示失败

对于 `Script` 和 `Execute` 类型的步骤来说，这个变量的值会是脚本或命令的退出码

示例：
```toml
if = '${ExitCode}!=0'
```

:::tip
这里所谓的“上一个步骤”是指逻辑上的上一个步骤，而不是在工作流中紧挨着的上一个步骤。因此对于这种情况 `fix` 步骤是可以被触发的：
```toml
[setup_flow.step_1]
name = "Step 1"
type = "Execute"

# 产生一个错误
command = "exit 3"
shell = "cmd"


[setup_flow.step_2]
name = "Step 2"
type = "Execute"
# 这意味着Step 2不会被执行
if = 'false'

command = "exit 0"
shell = "cmd"


[setup_flow.fix]
name = "Fix"
type = "Execute"
# 由于Step 2没有被执行，此时的${ExitCode}值为3，是Step 1的退出码
if = '${ExitCode}!=0'

command = "start ./VSCode/vscode.exe"
shell = "cmd"
```
:::

### Feedback
`int`

获得 [Dialog](#dialog) 的用户反馈，`0`表示用户关闭了对话框，从`1`开始表示用户所选按钮的索引

示例：见 [Dialog](#dialog)

---

**路径类**

### SystemDrive
`String`

Windows PE 盘符，在 Edgeless 下通常为 `X:`

示例：

```toml
if = '${SystemDrive}=="X:"'
```

### EdgelessDrive
`String`

Edgeless 启动盘盘符，可能为 `U:`

如果当前没有检测到Edgeless 启动盘，则会立即结束当前步骤并将 [`${ExitCode}`](#exitcode) 配置为`1`

示例：

```toml
if = '${EdgelessDrive}=="U:"'
```

### DefaultLocation
`String`

资源的默认安装位置，在 Edgeless 下通常为 `X:/Program Files/Edgeless`

示例：

```toml
if = '${DefaultLocation}=="X:/Program Files/Edgeless"'
```

### Desktop
`String`

桌面位置，在 Edgeless 下通常为 `X:/Users/Default/Desktop`

示例：

```toml
if = '${Desktop}=="X:/Users/Default/Desktop"'
```

### Aria2cPath
`String`

aria2c 可执行文件 `aria2c.exe` 的绝对路径，如果内置的 [Download](#download) 步骤无法满足你的需求，你可以不等待地执行一个脚本来实现异步下载并回调的操作

示例：

```toml
[setup_flow.download_vscode]
name = "Download VSCode"
type = "Script"

path = "./download.cmd"
wait = false
use = ["Aria2cPath"]
```

---

**信息类**


### EdgelessVersion
`String`

当前 Edgeless 版本号，为三位使用`.`分割的数字

示例：

```toml
if = '${EdgelessVersion}=="4.0.0"'
```
### BootPolicy
`String`

当前系统启动方式，值为`Legacy` 或 `UEFI`

示例：

```toml
if = '${BootPolicy}=="UEFI"'
```

## 内置函数

内置函数仅可用于[条件语句](#if)内，仅提供一些返回值为 `bool` 型的简单函数

:::tip
复杂的函数和步骤不是工作流应该考虑的内容，你应该使用脚本
:::

### Exist
`Exist(path :String) :bool`

判断是否存在某个文件或目录

示例：

```toml
if = 'Exist("${SystemDrive}/Users/Profiles")'
```

### IsDirectory
`IsDirectory(path :String) :bool`

判断某个路径是否是文件夹

示例：

```toml
if = 'IsDirectory("${SystemDrive}/Users/Profiles")'
```

## 步骤通用字段

位置：`setup_flow` `remove_flow` `hooks.HOOK_STAGE`

### name <Badge text="必须" />

步骤名称，通常是步骤键名的标准英文句式

示例：

```toml
[setup_flow.install_vscode]
name = "Install VSCode"
```

### type <Badge text="必须" />

步骤类型，必须为[步骤类型 API 参考](#步骤类型)中指定的一种

示例：

```toml
type = "File"
```

### if

条件语句，满足语句中的条件时才会执行步骤，仅对当前步骤或步骤组生效

示例：

```toml
if = '${SystemDrive}=="X:"'
```

### elif

条件语句，必须紧随包含 `if` 或 `elif` 的步骤出现，当上一步骤因 `if` 或 `elif` 指定的语句结果为假而未执行时才会判断此步骤是否需要执行

示例：

```toml
[setup_flow.group_1]
name = "Group 1"
type = "Group"
if = '${SystemDrive}=="X:"'

  [setup_flow.group_1.step_1]
  name = "Step 1"
  ...

[setup_flow.group_2]
name = "Group 2"
type = "Group"
elif = '${SystemDrive}=="C:"'

  [setup_flow.group_2.step_1]
  name = "Step 1"
  ...

[setup_flow.group_3]
name = "Group 3"
type = "Group"
elif = '${SystemDrive}=="D:"'

  [setup_flow.group_3.step_1]
  name = "Step 1"
  ...
```

### else

条件语句，必须紧随包含 `if` 或 `elif` 的步骤出现，当上一步骤因 `if` 或 `elif` 指定的语句结果为假而未执行时才会执行此步骤

由于含 `else` 语句的步骤是否执行仅取决于上一步骤，因此无论 `else` 指定的语句结果是什么都不会影响其性质，推荐使用 `else = 'true'`

:::tip
你完全可以使用 `else = 'false'`，不过这样做很不好(比如会被田所浩二撅)
:::

示例：

```toml
[setup_flow.group_1]
name = "Group 1"
type = "Group"
if = '${SystemDrive}=="X:"'

  [setup_flow.group_1.step_1]
  name = "Step 1"
  ...

[setup_flow.group_2]
name = "Group 2"
type = "Group"
elif = '${SystemDrive}=="C:"'

  [setup_flow.group_2.step_1]
  name = "Step 1"
  ...

[setup_flow.group_3]
name = "Group 3"
type = "Group"
else = 'true'

  [setup_flow.group_3.step_1]
  name = "Step 1"
  ...
```

### throw

异常处理字段，*若当前步骤执行出错*(退出码不等于`0`)则立即抛出指定的错误信息，然后退出当前工作流

在不指定 throw 语句的情况下，出错后工作流会继续执行，不过在下一个逻辑步骤中 [`${ExitCode}`](#exitcode) 会不为`0`

这里 throw 真正的含义是“throw if error”，我们暂时想不到更恰当的词来形容这一操作

示例：
```toml
[setup_flow.start_vscode]
name = "Start VSCode"
type = "Execute"
throw = "Can't start vscode"

command = "exec explorer ${Desktop}/Visual Studio Code.lnk"
shell = "pecmd"
```

:::tip
你也许发现了我们没有提供类似于 `exit` 的功能，因为提前退出工作流无外乎两种情况：

- 一切正常，但是我想提前结束

  这种编写思路事实上是非常危险的，这会使得你编写的工作流毫无逻辑可言。我们认为一个合理的工作流在一切正常的情况下必须执行完全部应有的步骤后才能退出，因此请使用[条件语句](#if)和[步骤组](#group)表达你的逻辑

- 发生了异常

  对于这种情况，如果你不想处理问题，请直接 [throw](#throw)；如果你想尝试解决问题，请在下一步骤中判断 [ExitCode](#exitcode) 并使用[步骤组](#group)编写解决方案
:::

## 步骤类型
使用 `type = "xxx"` 指定步骤类型，并根据此处的参考规范提供相应的字段

### Group

步骤组，与[条件语句](#if)配合使用可以同时控制多个步骤的执行

不需要额外的字段

示例：
```toml
[setup_flow.install_group]
name = "Install Group"
type = "Group"
# 使用一个条件语句控制整组步骤的执行
if = "${uc.GROUP_INSTALL}==true"

  [setup_flow.install_group.install_1]
  name = "Install 1"
  type = "Execute"

  command = "./MySoftware/Installer1.exe /S"
  shell = "cmd"


  [setup_flow.install_group.install_2]
  name = "Install 2"
  type = "Execute"

  command = "./MySoftware/Installer2.exe /S"
  shell = "cmd"


  [setup_flow.install_group.install_3]
  name = "Install 3"
  type = "Execute"

  command = "./MySoftware/Installer3.exe /S"
  shell = "cmd"
```

### File

文件操作类型步骤，通过 `operation` 字段说明所需的操作，支持复制、移动、重命名、删除操作

#### 复制

需要使 `operation = "Copy"`

- `source : String`：复制来源，可以是文件或文件夹，支持通配符
- `target : String`：复制目的地，支持重命名
- `overwrite : bool`：（可选）是否覆盖，缺省为 `true`

示例：

```toml
[setup_flow.copy_config]
name = "Copy config"
type = "File"

operation = "Copy"
source = "./_retinue/config/*"
target = "${SystemDrive}/Users/Config/"
overwrite = false
```

#### 移动

需要使 `operation = "Move"`

- `source : String`：移动来源，可以是文件或文件夹，支持通配符
- `target : String`：移动目的地，支持重命名
- `overwrite : bool`：（可选）是否覆盖，缺省为 `true`

示例：

```toml
[setup_flow.move_config]
name = "Move config"
type = "File"

operation = "Move"
source = "./_retinue/config/*"
target = "${SystemDrive}/Users/Config/"
overwrite = false
```

#### 重命名

需要使 `operation = "Rename"`

- `source : String`：重命名源，可以是文件或文件夹，支持通配符
- `target : String`：新名称，需要手动添加拓展名

示例：

```toml
[setup_flow.rename_config]
name = "Rename config"
type = "File"

operation = "Rename"
source = "./_retinue/config/*.ini"
target = "*.wcs"
```

#### 删除

需要使 `operation = "Delete"`

- `source : String`：删除来源，可以是文件或文件夹，支持通配符
- `force : bool`：（可选）是否解除占用强制删除，缺省为 `false`

示例：

```toml
[setup_flow.delete_config]
name = "Delete config"
type = "File"

operation = "Delete"
source = "${SystemDrive}/Users/Config/*"
force = true
```

### Script
执行脚本，支持 cmd 脚本(`.cmd`)和 pecmd 脚本(`.wcs`)

- `path :String`：脚本路径
- `args :String`：（可选）参数
- `use :Array<String>`：（可选）需要传递的[变量](workflow.md#变量)
- `pwd :String`：（可选）工作目录，缺省为资源根目录
- `hide :bool`：（可选）是否隐藏脚本执行窗口，缺省为 `true`
- `wait :bool`：（可选）是否等待脚本执行完成，缺省为 `true`
- `fix :Array<String>`：（可选）需要[修复 `_retinue` 引用](general.md#随从文件夹)的文本文件

示例：

```toml
[setup_flow.run_setup_script]
name = "Run setup script"
type = "Script"

path = "./setup.cmd"
args = "${env.USER_ARGS}"
use = ["env.SETUP_PLUGINS"]
pwd = "${SystemDrive}/System32"
hide = false
wait = false
fix = ["./VSCode/install.cmd", "./_retinue/update.py"]
```

### Execute
执行命令，支持 cmd 命令和 pecmd 命令

- `command :String`：命令
- `shell :Enum<String>`：使用的终端，下列值中的一个：`{"cmd", "pecmd"}`
- `use :Array<String>`：（可选）需要传递的[变量](workflow.md#变量)
- `pwd :String`：（可选）工作目录，缺省时自动判断(引用 `_retinue` 内脚本则为资源根目录，其他位置则在脚本所在目录)
- `hide :bool`：（可选）是否隐藏命令执行窗口，缺省为 `true`
- `wait :bool`：（可选）是否等待命令执行完成，缺省为 `true`

示例：

```toml
[setup_flow.start_vscode]
name = "Start VSCode"
type = "Execute"
if = "${uc.AUTO_RUN}==true"

command = "exec explorer ${Desktop}/Visual Studio Code.lnk"
shell = "pecmd"
use = ["env.SETUP_PLUGINS"]
pwd = "${SystemDrive}/System32"
hide = false
wait = false
```

### Link
创建快捷方式，支持在桌面、任务栏、开始菜单
- `source_file :String`：源文件
- `target_name :String`：快捷方式名称
- `target_args :String`：（可选）追加参数
- `target_icon :String`：（可选）快捷方式图标，缺省与源文件一致
- `location_default :Enum<String>`：（可选）默认创建位置，缺省为`"Desktop"`，下列值中的一个：`{"Desktop", "Taskbar", "StartMenu"}`

示例：

```toml
[setup_flow.create_shortcut]
name = "Create shortcut"
type = "Link"

source_file = "./VSCode/VSCode.exe"
target_name = "Visual Studio Code"
target_args = "${env.USER_ARGS}"
target_icon = "./VSCode/vscode.ico"
location_default = "Desktop"
```

### Log
输出日志，分为信息、警告、错误三个等级，错误(`Error`)等级信息的内容会以 [Toast](#toast) 形式直接展示给用户
- `level :Enum<String>`：日志等级，下列值中的一个：`{"Info", "Waring", "Error"}`
- `msg :String`：日志内容

示例：

```toml
[setup_flow.log_status]
name = "Log status"
type = "Log"

level = "Info"
msg = "VSCode installed successfully"
```

### Toast
弹出悬浮通知
- `title :String`：通知标题
- `content :String`：通知内容

示例：

```toml
[setup_flow.show_status]
name = "Show status"
type = "Toast"

title = "安装成功"
content = "VSCode 已安装完成"
```

### Dialog
弹出对话框，可以使用 [`${Feedback}`](#feedback) 变量获得用户操作反馈
- `title :String`：对话框标题
- `content :String`：对话框内容
- `options :Array<String>`：（可选）按钮文本，缺省为`["确认"]`

示例：

```toml
[setup_flow.show_status]
name = "Show status"
type = "Dialog"

title = "安装成功"
content = "是否打开 VSCode？"
options = ["是","否"]


[setup_flow.start_vscode]
name = "Start vscode"
type = "Execute"
if = '${Feedback}==1'

command = "explorer ${Desktop}/Visual Studio Code.lnk"
shell = "cmd"
```

### Download
从网络下载文件，默认使用2线程的 aria2c 完成下载
- `url :String`：链接
- `save :String`：保存路径
- `overwrite: bool`：（可选）是否覆盖，缺省为`true`
- `wait :bool`：（可选）是否等待下载完成，缺省为`true`
- `thread :int`：（可选）线程数，范围`1~16`，缺省为`2`

示例：

```toml
[setup_flow.download_vscode]
name = "Download VSCode"
type = "Download"

url = "https://az764295.vo.msecnd.net/stable/7f6ab5485bbc008386c4386d08766667e155244e/VSCodeUserSetup-x64-1.60.2.exe"
save = "./vscode.exe"
overwrite = false
wait = false
thread = 16
```

:::tip
如果需要异步地下载并执行回调，请改为使用脚本，我们会在 [`${Aria2cPath}`](#aria2cpath) 参数上提供一个现成的 aria2c 可执行文件
:::