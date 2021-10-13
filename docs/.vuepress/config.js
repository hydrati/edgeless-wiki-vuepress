module.exports = {
  base: "/v2/",
  title: "Edgeless Wiki",
  description: "强大而优雅的半开源PE工具",
  head: [
    ['link', { rel: 'icon', href: 'https://home.edgeless.top/favicon.ico' }]
  ],
  plugins: ['vuepress-plugin-export'],
  themeConfig: {
    repo: 'EdgelessPE/Edgeless',
    docsRepo:'https://gitee.com/cnotech/edgeless-wiki-vuepress',
    editLinks: true,
    editLinkText: '在 Gitee 上编辑此页',
    docsDir: 'docs',
    lastUpdated: '最近更新于',
    logo: "https://home.edgeless.top/favicon.ico",
    nav: [
      { text: "首页", link: "https://home.edgeless.top" },
      { text: "下载站", link: "https://down.edgeless.top" },
    ],
    sidebar: [
      { title: "写在前面", path: "/required" },
      {
        title: "总览",
        children: [
          { title: "日志", path: "/global/log" },
          { title: "瞎扯", path: "/global/something" },
          {
            title: "感谢",
            path: "/global/thanks",
            sidebarDepth: 0,
            collapsable: false,
          },
          { title: "用户协议", path: "/global/contract" },
          { title: "捐赠列表", path: "/global/donate" },
        ],
      },
      {
        title: "FAQ",
        children: [
          { title: "PE是啥", path: "/faq/whats" },
          { title: "什么是Edgeless ME", path: "/faq/ME" },
          { title: "如何获取ISO镜像", path: "/faq/getiso" },
          { title: "如何有效地报告错误", path: "/faq/report" },
          { title: "桌面上的更多工具是啥", path: "/faq/moretools" },
          { title: "启动盘制作失败", path: "/faq/fail2burn" },
          { title: "显示器显示超出范围", path: "/faq/displayerror" },
          { title: "UEFI启动后分辨率过低", path: "/faq/resolution" },
          { title: "进不了PE或进入后黑屏", path: "/faq/entrydenied" },
          { title: "卡在93.1%，正在载入用户配置", path: "/faq/stuck" },
          { title: "进入PE后出现异常情况", path: "/faq/someerror" },
          { title: "连不了网、没有硬盘、不能触控", path: "/faq/hardwareerror" },
          // { title: "识别不了exFAT分区、分区出错", path: "/faq/diskparterror" },
          { title: "使用主题资源包时出错", path: "/faq/themeerror" },
          { title: "插件的快捷方式乱码", path: "/faq/messycode" },
        ],
      },
      {
        title: "教程",
        children: [
          { title: "如何写入Edgeless到U盘", path: "/guide/burn" },
          { title: "如何从U盘启动Edgeless", path: "/guide/boot" },
          { title: "如何使用Edgeless安装系统", path: "/guide/installwindows" },
          { title: "如何使用插件包", path: "/guide/pluginpackages" },
          { title: "如何使用主题资源包", path: "/guide/themepackages" },
        ],
      },
      {
        title: "玩转Edgeless",
        children: [
          { title: "ept插件包管理工具", path: "/playground/ept" },
          { title: "LocalBoost仓库加速", path: "/playground/localboost" },
          { title: "生命周期钩子", path: "/playground/hooks" },
          { title: "官方的自定义玩法", path: "/playground/config" },
          { title: "如何添加自定义驱动", path: "/playground/driver" },
          { title: "寄生启动", path: "/playground/parasitism" },
          { title: "替换镜像启动", path: "/playground/replace" },
          { title: "其他姿势启动", path: "/playground/other" },
          { title: "修改浏览器插件包", path: "/playground/browser" },
          { title: "开机欢迎音乐", path: "/playground/welcome" },
        ],
      },
      {
        title: "开发者文档",
        children: [
          { title: "须知", path: "/develop/notice" },
          { title: "GitHub", path: "/develop/GitHub" },
          { title: "API", path: "/develop/API" },
          { title: "Edgeless开发环境的搭建", path: "/develop/devenvironment" },
          {
            title: "开发插件包",
            children: [
              { title: "快速上手", path: "/develop/quickstart" },
              { title: "常规开发", path: "/develop/plugin" },
              { title: "自动构建", path: "/develop/automake" },
              { title: "暴力封装", path: "/develop/force" },
              // { title: ".net插件包", path: "/develop/net" },
            ],
          },
          {
            title: "开发主题包/资源包",
            children: [
              { title: "常规开发", path: "/develop/theme" },
              { title: "使用主题抓取套件", path: "/develop/grab" },
            ],
          },

          { title: "开发必要组件包", path: "/develop/nes" },
          { title: "开发内核", path: "/develop/kernel" },
        ],
      },
      {
        title: "合作洽谈",
        children: [
          { title: "获取授权", path: "/cooperation/permit" },
          { title: "小黑屋", path: "/cooperation/blacklist" },
          { title: "FirPE", path: "/cooperation/FirPE" },
          { title: "WNGB PE", path: "/cooperation/WNGBPE" },
          { title: "FlyPE", path: "/cooperation/FlyPE" },
          { title: "Hikari PE", path: "/cooperation/HikariPE" },
          { title: "51NB PE", path: "/cooperation/51NBPE" },
          { title: "Samarium", path: "/cooperation/Samarium" },
          { title: "PanDa PE", path: "/cooperation/PanDaPE" },
          { title: "YIUPE", path: "/cooperation/YIUPE" },
        ],
      },
      // {
      //   title: "媒体",
      //   children: [
      //     { title: "转载须知", path: "/media/notice" },
      //     { title: "官方文案", path: "/media/material" },
      //   ],
      // },
    ],
    smoothScroll: true
  },
};
