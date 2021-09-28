# API参考
## 基础信息
位置： `package` 表
### 包名
简名标识资源包内容的字段
- **键**：`name`
- **类型**：`String`
- **校验**：需要与文件名中的包名相同；不包含`_`
:::tip 备注
如果需要使用`_`分割内容，请用空格或`-`达到近似目的；例如 `nodejs-runtime` 或 `Idea community`

*不要*在包名中提供代指版本号的数字，请在对应的版本号中体现；例如 `VMware Workstation 16` 就是一个不规范的名称，这会导致用户无法接收大版本更新，因此请将其改为 `VMware Workstation`
:::
### 类型
资源包内容类型
- **键**：`type`
- **类型**：`Enum<String>`
- **校验**：`{Software,Driver,Dependency,Theme}`
:::tip 备注
这是一个 String 类型的枚举类，因此取值只能在校验提供的值中选取，下同
:::
### 版本号
资源包内容版本号
- **键**：`version`
- **类型**：`String`
- **校验**：`/^\d+.\d+.\d+(.\d+)?$/`；需要与文件名中的版本号相同
:::tip 备注
取3位或4位版本号

如果是软件推荐使用主程序的产品版本，如果是驱动推荐使用设备管理器中标识的驱动程序版本，如果已知上游内容版本号推荐将其缩短至4位以内使用，其他情况推荐令前三位遵守 [Semver](https://semver.org/lang/zh-CN/) 规范

根据校验规则，禁止在版本号中出现非数字且非`.`的字符，请考虑将不规范的版本字符删除或移动到包名中
:::
### 打包者/作者
打包者与内容作者
- **键**：`authors`
- **类型**：`Array<String>`
- **校验**：打包者（第一个成员）需要与文件名中的打包者相同
:::tip 备注
统一将打包者作为第一个成员提供，如果打包者同时也是内容作者则只需保留一个成员即可

推荐打包者通过附加` <@github_id>`来提供对应的GitHub ID
:::
### 兼容的 Edgeless 版本（可选）
资源包兼容的Edgeless版本
- **键**：`compat`
- **类型**：`Array<String>`
- **校验**：`/^[><]=?\s*\d+.\d+.\d+$/`
:::tip 备注
允许的前缀：`[">=" , "<=" , ">" , "<"]`

缺省表示全部兼容
:::
### 通过测试的 Edgeless 版本
经打包者测试可用的Edgeless版本
- **键**：`tested`
- **类型**：`Array<String>`
- **校验**：`/^\d+.\d+.\d+$/`