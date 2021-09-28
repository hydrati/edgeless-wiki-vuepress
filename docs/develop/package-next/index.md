# 下一代Edgeless资源包（Next-generation Edgeless Resource-package）
插件包是Edgeless的一大特性，它能赋予用户通过自由组合插件包增加PE功能的能力。初代插件包简单易懂的规范使得Edgeless快速获得了大量的第三方插件包，极大程度地丰富了Edgeless生态，但是初代插件包规范也同样存在着许多问题。在经过2年多的实践反馈后，我们提出了下一代Edgeless资源包规范。
[[TOC]]
## 框架

下一代Edgeless资源包（下称资源包）本质依旧是一个7z压缩的压缩包，为了便于区分且方便直接使用压缩软件打开，我们使用了 `.erp.7z` 作为拓展名。资源包取代了初代插件包和初代主题包/资源包，使得Edgeless生态更加统一，便于管理。我们也会提供转换工具将初代的包转换为下一代资源包。

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

显然，`package.toml` 取代了初代的外置批处理，成为描述资源包行为的唯一入口文件。

使用配置文件而不是包含绝对命令语句的批处理来描述插件包行为有非常多的好处，例如可拓展、可自定义行为、提供更便捷的高级特性等。而选用 [`TOML`](https://toml.io/cn/) 作为配置文件描述语言则是因为 `TOML` 是一种拥有良好可读性的高级描述语言，并且能很容易地被转换为 `JSON` 或其他数据结构以便被现代程序处理。

当然，我们也会提供相应的 ABNF 语法校验文件、图形化配置生成器和配置检查工具以确保此文件准确地表达了你的意图。

## 配置文件
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
# 通过附加 <@github_id>  提供对应的GitHub ID
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

### 最重要的内容！
接下来的内容是关于如何配置插件的，这是配置文件中最重要的一个部分！它是如此的重要以至于我们需要单独分章节来讲解它。

点击前往[工作流章节](workflow.md)，我们将在那里详细讲解工作流、步骤、变量、条件、步骤组等概念。阅读完成后请返回此处并继续向下阅读剩余部分。

:::tip
下面的内容会默认你已经读完了工作流章节
:::
### 钩子 <Badge text="可选" />
[生命周期钩子](../../playground/hooks.md)可以在 Edgeless 运行时的不同周期位置运行用户的指定脚本，这里同样使用工作流来描述某个位置的钩子，例如：
```toml
[hooks.onDesktopShown]
  [hooks.onDesktopShown.update_vscode]
  name = "Update VSCode"
  type = "Script"

  path = "./update.cmd"
```
:::tip
首行的 `[hooks.onDesktopShown]`可以省略，此处为了表达逻辑关系而添加
:::

你可以在[生命周期钩子](../../playground/hooks.md#启动周期)章节找到所有的钩子位置，然后在 `hooks.HOOK_STAGE` 描述该位置需要执行的工作流。

### Edgeless PPnP 配置 <Badge text="可选" />
<!--TODO:等待补充相关内容-->
示例：
```toml
[ppnp]
precache = [
  "_install_/*/**"
]
```

### 用户数据目录 <Badge text="可选" />
你可以指定程序的用户数据目录，这样当用户要求保存他们的数据时 Edgeless 就可以在结束周期打包这些目录，并在下次启动时恢复这些数据。

示例：
```toml
[profiles]
dir = ["${SystemDrive}/Users/profiles"]
```

### 服务配置 <Badge text="可选" />
如果你打包了一个服务型程序(例如 ssh-server、vnc-server 等)，我们强烈建议你提供服务配置来控制这项服务，Edgeless 会向用户提供操作接口来控制*实现了服务配置*的服务。

示例：
```toml
[service]
# 进程名，用于判断服务运行状态
progress = "sshd.exe"
# 启用服务命令
start = "./sshd.exe"
# 停止服务命令
stop = "taskkill /im sshd.exe /t"
```

### 依赖
如果你的程序需要添加运行库，你可以指定所需的依赖运行库，Edgeless 会自动地解决这些依赖。

对于官方提供的依赖项可以指定依赖版本，而对于普通资源包依赖，所填的版本号只是打包者测试使用的版本号，Edgeless 不会严格安装指定的版本

示例：
```toml
[dependencies]
# 官方提供的依赖项，可以指定依赖版本
dotnet = "3.5"
vc = "11"
# 普通资源包依赖，不会严格安装指定的版本
cmder = "1.0.0.0"
```

### 拓展区域
不同类型的资源包通常会拥有一些特定的表用于存放该类资源的通用信息，因此我们保留了拓展区域用于存放额外的信息

例如，对于软件型资源会有 `software` 表：
```toml
[software]
# 分类
category = "办公编辑"
# 标签
tags = ["Visual Studio Code","VSC"]
# 安装位置
location = "${ProgramFiles}/Edgeless"
# 需要添加到PATH的文件夹
path = ["./VSCode"]
```

驱动型资源会有 `driver` 表：
```toml
[driver]
# 驱动厂商
brand = "Intel"
# 硬件类型
type = "无线网卡"
# 适用型号
models = ["AX200","AX201"]
```

主题型资源会有 `theme` 表：
```toml
[theme]
# 对应实现的初代主题包/资源包类型
type = ["ESS","EMS"]
```

### 保留表
此外，配置文件中还会保留一个 `build` 表用于保存构建时的相关信息，此信息由构建工具自动生成：
```toml
[build]
# 解析规范版本
contract = "1.0"
# 构建工具版本
tool = "0.1.0"
# 打包时间(UTC+8)
date = 2021-09-20 00:32:00+08:00
```