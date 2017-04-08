跨浏览器的书签同步工具
npm install 安装依赖
grunt 打包

##本项目主要工作：

1. 每隔一段时间对服务器进行同步，若发现有变化则红点提示用户更新，标明此次更新内容
2. 登录或注册

## 项目结构

本项目主要由前端浏览器插件(extension)和后端nodejs服务器(server)构成，使用mysql服务器。

浏览器插件部分主要应用火狐浏览器插件，文档(https://developer.mozilla.org/zh-CN/Add-ons/WebExtensions)[WebExtension]。

node服务器使用Express框架。


