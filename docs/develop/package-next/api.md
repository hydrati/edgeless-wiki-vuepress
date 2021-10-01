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

根据校验规则，禁止在版本号中出现非数字且非`.`的字符，请考虑将不规范的版本字符删除或移动到包名中；对于 `-beta` `-rc` 这类标识版本阶段的字符，我们建议在版本号与主阶段不冲突时删掉它们，或是不制作此阶段的资源，等待主阶段的上游发布
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

流控制类

### ExitCode
`int`

上一个步骤的执行状态，`0`表示成功，`1`表示失败

对于 `Script` 和 `Execute` 类型的步骤来说，这个变量的值会是脚本或命令的退出码

示例：
```toml
if = '${ExitCode}==1'
```

### Value
`any`

与 [`for`](#for) 搭配使用，表达遍历时所取元素的值

### Index
`any`

与 [`for`](#for) 搭配使用，表达遍历时所取元素的索引

位置类

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

示例：

```toml
if = '${EdgelessDrive}=="U:"'
```

### WindowsDrives
`Array<String>`

本地的 Windows 系统(不包含PE)所在盘符，可能有多个所以是一个数组，你可以使用 [`for`](#for) 处理

示例：

```toml
[setup_flow.check_windows]
name = "Check Windows"
type = "Group"
for = '${WindowsDrives}'

  [setup_flow.check_windows.log_drive]
  name = "Log drive"
  type = "Log"

  level = "Info"
  msg = 'Find Windows at ${Value}'
```

### DefaultLocation
`String`

资源的默认安装位置，在 Edgeless 下通常为 `X:\Program Files\Edgeless`

示例：

```toml
if = '${DefaultLocation}=="X:\Program Files\Edgeless"'
```

### Desktop
`String`

桌面位置，在 Edgeless 下通常为 `X:\Users\Default\Desktop`

示例：

```toml
if = '${Desktop}=="X:\Users\Default\Desktop"'
```


信息类


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

内置函数通常用于[条件语句](#if)内

### Exist
`Exist(path :String) :bool`

判断是否存在某个文件或目录

示例：

```toml
if = 'Exist("${SystemDrive}\Users\Profiles")'
```

## 步骤

此处列出所有步骤的通用字段

位置：`setup_flow` `remove_flow` `hooks.HOOK_STAGE`

### name

步骤名称，通常是步骤键名的标准英文句式

示例：

```toml
[setup_flow.install_vscode]
name = "Install VSCode"
```

### type

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

### for
对一个数组进行遍历，在处理文件夹或盘符时会很有用

使用 `for` 时当前步骤类型必须为 `Group`，当前步骤中出现的 `if` 优先级高于 `for`

支持通过 `filter` 字段指定正则表达式过滤遍历时的取值

可以通过 `${Value}` 变量获取元素，通过 `${Index}` 变量获取从0开始的索引

示例：
```toml
[setup_flow.check_windows]
name = "Check Windows"
type = "Group"
# 当自定义变量CHECK_WINDOWS为true时才会执行for语句
if = '${env.CHECK_WINDOWS}'
for = '${WindowsDrives}'
# 仅当元素满足此正则时才会执行步骤组，否则继续
filter = "/[C-Z]:/"

  [setup_flow.check_windows.change_value]
  name = "Change value"
  type = "Value"

  key = "env.WINDOWS_COUNT"
  # 这个步骤会被执行len(${WindowsDrives})次
  # 最后一次执行时WINDOWS_COUNT的值会变成${WindowsDrives}数组中最后一个元素索引的值+1
  # 此语句等效于 len(${WindowsDrives})，不过效率更低
  val = "${Index}+1"

  [setup_flow.check_windows.log_drive]
  name = "Log drive"
  type = "Log"

  level = "Info"
  msg = 'Find Windows at ${Value}'
```

## 步骤类型

### Group

步骤组，与[条件语句](#if)配合使用可以同时控制多个步骤的执行

不需要额外的字段

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
