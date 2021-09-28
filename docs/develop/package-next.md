# 下一代Edgeless资源包（Next-generation Edgeless Resource-package）
插件包是Edgeless的一大特性，它能赋予用户通过自由组合插件包增加PE功能的能力。初代插件包简单易懂的规范使得Edgeless快速获得了大量的第三方插件包，极大程度地丰富了Edgeless生态，但是初代插件包规范也同样存在着许多问题。在经过2年多的实践反馈后，我们提出了下一代Edgeless资源包规范。
[[TOC]]
## 概述

下一代Edgeless资源包（下称资源包）本质依旧是一个7z压缩的压缩包，为了便于区分且方便直接使用压缩软件打开，我们使用了`.erp.7z`作为拓展名。资源包取代了初代插件包和初代主题包/资源包，使得Edgeless生态更加统一，便于管理。我们也会提供转换工具将初代的包转换为下一代资源包。

资源包的内部结构大体上延续初代插件包设计，由一个`package.toml`和一个/多个的文件夹/文件组成。推荐的结构如下：

```
- package.toml
- _scripts/
- MySoftware/
```

或

```
- package.toml
- Installer.exe
```

显然，`package.toml` 取代了初代的外置批处理，成为描述资源包行为的唯一入口文件。使用配置文件而不是包含绝对命令语句的批处理来描述插件包行为有非常多的好处，例如可拓展、可自定义行为、提供更便捷的高级特性等。而选用 [`TOML`](https://toml.io/cn/) 作为配置文件描述语言则是因为 `TOML` 是一种拥有良好可读性的高级描述语言，并且能很容易地被转换为 `JSON` 或其他数据结构以便被现代程序处理。当然，我们也会提供相应的 ABNF 语法校验文件、图形化配置生成器和配置检查工具以确保此文件准确地表达了你的意图。
## 配置文件
本节会初步说明 `package.toml` 的基本规范，详细规范请移步 [API参考](package-next-api.md)
### 基础信息

在 `package.toml` 的开头，我们需要你通过 `package` 表提供一些这个包的基础信息，大概是这样：
```toml
[package]
# 包名
name = "VSCode"
# 类型
type = "Software"
# 版本号
version = "1.46.0"
# 打包者/作者
# 附通过附加 <@github_id>  提供对应的GitHub ID
authors = [
  "Cno <@Cnotech>",
  "Microsoft"
]
# 兼容的 Edgeless 版本（可选）
compat = [">= 4.0.0"]
# 通过测试的 Edgeless 版本
tested = ["4.0.0","3.2.1"]
```

你可以在 [API参考](package-next-api.md#基础信息) 中查看基础信息的详细规范。

### 工作流
让我们回到上一代的情景中，来关注一个初代插件包最应该关心的问题——配置插件。在`.7z`压缩包中的内容被解压到`%ProgramFiles/Edgeless`后，加载器会并发地运行此目录下的所有外置批处理文件以便完成插件的配置工作，因此只要基于Edgeless环境编写外置批处理并添加到压缩包中即可使得插件被正确配置。但是这样写出的批处理是不具有普适性、无法被跟踪、无法与用户交互、无法实现主动错误检查的，因此许多的插件包都变成了薛定谔的黑盒，除非手动测试，否则你也不知道一个看起来像Edgeless插件包的文件能不能正确地作为插件包完成配置任务。

为了解决上述问题，我们会使用[工作流](https://zh.wikipedia.org/wiki/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%8A%80%E6%9C%AF)来描述这个至关重要的流程。在 `package.toml` 中的配置(setup)工作流可能是像下面这样：
```toml
  [setup_flow.copy_config]
  name = "Copy config"
  type = "File"

  operation = "Copy"
  source = "./_config/*"
  target = "${SystemDrive}/Users/Config/"


  [setup_flow.run_setup_batch]
  name = "Run setup batch"
  type = "Script"

  # 根据path拓展名自动分配shell，支持cmd(cmd/bat)和pecmd(wcs/ini)，也可以显式指定shell
  # shell = "cmd"
  path = "./setup.cmd"
  use = ["SETUP_PLUGINS"]


  [setup_flow.create_shortcut]
  name = "Create shortcut"
  type = "Link"
  
  source_file = "./VSCode/VSCode.exe"
  target_name = "Visual Studio Code"
  target_args = "${env.USER_ARGS}"
  target_icon = "./VSCode/vscode.ico"
  # 默认链接到桌面，允许用户自选位置桌面(Desktop)/开始菜单(StartMenu)/任务栏(TaskBar)
  location_default = "Desktop"


  [setup_flow.start_vscode]
  name = "Start VSCode"
  type = "Execute"
  if = "${uc.AUTO_RUN}==true"

  # 支持指定shell，默认使用cmd
  shell = "pecmd"
  command = "exec explorer ${Desktop}/Visual Studio Code.lnk"


  [setup_flow.log_status]
  name = "Log status"
  type = "Log"

  # 支持Info/Warning/Error
  level = "Info"
  msg = "VSCode installed successfully"
```

看起来可能会比较晦涩，不过这仅仅是为了让你拥有一个大致的概念。我们会在下面详细解释工作流描述方法。

### 步骤
工作流由数个步骤构成，例如：
```toml
  [setup_flow.copy_config]
  name = "Copy config"
  type = "File"

  operation = "Copy"
  source = "./_config/*"
  target = "${SystemDrive}/Users/Config/"
```
就是一个独立的步骤，这个步骤用于执行文件复制操作。

每个步骤必须拥有 `name` 和 `type` 这两个字段，分别代表步骤名称和步骤类型。步骤名称由编写者自由决定，推荐使用以动词开头、首字母大写的英文短句；类型则*必须*是官方规范中给定的数种类型之一。

步骤的键同样由编写者自由决定，推荐使用 [snake_case](https://en.wikipedia.org/wiki/Snake_case) 风格的 `name`。此例中该步骤的键为 `copy_config`，访问路径为 `setup_flow.copy_config`。

下方的 `operation` 则是 `File` 类型的独有字段，用于指定文件操作类别；而 `source` `target` 则是复制操作 (`Copy`) 的独有字段，指定了复制来源、复制目标。

:::tip
看起来这三个字段似乎可以分为两个拥有层层递进关系的字段组，其实在程序中它们是平坦的 (plain) 、位于同一逻辑层级上的，都会直接暴露给 `File` 类型步骤解析器
:::

了解步骤的基本概念后，你应该能够大致看懂示例工作流中其他步骤的描述了，例如：
```toml
  [setup_flow.log_status]
  name = "Log status"
  type = "Log"

  # 支持Info/Warning/Error
  level = "Info"
  msg = "VSCode installed successfully"
```
描述了一个键为 `log_status`、名称为 `Log status`的打印日志步骤，并提供了 `level` `msg` 两个参数。

你可以在 [API参考](package-next-api.md) 中查看全部的官方类型及其对应所需的参数。
:::tip
如果你认为我们提供的官方类型缺失了对某种基础步骤的实现，请暂时地使用脚本(Script)和二进制工具代替并给我们发issue
:::
### 变量
你可以在步骤或脚本中使用变量，变量可以是加载器运行时提供的内置变量、编写者自定义变量或是可供用户更改的用户配置变量。
#### 内置变量
以先前的复制文件步骤为例：
```toml
  [setup_flow.copy_config]
  name = "Copy config"
  type = "File"

  operation = "Copy"
  source = "./_config/*"
  # 使用了内置变量，此项会被解释为 X:/Users/Config/
  target = "${SystemDrive}/Users/Config/"
```
这里的 `target` 就用到了内置变量 `${SystemDrive}` ，在 Edgeless 中其值为 `X:`，代表系统盘符。

上述的使用方法仅限在 `package.toml` 文件中使用自定义变量，如果需要将内置变量传递到批处理脚本环境，请在 `Script` 类型步骤中通过 `use` 显式指定需要传递的变量：
```toml
  [setup_flow.run_setup_batch]
  name = "Run setup batch"
  type = "Script"

  path = "./setup.cmd"
  # 显式指定需要传递的内置变量
  # 在 "./setup.cmd" 中执行 "echo %EdgelessDrive%" 即可看到被传递的自定义变量
  use = ["EdgelessDrive"]
```
内置变量*不允许*被工作流或是用户修改，其值仅由加载器运行时决定。

你可以在 [API参考](package-next-api.md) 中查看全部的内置变量。
:::tip
如果你认为我们提供的内置变量缺失了对某种基础信息的体现，请暂时地使用脚本(Script)代替并给我们发issue
:::
#### 自定义变量
自定义变量需要在 `env` 表中提供，例如：
```toml
[env]                                       
USER_ARGS = "--help"
SETUP_PLUGINS = "['Code Runner','Simplified Chinese']"
MY_BOOT_POLICY = 0
```

然后通过 `${env.KEY_NAME}` 使用自定义变量，例如：
```toml
  [setup_flow.create_shortcut]
  name = "Create shortcut"
  type = "Link"
  
  source_file = "./VSCode/VSCode.exe"
  target_name = "Visual Studio Code"
  # 使用自定义变量的值，此项会被解释为 target_args = "--help"
  target_args = "${env.USER_ARGS}"
  target_icon = "./VSCode/vscode.ico"
  location_default = "Desktop"
```

与内置变量类似，如果需要将自定义变量传递到批处理脚本环境，请在 `Script` 类型步骤中通过 `use` 显式指定需要传递的自定义变量：
```toml
  [setup_flow.run_setup_batch]
  name = "Run setup batch"
  type = "Script"

  path = "./setup.cmd"
  # 显式指定需要传递的自定义变量
  # 在 "./setup.cmd" 中执行 "echo %env.SETUP_PLUGINS%" 即可看到被传递的自定义变量
  use = ["env.SETUP_PLUGINS"]
```
如果你需要在工作流中修改 `env` 中的变量值，请执行一个 `Value` 类型的步骤：
```toml
  [setup_flow.modify_boot_policy]
  name = "Modify boot policy"
  type = "Value"
  if = '${BootPolicy}=="UEFI"'

  key = "env.MY_BOOT_POLICY"
  val = 1
```
:::tip 注意
 `Value` 类型步骤只能用于更改 `env` (自定义变量)或下面即将提到的 `uc` (用户配置变量)中的变量，内部变量不允许被修改
:::
#### 用户配置变量
除了使用 `env` 指定*仅工作流可修改的*自定义变量，你还可以使用 `uc` 指定可供用户更改的配置变量 (User-controled Config)，例如下面的这个示例指定了一个布尔型的 `AUTO_RUN` 用户配置变量，其值由用户提供：
```toml
  [uc.AUTO_RUN]
  name = "开机启动"
  description = "启动时自动运行VSCode"
  # 默认值，必须提供且会根据此值判断变量类型
  default = false
  # 供用户选择的选项，缺省时会根据变量类型提供默认配置界面
  options = [
    {
      title = "是",
      value = true
    },
    {
      title = "否",
      value = false
    },
  ]
```
你可以通过 `${uc.KEY_NAME}` 调用此变量：
```toml
  [setup_flow.start_vscode]
  name = "Start VSCode"
  type = "Execute"
  # 默认情况下，此项会被解释为 false==true
  # if 表示一个条件，我们将在下一节中讲解
  if = "${uc.AUTO_RUN}==true"

  command = "explorer ${Desktop}/Visual Studio Code.lnk"
```

这里还有一些指定了其他类型用户配置变量的示例：

**整型**
```toml
  [uc.VOLUME]
  name = "音量"
  description = "启动时的默认音量"
  default = 67

  # 仅对整型有效的范围校验
  # 当然也可以使用 options 仅让用户选择而不是输入
  max = 100
  min = 0
```

**字符串型**
```toml
  [uc.RESOLUTION]
  name = "分辨率"
  description = "使用 宽x高 语法表示分辨率"
  default = "1920x1080"

  # 仅对字符串型有效的正则表达式校验
  # 当然也可以使用 options 仅让用户选择而不是输入
  regex = '/^\d+x\d+&/'
```
:::tip
此处的正则表达式符合Perl-style，需要能被[regex crate](https://docs.rs/regex)解析

为了便于书写，建议使用`'`包裹正则表达式以解释为没有转义的[字面量字符串](https://toml.io/cn/v1.0.0#字符串)。
:::
### 条件
你可以使用 `if` 字段有条件地执行某个步骤，例如：
```toml
  [setup_flow.open_vscode]
  name = "Open VSCode"
  type = "Exec"
  # 如果用户配置了 AUTO_RUN=true，则此项会被解释为 true==true，显然为真
  if = "${uc.AUTO_RUN}==true"

  command = "explorer ${Desktop}/Visual Studio Code.lnk"
```
当 `if` 指定的逻辑表达式结果为真时此步骤才会被执行。

:::tip
此表达式由[eval crate](https://docs.rs/eval)解释并计算，计算过程类型严格

支持的符号：`!` `!=` `""` `''` `()` `[]` `.` `,` `>` `<` `>=` `<=` `==` `+` `-` `*` `/` `%` `&&` `||` `n..m`

内嵌的函数：`min()` `max()` `len()` `is_empty()` `array()`
:::

### 步骤组
考虑这样的需求：当满足某一条件时执行一组步骤。

按照我们已经了解到的规范，写出来的工作流可能是这样的：
```toml
  [setup_flow.install_1]
  name = "Install 1"
  type = "Exec"
  if = "${uc.GROUP_INSTALL}==true"

  command = "./Installer1.exe /S"


  [setup_flow.install_2]
  name = "Install 2"
  type = "Exec"
  if = "${uc.GROUP_INSTALL}==true"

  command = "./Installer2.exe /S"


  [setup_flow.install_3]
  name = "Install 3"
  type = "Exec"
  if = "${uc.GROUP_INSTALL}==true"

  command = "./Installer3.exe /S"
```
显然，这三个步骤的触发条件相同，因此我们可以使用一个步骤组来合并这些步骤，这是合并后的工作流：
```toml
  [setup_flow.install_group]
  name = "Install Group"
  type = "Group"
  # 使用一个条件语句控制整组步骤的执行
  if = "${uc.GROUP_INSTALL}==true"


    [setup_flow.install_group.install_1]
    name = "Install 1"
    type = "Exec"

    command = "./Installer1.exe /S"


    [setup_flow.install_group.install_2]
    name = "Install 2"
    type = "Exec"

    command = "./Installer2.exe /S"


    [setup_flow.install_group.install_3]
    name = "Install 3"
    type = "Exec"

    command = "./Installer3.exe /S"
```
虽然看起来内容更长了，但是这些步骤的逻辑关系会更加清晰，也更加易于规模化的管理