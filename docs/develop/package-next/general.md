# 下一代 Edgeless 资源包（Next-generation Edgeless Resource-package）

插件包是 Edgeless 的一大特性，它能赋予用户通过自由组合插件包增加 PE 功能的能力。初代插件包简单易懂的规范使得 Edgeless 快速获得了大量的第三方插件包，极大程度地丰富了 Edgeless 生态，但是初代插件包规范也同样存在着许多问题。在经过 2 年多的实践反馈后，我们提出了下一代 Edgeless 资源包规范。

## 概览

下一代 Edgeless 资源包（下称资源包）本质依旧是一个 7z 压缩的压缩包，为了便于区分且方便直接使用压缩软件打开，我们使用了 `.erp.7z` 作为拓展名，同样也支持如 `.erp.7zf` 等带属性的拓展名。资源包取代了初代插件包和初代主题包/资源包，使得 Edgeless 生态更加统一，便于管理。我们也会提供转换工具将初代的包转换为下一代资源包。

资源包的内部结构大体上延续初代插件包设计，包含 1 个`package.toml`和 1~2 个文件夹，或是 1 个`package.toml`和 1 个安装包文件，结构如下：

```
- package.toml
- _scripts/
- PackageName/
```

或

```
- package.toml
- PackageName.exe
```

显然，`package.toml` 取代了初代的外置批处理，成为描述资源包行为的唯一入口文件。

使用配置文件而不是包含绝对命令语句的批处理来描述插件包行为有非常多的好处，例如可拓展、可自定义行为、提供更便捷的高级特性等。而选用 [`TOML`](https://toml.io/cn/) 作为配置文件描述语言则是因为 `TOML` 是一种拥有良好可读性的高级描述语言，并且能很容易地被转换为 `JSON` 或其他数据结构以便被现代程序处理。

当然，我们也会提供相应的 ABNF 语法校验文件、图形化配置生成器和配置检查工具以确保此文件准确地表达了你的意图。

## 目录结构

我们对资源包的目录结构有严格要求，这点与初代插件包不一样。资源包的目录结构仅能为以下三种形式中的一种：

```
- package.toml
- PackageName/
```

或

```
- package.toml
- _scripts/
- PackageName/
```

或

```
- package.toml
- PackageName.exe
```

其中 `PackageName` 代指此资源包的名称；`_scripts` 文件夹用于存放你编写的脚本及其调用的二进制工具，我们会在下一小节解释它。

假设你的资源包文件名为 `MySoftware-runtime_1.0.0_Cno.erp.7z` 且是一个绿色软件，那么你必须将此软件的主程序放置在 `MySoftware-runtime` 目录内；如果这是一个通过安装包静默安装的软件，那么你必须将其安装包命名为 `MySoftware-runtime.exe` 放置在根目录下。

:::tip
对于一些使用 7Zip 打包的单文件程序，我们建议将其解压以获得更好的性能与体验，而不是直接将单文件程序扔在根目录下
:::

除了规定可以出现的文件夹/文件外，不能在根目录放置其他文件夹/文件，这样可以有效保证你所制作的资源的目录不与其他资源冲突。

### 脚本文件夹

将你编写的脚本与主程序分离是很有必要的，这样你可以在主程序有更新时放心地替换主程序目录而不需要担心替换导致的脚本缺失问题。我们指定使用 `_scripts` 文件夹存放你编写的脚本。

通常来说你不需要手动建立这个文件夹，构建工具会扫描所有的 `Script` 类型步骤，然后将使用到的脚本文件移动到 `_scripts` 文件夹。在 `_scripts` 文件夹中的脚本的工作目录依旧会是资源根目录，因此你大可直接在根目录调试你的脚本，然后让构建工具自动移动这些脚本。

不过，由于根目录不允许出现规定内容之外的东西，如果你的脚本引用了一些二进制工具(例如调用 [`jj.exe`](https://github.com/tidwall/jj) 读写 json 文件)，那么你需要这样做：
- 将工具和脚本都放置在根目录中进行编写和测试
- 测试结束后新建 `_scripts` 文件夹，将工具(和脚本)移动到 `_scripts` 文件夹内

:::tip
由于构建工具总是会自动移动使用到的脚本，因此是否要手动移动脚本全看你的心情😋
:::

在运行时，加载器会将这些二进制工具恢复到资源根目录。不过，为了考虑性能和兼容性，加载器并不能保证你使用的工具与其他资源携带的工具产生冲突，因此请谨慎命名这些工具。

:::tip
加载器运行时会动态地重命名你的脚本文件以避免发生脚本覆盖事故，如果需要在脚本中调用另一个脚本，请将*被调用的*脚本拓展名改为 `.bat` (对应cmd脚本)或 `.ini` (对应pecmd脚本)以将它们视为工具，请同样谨慎命名这些工具
:::

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

你可以在 [API 参考](api.md#基础信息) 中查看基础信息的详细规范。

### 最重要的内容！

接下来的内容是关于如何配置插件的，这是配置文件中最重要的一个部分！它是如此的重要以至于我们需要单独分章节来讲解它。

点击前往[工作流章节](workflow.md)，我们将在那里详细讲解工作流、步骤、变量、条件、步骤组等概念。阅读完成后请返回此处并继续向下阅读剩余部分。

:::tip
下面的内容会默认你已经读完了工作流章节
:::

### 卸载

与配置(setup)工作流相对应的是卸载(remove)工作流，例如：

```toml
  [remove_flow.delete_profile]
  name = "Delete profile"
  type = "File"

  operation = "Delete"
  target = "${SystemDrive}/Users/profiles"
```

卸载工作流执行完毕后，Edgeless 还会删掉配置时创建的文件、文件夹、快捷方式，并询问用户是否删除保存的用户数据。
:::tip
对于便携软件来说，可能不需要执行卸载工作流，直接删除生成的程序目录即可完成卸载。对于这种情况，构建工具会检查程序的配置工作流，仅当配置工作流*不包含创维快捷方式以外的步骤*时才会允许卸载工作流同样为空，否则必须提供卸载工作流
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

### 依赖 <Badge text="可选" />

如果你的程序需要安装运行库/运行时依赖或其他资源包，你可以指定所需的依赖，加载器会自动地解决依赖关系。

对于官方提供的依赖项可以指定依赖版本，而对于普通资源包依赖，所填的版本号只是打包者测试使用的版本号，Edgeless 不会严格安装指定的版本。

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

不同类型的资源包通常会拥有一些特定的表用于存放该类资源的通用信息，因此我们保留了拓展区域用于存放额外的信息。

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
date = 2021-09-29 00:32:00+08:00
# 校验时间戳
timestamp = "xxxxx"
```
