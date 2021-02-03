# Edgeless LocalBoost
> 需要Edgeless 3.1.3以上版本

## 什么是LocalBoost
将插件安装到本地磁盘的加速仓库中而非内存中，以加速Edgeless在此电脑上的启动速度，并有可能保留插件运行的用户数据（由插件运行性质决定）

使用LocalBoost后，可缩短80%的插件载入时间，以极大的提高Edgeless的启动速度

## LocalBoost的局限性
1. 只能针对某台电脑实现加速，不具备可迁移性
2. 需要占用本地磁盘空间

## 如何使用LocalBoost
### 启动时加载
1. 打开`U盘:\Edgeless\Resource`，将需要以LocalBoost形式安装的插件拓展名由`.7z`更改为`.7zl`
![1.jpg](https://gitee.com/cnotech/edgeless-wiki-vuepress/raw/master/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-02-03%20173356.jpg)
2. 启动Edgeless，启动时会弹出LocalBoost仓库选择，选择本地的某个可用分区即可，插件将会被安装至`此分区:\Edgeless\BoostRepo`

![2.jpg](https://gitee.com/cnotech/edgeless-wiki-vuepress/raw/master/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-02-03%20173800.jpg)

>如果程序扫描到本地已经存在加速仓库目录，则会直接将此插件安装到该仓库中，不会弹出选择界面

> 此时关闭对话框，则所有的`.7zl`插件都不会被安装

### 热加载（启动后加载）
1. 在`.7z`文件上右键-作为插件包加载，或是双击`.7zf``.7zl`文件，会弹出插件加载对话框
![3.jpg](https://gitee.com/cnotech/edgeless-wiki-vuepress/raw/master/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-02-03%20174045.jpg)
2. 选择LocalBoost，点击安装，程序会将此插件包安装至先前扫描到的默认加速仓库（BoostRepo）中![4.jpg](https://gitee.com/cnotech/edgeless-wiki-vuepress/raw/master/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-02-03%20174221.jpg)
> 如果先前扫描时此电脑中尚未存在可用的加速仓库，则会弹出LocalBoost仓库选择，选择本地的某个可用分区即可


## 从加速仓库删除插件
浏览目标分区的加速仓库目录`此分区:\Edgeless\BoostRepo`，将需要删除的插件文件夹删除即可
![5.jpg](https://gitee.com/cnotech/edgeless-wiki-vuepress/raw/master/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-02-03%20174534.jpg)