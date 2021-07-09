<!--
 * @Author: Azhou
 * @Date: 2021-04-22 23:26:23
 * @LastEditors: Azhou
 * @LastEditTime: 2021-04-29 18:29:55
-->
# 更新代码后重新打包镜像
  ```
  docker build --no-cache -t dataturks/dataturks:2.0.0 -f ./Dockerfile ./
  ```
# 本地启动docker
  ```
  docker run -d -p 80:80 dataturks/dataturks:2.0.0
  ```
#### node版本管理工具 n
> [Mac下node多版本管理](https://blog.csdn.net/qq_40183053/article/details/107390818)
+ 全局安装 n
```
npm install -g n
```
+ 安装node的最新版本
```
sudo n latest
```
+ 安装node指定版本
```
sudo n 8.3.0
```
+ 切换node版本
> 终端输入n并按回车  
> 选择要切换的node版本并按回车

+ 查看当前node版本
```
node -v
npm -v
```
+ 安装gulp
```
// 这里安装的是全局gulp(可不执行)
sudo npm install gulp -g

//前端依赖库中有一项 “semantic-ui”对gulp的版本要求是 4.0，因此在项目库中需要执行以下命令：
sudo npm install -g gulp-cli  (这一步可以省略，不过建议也运行一下)
npm install -save-dev gulp@4

```
+ 安装node-sass
```
// 安装sass报错Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime (83)的解决方法

npm uninstall node-sass&& npm install node-sass
```

#### mvn package
+ mvn打包时报错：【"package javax.xml.ws does not exist."】
```
// 在 /hope/pom.xml 中手动添加依赖
<!-- https://mvnrepository.com/artifact/javax.xml.ws/jaxws-api -->
<dependency>
    <groupId>javax.xml.ws</groupId>
    <artifactId>jaxws-api</artifactId>
    <version>2.3.1</version>
</dependency>
```

#### 本机 onprem 模式运行，修改一些 js 配置文件
> [Mac 配置 Dataturks，非 docker](https://www.jianshu.com/p/326190494c04)

# 2021年5月13日更新

MySQL 驱动版本不能过高，否则可能出现无法连接数据库的情况，建议 8.0.16

```xml
<properties>
    <mysql-connector.version>8.0.16</mysql-connector.version>
</properties>
```

# 2021年5月31日

后端服务必须部署在 Linux 系统

原始项目的上传逻辑是：

（1）把图片压缩包先上传到 `/tmp` 目录

（2）解压缩

（3）将解压缩的图片复制到前端工程的 `uploads` 目录，即`/home/dataturks/bazaar/uploads`

# 2021年6月30日

## 图片请求跨域问题解决

目前的图片目录是用 `serve` 这个插件对前端根目录开了个服务器

出现了部分时候不能请求图片的 bug，目前处理的方式是开启跨域访问

```bash
 (serve bazaar -C -l 3030 &)
 # -C 开启跨域
 # -l 3030 使用3030端口
```

