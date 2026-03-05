---
tags:
  - Minimal主题
---

# 安装 Obsidian

下载 Obsidian ， 点击进行安装 ：  

https://obsidian.md/

这里的内容使用的是 `Obsidian 1.12.4` 



# 安装主题 Minmal 

利用快捷 `ctrl`+`,` 打开 `设置` 窗口在主题中搜索 Minimal 并安装：  

![[安装 Minimal 主题.svg]]

这个主题的官方介绍链接 ： https://minimal.guide



# 标题栏

下图展示了什么是 `标签页标题栏`  什么是 `页内标题` ：   

![[标题栏显示.svg]]

可以通过下面操作 `隐藏` 或 `显示` 它们 ：   

![[隐藏或显示标题栏.svg]]


## 更多选项

在启用了 `页内标题` 的时候， 可以点击 `更多选项` ：   

![[什么是更多选项.svg]]

如果禁用了 `页内标题` 可以右击标题栏弹出 `更多选项` ：   

![[右击页面标题弹出更多选项.svg]]


# 缩减栏宽

下面是在 obsidian 中限制了一行的宽度， 导致即便页面有更多的空白也不能充分利用 ：  

![[启用缩减栏宽.svg]]

可以通过设置 `缩减栏宽` 来充分利用 Obsidian 页面两侧的空白 ：   

![[禁用缩减栏宽.svg]]

`缩减标题栏` 可以在编辑器下面进行设置  ：  

![[设置缩减标题栏.svg]]


# 折叠标题

`设置` >  `编辑器` 中可以设置对标题栏进行折叠 ：   

![[允许折叠标题栏.svg]]



# 段间距

在预览模式下， 利用段间距可以让阅读更友好 ：   

![[段落间距.svg]]

在 Minimal主题的基础上， 又增加了一些标题间距的功能， 每个标题都有间距设置 ： 

![[各个标题和文章的间距设置.svg]]


# 严格换行

如果启用 `严格换行` 下面一段文字并不换行 ：  

第一行
第二行

> [!INFO] 提示
> 建议`禁用` 严格换行 



# 标题分割

为了使得文档章节看起来更舒服，建议启用 "H1标题分割线" ：    

![[H1标题分割线.svg]]



# 页面布局

下图介绍了 obsidian 的页面布局。默认情况下是扁平化的外观 ：  

![[页面布局.svg]]

右侧通过点击可以切换到不同的窗口 ： 

~~~tabs
tab: 反向链接
![[右侧不同窗口_反向链接.svg]]

tab: 出链
![[右侧不同窗口_出链.svg]]

tab: 标签
![[右侧不同窗口_标签.svg]]

tab: 大纲
![[右侧不同窗口_大纲.svg]]
~~~

这些窗口都可以拖拽图标，进行移动位置 ： 

![[窗口拖拽.mp4]]




# 功能区

在界面最左侧的一些小按钮就是功能区 ：   

![[什么是功能区.svg]]

还可以在设置中进行隐藏/显示，还可以调整顺序 ：  

![[设置中改变功能能区的显示.svg]]


# 图片

图片最好插入到 [[#Diagrams|插件Diagrams]] 中， 然后保存成 `svg` 格式。 

## 附件文件夹

粘贴图片的时候，被复制到了 `工程文件夹` 下。 最好创建一个叫 `Attachments` 的文件夹， 让图片自动粘贴到这里 ：  

![[设置附件文件夹.svg]]


> [!info] 如何删除没有使用的图片
> 1. 可以安装 `Clear unusend images` 插件
> 2. 之后利用 ``ctrl + p`` 调出命令窗口，输入命令：`Clear Unused Images: Clear Unused Images`
> 


## Emoji

可以安装 `Emoji Toolbar` 插件 ，按照下面步骤插入一个 Emoji 符号 ：  
1. `ctrl+p` 调出命令窗口
2. 输入 `Emoji Toolbar:Open emoji picker`
3. 从 *Emoji Toobar* 中选择一个需要的图标
	![[使用Emoji Toobar 插入.svg]]


> [!INFO] 关于Emoji
> 1. [emojipedia](https://emojipedia.org/) 是最权威的 Emoji 网站
> 2. `:gear:` 这样的输入被称为短代码， Obsidian 不会自动转换成符号。复制、粘贴、点选是输入到 Obsidian 中的唯一办法


## Clear unusend images

有时候使用 `Clear unusend images` 清理图片的时候， 需要有些文件夹里面的文件被排除掉，这时候就需要建立一个文件夹把文件都放置进去，比如下面的 `HTML` 文件夹 ：   

![[Clear unused images 排除文件夹.svg]]

下面是一些配套的设置 ： 

![[Clear unused images 排除文件夹设置.svg]]


## 图片大小

可以利用下面语法来插入以像素数为单位的图片 ：  

~~~tabs
tab: 代码
`![[乔布斯照片.png|100]]` 关键代码是 `|100`

tab: 原尺寸
![[乔布斯照片.png]]


tab: 100px
![[乔布斯照片.png|100]]


tab: 200px
![[乔布斯照片.png|200]]


~~~



# Diagrams

[Diagrams](https://github.com/zapthedingbat/drawio-obsidian) 之前叫 [draw.io](https://app.diagrams.net/)  它可以替代 viso， 是目前全球最流行的在线图形编辑软件之一。 它的发展史是一个关于 "`坚持开源`、`对抗订阅制`、`拥抱隐私优先`" 的成功案例。可以将其发展历程分为三个主要阶段： 

~~~tabs
tab: 起步阶段 2000s - 2011
- JGraph 技术积累 
- draw.io 的核心技术源于 JGraph 开源项目。创始人为英国开发者 Baudis Gawron。最初是基于 Java 的图形库，后随 HTML5/SVG 演进转向 Web 端，旨在创建一个免费、跨平台的 Visio 替代方案。

tab: 成长阶段 2012 - 2020
- 成长阶段：draw.io 品牌崛起 
- 2012年正式以 draw.io 域名面世。通过与 Google Drive 深度集成积累数百万用户。采用 "`前端核心代码开源` + `企业集成插件收费`" 的逻辑，使 mxGraph 生态快速扩张，诞生了无数第三方插件（如 Obsidian 插件）。

tab: 转折点 2020 至今
- 转折点：域名迁移与隐私革命 
- 为规避 .io 域名风险及强调隐私安全，正式更名为 diagrams.net。提出 `你的数据属于你` 口号，数据仅在浏览器本地处理。目前核心库 mxGraph 已进入维护模式，团队正在探索更现代的架构。

~~~

> [!INFO] 总结
> 为什么 draw.io 能站稳脚跟?  
>  `极度透明` ：不强制注册，无订阅费。
> `全能兼容` ：支持导入 Visio、Lucidchart 等。
>  `无处不在` ：深度集成于 VS Code、GitHub、Obsidian 及 Confluence。


## 创建 

可以将 Diagrams 直接放在 `Attachments` 中， 并以 SVG 格式进行保存 ： 

![[插入diagram.svg]]
还可以在自己期待的路径下，插入一个 diagram ：  

![[路径下插入diagram.svg]]

## 引用

使用 Diagrams 插件创建的文件是以 `.svg` 格式存在于硬盘， 可以直接引用到 Obsidian 中 ： 

```markdown
![[文件名.svg]]
```


## 打开

可以通过在 obsidian 中右击文件名，打开一个 svg 文件 ：   
![[打开一个diagrams.svg]]

> [!INFO] 提示
> 虽然都是 `文件.svg` 但是 Diagrams 只能识别出自己创建格式的 svg 文件


## 重命名

右键点击一个 `svg` 文件， 有 `重命名` 选项， 修改完以后还会自动更新所有引用 ： 

![[重命名一个diagram.svg]]

如果一个文件被重命名以后， 依然在标题栏没有改变， 可以 ：  

![[刷新diagram的标题.svg]]


## 使用draw.io

使用独立的绘图软件 draw.io 来绘制， 之后只需要保存成 `.svg` ， Diagrams 插件也可以打开 ：  

![[使用drawio绘制.svg]]

> [!INFO] 提示
> 有些功能在插件 Diagrams 中编辑存在问题， 可以在 draw.io 中编辑， 在 Diagrams 中渲染


# 标签

`标签` 是笔记的属性， 右击一个笔记的标题栏可以给一个笔记增加标签属性 ：  

![[为笔记增加属性.svg]]

可以在属性中创建标签，并给标签起名字 ：   
![[为笔记增加标签.svg]]


## 查看标签

可以在右侧标签窗口中查看 ：  

![[查看标签.svg]]


# 关系图谱

打开关系图谱的快捷键是 `ctrl` + `G`， 关系图谱像下面这样 ：  

![[关系图谱.svg]]


## 箭头设置

在关系图谱的显示页面， 有一个齿轮图标 ⚙️ ，点击可以设置图标：

![[关系图谱箭头设置.svg]]


## 孤立文件

在关系图谱中，有很多 `README.md` 文件是孤立的，可以在关系图谱中不显示它们 ：  

![[关系图谱中的孤立文件.svg]]


## 颜色

下面建立一个颜色分组，给某类笔记加上颜色 ： 

![[关系图谱进行颜色分组.svg]]


# 表格

下面是一个表格范例 ：    

| 序号  | 水果  | 营养  |
| :-: | :- | :- |
|  1  | 苹果  | 维C  |
|  2  | 菠萝  | 果酸  |
|  3  | 香蕉  | 糖   |

源码如下 ：  

```markdown
| 序号  | 水果  | 营养  |
| :-: | :- | :- |
|  1  | 苹果  | 维C  |
|  2  | 菠萝  | 果酸  |
|  3  | 香蕉  | 糖   |
```

> [!INFO] 提示
> `:-:` 是居中对齐
> `:-` 是左对齐
> `-:` 是右对齐 


> [!INFO] 源码模式
> 在修改表格的时候，需要切换到 "源码模式"
>  ![[切换到源码模式.svg]]


## 强调文本

| 序号  | 语法                 | 备注             |
| :-: | :----------------- | -------------- |
|  1  | `**`强调的文本`**`      | **强调的文本**      |
|  2  | `*`斜文本`*`          | *斜文本*          |
|  3  | `***`强调并倾斜的文本`***` | ***强调并倾斜的文本*** |
|  4  | `==`高亮文本`==`       | ==高亮文本==       |
|  5  | `~~`删除文本`~~`       | ~~删除文本~~       |
|  6  | `<u>`下划线`</u>`     | <u>下划线</u>     |


# 增强表格

需要安装增强插件 [Tab Extended](https://github.com/aidenlx/table-extended) 下面是它的核心功能 ：   

- `跨列合并` 单元格可以横向跨越多个列
- `跨行合并` 单元格可以纵向跨越多个行
- `块级元素支` 在单元格内直接编写列表、代码块等
- `多行表头` 支持定义多层表头
- `表格标题` 可以为表格添加说明文字
- `省略表头` 支持创建没有表头行的表格

下面范例是它最基础的语法 ：   

````markdown
```tx
|             |          第1组           || 
标题1  | 标题2 | 标题3 | 
 ------------ | :-----------: | -----------: | 
内容       |          *长端元格*        || 
内容       |   **单元格**    |       单元格 | 
新节   |     更多      |         数据 | 
更多示范      | 利用转义符 '\|'       || 
[范例表格]
```
````

```tx
|             |          第1组           || 
|标题1     | 标题2         | 标题3 | 
| ------------ | :-----------: | -----------: | 
内容       |          *跨行合并*        || 
内容       |   **单元格**       | 单元格 | 
新节       |     公式 $\displaystyle \frac{a}{b}$      |         数据 | 
更多示范      | 利用转义符 '\|'       || 
[范例表格]
```


## 多行

多行指的是一个单元格里面有多个元素  ：   
```tx
|   Markdown   | Rendered HTML |
|--------------| --------------- |
|    *Italic*  | *Italic*      | \
|              |               |
|    - Item 1  | - Item 1      | \
|    - Item 2  | - Item 2      |
|    ```python | ```python       \
|    .1 + .2   | .1 + .2         \
|    ```       | ```           |
```

在行后面加上 *\\* 接下来的行就被合并了 ：  

````markdown
```tx
|   Markdown   | Rendered HTML |
|--------------| --------------- |
|    *Italic*  | *Italic*      | \
|              |               |
|    - Item 1  | - Item 1      | \
|    - Item 2  | - Item 2      |
|    ```python | ```python       \
|    .1 + .2   | .1 + .2         \
|    ```       | ```           |
```
````


## 渲染

下面表格里的内容， 有的渲染了有的没渲染 ： 
```tx
|     标题   | 
|--------------|
|**渲染**  |
| **渲染**  |
|   **渲染** |
|    **渲染** |
|     **渲染** |
|      **渲染** |
|    **不渲染** | \
|    **不渲染** |
|    **不渲染** | \
|   **不显示** |
|  **渲染** | \
|   **显示** |
```
表格里面满足两点不渲染 ：  
- 有换行符 *\\*
- 前面必须有4个空格(或更多)

````markdown
```tx
|     标题   | 
|--------------|
|**渲染**  |
| **渲染**  |
|   **渲染** |
|    **渲染** |
|     **渲染** |
|      **渲染** |
|    **不渲染** | \
|    **不渲染** |
|    **不渲染** | \
|   **不显示** |
|  **渲染** | \
|   **显示** |
```
````


## 向上合并

`^^` 符号让一个单元格向上合并 ：   
```tx
Stage | Direct Products | ATP Yields
----: | --------------: | ---------:
Glycolysis | 2 ATP ||
^^ | 2 NADH | 3--5 ATP |
Pyruvaye oxidation |2 NADH | 5 ATP |
Citric acid cycle | 2 ATP ||
^^ | 6 NADH | 15 ATP |
^^ | 2 FADH2 | ^^ |
**30--32** ATP |||
```


## 省略表头

下面展示如何省略表头 ：  
```tx
|--|--|--|--|--|--|--|--|
|♜|  |♝|♛|♚|♝|♞|♜|
|  |♟|♟|♟|  |♟|♟|♟|
|♟|  |♞|  |  |  |  |  |
|  |♗|  |  |♟|  |  |  |
|  |  |  |  |♙|  |  |  |
|  |  |  |  |  |♘|  |  |
|♙|♙|♙|♙|  |♙|♙|♙|
|♖|♘|♗|♕|♔|  |  |♖|
```
表头前面没有任何行就可以 ： 

````markdown
```tx
|--|--|--|--|--|--|--|--|
|♜|  |♝|♛|♚|♝|♞|♜|
|  |♟|♟|♟|  |♟|♟|♟|
|♟|  |♞|  |  |  |  |  |
|  |♗|  |  |♟|  |  |  |
|  |  |  |  |♙|  |  |  |
|  |  |  |  |  |♘|  |  |
|♙|♙|♙|♙|  |♙|♙|♙|
|♖|♘|♗|♕|♔|  |  |♖|
```
````



# Callout

下面是一些 Callout 的展示，关键点在于先输入 `>` 字符  

## NOTE 提示

~~~tabs
tab: 外观
> [!NOTE]
> 这是一个笔记提示。
> 它可以包含**粗体文字**和 [链接](https://www.google.com)。
> 

tab: 语法
```markdown
> [!NOTE]
> 这是一个笔记提示。
> 它可以包含**粗体文字**和 [链接](https://www.google.com)。
```

~~~


## Warning警告

~~~tabs
tab: 外观
> [!WARNING]
> 警告： 
> 在修改系统设置前，请确保你已经备份了所有数据


tab: 语法
```markdown
> [!WARNING]  
> 警告： 
> 在修改系统设置前，请确保你已经备份了所有数据。
```

~~~


## TIP技巧

~~~tabs
tab: 外观
> [!TIP]
> **快捷键小技巧**：
> 按下 `Ctrl + Shift + P` 可以打开命令面板。


tab: 语法
```markdown
> [!TIP]
> **快捷键小技巧**：
> 按下 `Ctrl + Shift + P` 可以打开命令面板。
```

~~~


## IMPORTANT重要

~~~tabs
tab: 外观
> [!IMPORTANT]
> **重要**：
> 所有项目文件必须在今天下午五点前上传到共享文件夹。


tab: 语法
```markdown
> [!IMPORTANT]
> **重要**：
> 所有项目文件必须在今天下午五点前上传到共享文件夹。
```

~~~


## DANGER危险

~~~tabs
tab: 外观
> [!DANGER]
> 危险！
> 此操作将永久删除所有用户数据，且无法恢复！


tab: 语法
```markdown
> [!DANGER]
> 危险！
> 此操作将永久删除所有用户数据，且无法恢复！
```

~~~

## QUOTE引用

~~~tabs
tab: 外观
> [!QUOTE]
> “我思故我在。”
> —— 笛卡尔


tab: 语法
```markdown
> [!QUOTE]
> “我思故我在。”
> —— 笛卡尔
```

~~~


## FAQ常见问题

~~~tabs
tab: 外观
> [!FAQ]
> **问：如何在 Markdown 中创建表格？**
> 答：使用 `|` 和 `-` 字符来创建列和行。


tab: 语法
```markdown
> [!FAQ]
> **问：如何在 Markdown 中创建表格？**
> 答：使用 `|` 和 `-` 字符来创建列和行。
```

~~~


## HELP帮助

~~~tabs
tab: 外观
> [!HELP]
> 如果你遇到问题，请参考我们的 [帮助文档](https://example.com/help)。


tab: 语法
```markdown
> [!HELP]
> 如果你遇到问题，请参考我们的 [帮助文档](https://example.com/help)。
```

~~~


## BUG错误

~~~tabs
tab: 外观
> [!BUG]
> **发现一个 Bug**
> 当输入超过 200 个字符时，文本框会出现卡顿现象。


tab: 语法
```markdown
> [!BUG]
> **发现一个 Bug**
> 当输入超过 200 个字符时，文本框会出现卡顿现象。
```

~~~


## 自由文字

~~~tabs
tab: 外观
> [!  静夜思]
> 窗前明月光，疑似地上霜
> 举头望明月，低头思故乡


tab: 语法
```markdown
> [! 静夜思]
> 窗前明月光，疑似地上霜
> 举头望明月，低头思故乡
```

~~~



# 按键指示

如果你想引导用户输入某个按键，可以用下面语法，比如 **复制** ： 

```markdown
``Ctrl + C``
```

>[!效果]
>``Ctrl + C``


下面是单个按键 W ：

```markdown
`W`
```

>[!效果]
>`W`


# 列表

列表是像下面一样的一些内容罗列，语法是 `1. 空格` 或者 `- 空格` ： 
```tx
| 有序列表 | 无序列表 |
| ----- | ----- |
| 1. 第一行 | - 第一行 | \
| 2. 第二行 | - 第二行 |
```
Minimal 主题还带了一些自己的列表 ：   
```tx
| 语法    | 描述        | 效果           |
|-------|-----------|:--------------:|
| `- [ ]` | to-do       | - [ ] 待办     | 
| `- [/]` | incomplete  | - [/] 未完成   | 
| `- [x]` | done        | - [x] 已完成   |
| `- [-]` | canceled    | - [-] 已取消   |
| `- [>]` | forwarded   | - [>] 已转发   |
| `- [<]` | scheduling  | - [<] 已计划   |
| `- [?]` | question    | - [?] 疑问     |
| `- [!]` | important   | - [!] 重要     |
| `- [*]` | star        | - [*] 星标     |
| `- ["]` | quote       | - ["] 引用     |
| `- [l]` | location    | - [l] 位置     |
| `- [b]` | bookmark    | - [b] 书签     |
| `- [i]` | information | - [i] 信息     |
| `- [S]` | savings     | - [S] 储蓄     |
| `- [I]` | idea        | - [I] 灵感     |
| `- [p]` | pros        | - [p] 优点     |
| `- [c]` | cons        | - [c] 缺点     |
| `- [f]` | fire        | - [f] 紧急     |
| `- [k]` | key         | - [k] 关键     |
| `- [w]` | win         | - [w] 胜利     |
| `- [u]` | up          | - [u] 上升     |
| `- [d]` | down        | - [d] 下降     |
```


## 智能列表

开启了智能列表， Obsidian 将自动调整列表编号 : 

![[智能列表启用和禁用效果对比.svg]]

> [!INFO] 提示
> 建议**关闭**，行为很难预测


## 多级列表

1. 第一步
	1. 开启设备
	2. 等待温度升高
	3. 关闭设备
2. 第二步
	- 启动电脑
	- 启动空调
	- 关闭油烟机
3. 第三步
	通过旅游提高幸福度

上面是使用 `Tab` 和 `shift + Tab` 完成的操作，注意要 `禁用智能列表` 。 


## 换行

如果要写一个图文的长段落， 是需要换行的 ：

1. 《静夜思》
	床前明月光，疑似地上霜。
	举头望明月，低头思故乡。
2. 《登鹳雀楼》
	白日依山尽，黄河入海流。
	欲穷千里目，更上一层楼。


> [!INFO] 输入方法
> 1.`空格`《静夜思》`回车`
> `Tab` 窗前明月光，疑似地上霜。`回车`
> `Tab` 举头望明月，低头思故乡。`回车`
> 2.`空格` 《登鹳雀楼》`shift + Tab` `回车`
> ...

利用 `shift+回车` 进行段内换行 ，利用 `回车` 开始新的一段




# 图表工具

如果需要展示一些简单的图表，可以使用插件 [[Mermaid]]



# 嵌入页面

下面展示了如何在 Obsidian 中嵌入一个页面 ：   

<iframe src="https://mszturc.github.io/obsidian-advanced-slides/examples/minml/" style="width:100%; height:400px" > </iframe>

```markdown

<iframe src="https://mszturc.github.io/obsidian-advanced-slides/examples/minml/" style="width:100%; height:400px" > </iframe>

```

> [!TIP] 提示
> 如果要嵌入本地 HTML页面，可以先将页面在浏览器中打开，再复制链接。


## WEB服务器

导出的 HTML 文件，双击在浏览器中打开会存在两个问题 ：  

1. 有时候 Obsidian 利用 file:// 协议嵌入会失败
2. 谷歌浏览器对 file:// 协议限制， 搜索、链接、侧边栏交互都存在问题

这样可以使用 python 提供的 web 服务器 ：

https://www.python.org/downloads/

我使用的是 Python3 ， 在 `导出页面的文件夹` 下面运行终端， 然后输入命令：  

```powershell
python -m http.server 8000
```

在浏览器中输入网址打开界面 ：   

http://localhost:8000/

通常这个 URL 会默认打开 `index.html`  页面，下面的 `index.html` 会自动跳转 ：   

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>自动跳转中...</title>
</head>
<body>
    <h1>正在跳转到新页面...</h1>
    <p>如果浏览器没有自动跳转，请点击<a href="想跳转到的页面.html">这里</a>。</p>

    <script>
        // 这行代码会在页面加载后立即执行
        // 将 "another_page.html" 替换成你想要跳转的目标页面地址
        window.location.href = "想跳转到的页面.html";
    </script>
</body>
</html>
```


## Relative Iframe插件

这个插件在 `{VaultFolder}\.obsidian\plugins\Relative-Iframe` 文件夹下。可以将本地页面直接嵌入到 Obsidian 中：  
```iframe
HTML/dirichlet核函数.html?yRange=20.00&nValue=330 400px Dirichlet 核函数
```
 Relative-Iframe插件的语法，其中 `400px` 是窗口高度，`Dirichlet 核函数` 是标题栏名称 ：  
 
````markdown
```iframe
HTML/dirichlet核函数.html?yRange=20.00&nValue=330 400px Dirichlet核函数
``` 
````

> [!INFO] 提示
> 为了清理图片的时候 `本地页面.html` 不被清除掉， 需要注意 [[#Clear unusend images]]


# 幻灯片

使用 Obsidian 制作幻灯片需要使用插件 ：[[Advanced Slides幻灯片插件| Advanced Slides]] 。


# Tabs 插件

使用该插件， 可以像下面这样， 添加几个可以切换的 "标签" ：

~~~tabs
tab: python
```python
print("Hello Tabs")
```

tab: javascript
```javascript
console.log('Hello Tabs');
```

~~~

下面是插件的语法 ： 

````
~~~tabs
tab: python
```python
print("Hello Tabs")
```

tab: javascript
```javascript
console.log('Hello Tabs');
```
~~~
````


# 文字颜色

可以利用下面 HTML 代码来使文字具有某种颜色 ： 

~~~tabs
tab: 效果
<span style="color:rgb(0, 0, 255);">一段蓝色文字</span>

tab: 语法
```markdown
<span style="color:rgb(0, 0, 255);">具有某种颜色的文字</span>
```

~~~


# 气泡提示

利用下面语法可以实现气泡提示 ：  

~~~tabs

tab: 效果
<abbr title="气泡里的文字">触碰我，会有提示</abbr>


tab: 语法
```markdown
<abbr title="气泡里的文字">表面文字</abbr>
```
~~~


# Tree 插件

下面展示了一个 "树" ， 需要安装插件 `ASCII Tree Generator` ：   

## 语法1

~~~tabs
tab: 语法
````markdown
```tree
Project
- Documentation
  - README.md
  - Changelog.md
- Source
  - Frontend
    - Components
      - Header
      - Footer
  - Backend
    - API
      - User
      - Product
- Tests
  - Unit
  - Integration
```
````

tab: 效果
```tree
Project
- Documentation
  - README.md
  - Changelog.md
- Source
  - Frontend
    - Components
      - Header
      - Footer
  - Backend
    - API
      - User
      - Product
- Tests
  - Unit
  - Integration
```
~~~


## 语法2

更容易看清除层级关系的语法 ： 

~~~tabs
tab: 语法
````markdown
```tree
Project
=Documentation
==README.md
==Changelog.md
=Source
==Frontend
===Components
====Header
====Footer
==Backend
===API
====User
====Product
=Tests
==Unit
==Integration
```
````

tab: 效果
```tree
Project
=Documentation
==README.md
==Changelog.md
=Source
==Frontend
===Components
====Header
====Footer
==Backend
===API
====User
====Product
=Tests
==Unit
==Integration
```
~~~


# 3D模型

安装插件 `Model Viewer` ：   

~~~tabs
tab: 语法
````markdown
![[鱼.glb]]
````

tab: 效果
![[鱼.glb#height=400]]
~~~



# 缩略图

在目录里，如果想缩略查看段落，可以按住 `ctrl` 键鼠标触碰 ：  

![[如何使用缩略图查看.svg]]


## 锚点

除了标题还可以缩略到任何 `锚点` ， 使用 `^` 给任意段落加锚点 ：   

````markdown

需要跳转，缩略的段落

^your-unique-id

````

> [!TIP] 提示
> 如果需要跳转， 使用语法 ：
> 
> `[[文章#^your-unique-id|显示的内容]]`
> 


# 打开文件

假设有一个文件， 叫 `滕王阁序.txt` 。希望点击 [滕王阁序](Attachments/滕王阁序.txt) 打开这个文件 ：  

```markdown
[滕王阁序](Attachments/滕王阁序.txt)
```

阅读模式下 Obsidian 会自动调用 Windows 的默认程序把这个文件打开， 编辑模式下按住 Ctrl 然后再点击 ：  

![[编辑模式下如何打开一个文件.svg]]

> [!INFO] 注意
> 文件名里面有空格，需要用 `%20` 代替， 建议文件名里不要有空格



# 自定义插件

自己编写的插件， 建立一个文件夹，名字是 `my_plugins` ：   

```tree
工程
- .obsidian
    - plugins
         - my_plugins
```

将编程好的插件拷贝到文件夹下就可以了 ：    
![[拷贝插件到文件夹下.svg]]

> [!INFO] 提示
> 当然需要在 `设置` > `第三方插件` 里面启用



## 调试

自己在编写插件的时候， 会遇到调试问题 。 此时就需要在 obsidian 中调出控制台， 查看错误日志 ： 

> [!INFO] 快捷键
> ctrl + shift + i 
> 打开/关闭都使用相同的快捷键

![[打开调试面板.svg]]


# 白板 CANVAS

下面连接是官方介绍链接  ： [https://obsidian.md/canvas](https://obsidian.md/zh/canvas)

笔记、图片、PDF、视频、音频、网页，无限空间，交织一起， 用于头脑风暴。 



# 导出HTML页面

不要使用 `相对标题链接` 因为它会导致生成的页面大纲无法跳转 ： 

![[不使用相对标题链接.svg]]

## 保存配置

有两个位置可以 `导出为HTML` 一个是在 `文件列表`， 另外一个是在 `功能区` ： 

![[导出为HTML方法.svg]]

但是在 `功能区` 的 `导出为HTML` 是记忆之前的导出设置，但是需要进行保存 ： 

![[保存导出为HTML参数.svg]]


## 添加页面标题

将文件名添加到导出的HTML页面最上方 ： 

![[添加页面标题.svg]]


## 摆放位置

下面是 `图形视图` 和 `大纲` 的不同摆放位置 ：  

![[导出HTML不同元素的摆放位置.svg]]

他们两个设置了相同的容器， 一个在 `start` 另外一个在 `end` ： 

![[导出HTML摆放位置设置.svg]]


## 亮暗切换

下面是亮暗切换的设置，禁用后导出页面没有亮暗切换按钮 ： 

![[Webpage HTML Export 主题切换.svg]]


## 页面宽度

页面宽度可以设置的宽一些，如果屏幕尺寸不够大会自动换行 ： 

![[Webpage HTML Export文档宽度.svg]]

> [!INFO] 提示
> 100em 就是 100 个字的宽度




