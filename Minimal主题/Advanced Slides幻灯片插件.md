---
homepage: http://localhost:8000
tags:
  - Minimal主题
---

# 推荐链接

> [!INFO] 提示
>  
> | 网站 | 链接 |
> | :-- | :-- |
> | Advanced slide 官网 |https://mszturc.github.io/obsidian-advanced-slides/|
> | 技术源头， 这个网站的页眉上就展示了一个非常强大的幻灯片 ： | https://revealjs.com/zh-hant/ |
> |技术源头(英文)，展示效果正常 | https://revealjs.com/ |
> |slides carnival 各种幻灯片模板|https://www.slidescarnival.com/|
> |slide go 各种幻灯片模板|https://slidesgo.com/|



# [Advanced Slides](https://github.com/MSzturc/obsidian-advanced-slides?tab=readme-ov-file)

这是利用 Obsidian 制作幻灯片的插件。下面是它的一个典型 <abbr title="需要科学上网才可以看到下面demo">demo</abbr> ：   

<iframe src="https://mszturc.github.io/obsidian-advanced-slides/examples/minml/#/" style="width:100%; height:400px" > </iframe>

在 Obsidian 中按照下面顺序可以安装、使用 Advanced Slides ：    

1. 安装 `Advanced Slides 插件` 只需要在插件市场搜索 ： advanced slides， 但是有些小 bug 
2. 下面是事先准备好的幻灯片代码 
   ![[幻灯片/范例幻灯片.md|raw]]
   
3. 点击图标，可以播放幻灯片    
   ![[Show Slide preview.svg]]

这个插件的有一个理念 `约定大于配置` ， 你只需要在 obsidian 中用 markdown 写幻灯片内容就可以了， 格式和样式都是约定好的。  

## 在浏览器中打开

在预览一个页面的时候， 可以用浏览器打开 ：    

![[Advanced Slides 在浏览器中打开.svg]]


> [!INFO] 提示：如何全屏
> 按 `F` 进入全屏，按 `esc` 退出，或者鼠标触碰最上方



# 插入幻灯片

利用下面语法，可以将一个 Advance Slides 的幻灯片插入到笔记中 ：   

~~~tabs
tab: 语法
````markdown
```slide
{
	slide:[[Attachments/幻灯片/范例幻灯片]],
	page: 1
}
```
````
tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/范例幻灯片]],
	page: 1
}
```
~~~

> [!INFO] 注意
> 1. 幻灯片里的图片， 不可以使用相对路径，像这样 `![](Attachments/image.jpg)` 必须使用 obsidian 的引用路径 `![[image.jpg]]` 否则 obsidian 会卡死
> 2. 插入的幻灯片是不可以播放的， 只能插入某一页



## 动态页面

在预览幻灯片的时候， 可以导出 HTML 文件 ：   

![[Advanced Slides 导出HTML.svg]]

> [!INFO] 提示
> 导出的页面需要利用 [[Minimal主题#WEB服务器|web服务器]] 才可以正常放映



# 分页

使用下面字符来分割幻灯片 ：    

```markdown
水平分割，三道杠
---
垂直分割，两道杠
--
```

利用垂直和水平幻灯片，可以对幻灯片进行章节分割 ：  
![[分页.md|raw]]


下图更清楚展示了页面的架构，在播放幻灯片的时候按 `ESC` 键可以看到该布局 ：   

![[幻灯片分页.svg]]



# 元素注释

可以给一个元素添加注释， 改变它的外观。下面代码会给一行文本加上背景色 ：   

~~~tabs
tab: 代码
![[幻灯片/元素注释|raw]]



tab: 外观
```slide
{
	slide:[[Attachments/幻灯片/元素注释]],
	page: 0
}
```
~~~

> [!INFO] 注意
> 元素注释非常有效， 想改变效果，推荐优先尝试元素注释



## 标题颜色

下面范例代码展示了如何给标题文字设置成黑色 ：  

~~~tabs
tab: 代码
![[幻灯片/标题颜色|raw]]

tab: 外观
```slide
{
	slide:[[Attachments/幻灯片/标题颜色]],
	page: 0
}
```
~~~



## 页面注释

下面代码会给页面更换背景色 `<!-- .slide: style="background-color: coral;" -->` ：  

~~~tabs
tab: 代码
![[幻灯片/页面注释|raw]]

tab: 0
```slide
{
	slide:[[Attachments/幻灯片/页面注释]],
	page: 0
}
```

tab: 1
```slide
{
	slide:[[Attachments/幻灯片/页面注释]],
	page: 1
}
```

~~~



## 块注释

可以将注释作用到一块元素上 ：  

~~~tabs
tab: 代码
![[幻灯片/块注释|raw]]

tab: 0
```slide
{
	slide:[[Attachments/幻灯片/块注释]],
	page: 0
}
```

tab: 1
```slide
{
	slide:[[Attachments/幻灯片/块注释]],
	page: 1
}
```

~~~

> [!INFO] 语法
>  `:::block` `<!-- element style="background-color: blue;" -->`
>  
>  `:::`
> 



## 代码解释

在编写幻灯片的时候， 还可以加一些代码注释 ：  

```
幻灯片某段文字  <!-- 这里是注释 -->
```



# 主题

之前的范例，为了实现 `背景黑色`， `文字白色`，需要对多个元素进行设置 ：  
![[幻灯片/标题颜色|raw]]

也可以像下面这样使用白色主题，就不用对多个元素进行设置 ：  

~~~tabs
tab: 代码
![[幻灯片/白色主题|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/白色主题]],
	page: 0
}
```
~~~

下面是一些可用的主题 ：   

| 序号  | 编码                  | 说明            |
| --- | ------------------- | ------------- |
| 1   | black               | 黑色(默认)        |
| 2   | white               | 白色            |
| 3   | league              | 联盟            |
| 4   | beige               | 浅褐色           |
| 5   | sky                 | 天空            |
| 6   | night               | 夜晚            |
| 7   | serif               | 衬线            |
| 8   | simple              | 简单            |
| 9   | solarized           | 晒干            |
| 10  | blood               | 血色            |
| 11  | moon                | 月亮            |
| 12  | consult             | 咨询            |
| 13  | css/mattropolis.css | 一个自带的*自定义css* |


## 自定义

Advanced Slides 为我们自带了几个 `自定义css`， 它在 `.obsidian\plugins\obsidian-advanced-slides\css` 路径下。可以像下面这样引用 ：  

~~~tabs
tab: 代码
![[幻灯片/自定义主题|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/自定义主题]],
	page: 0
}
```
~~~


## 高亮

高亮主题是为了给代码块使用，像下面这样 ：  

~~~tabs
tab: 代码
![[幻灯片/高亮主题|raw]]


tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/高亮主题]],
	page: 0
}
```
~~~



## 第三方

还可以使用第三方的主题 ： 

````markdown
---
theme: https://revealjs-themes.dzello.com/css/theme/robot-lung.css

---

...

````


# 片段

给元素标记了 `fragment` 以后， 元素会淡入到幻灯片中 ：  

~~~tabs
tab: 源码
![[幻灯片/片段.md|raw]]

tab: 效果
![[幻灯片片段.gif]]

~~~



# 内联样式

可以在代码中增加一个样式， 然后直接作用到元素上 ：  

~~~tabs
tab: 代码
![[幻灯片/内联样式|raw]]

tab: 样式
```slide
{
	slide:[[Attachments/幻灯片/内联样式]],
	page: 0
}
```

~~~



# 背景

下面代码展示了如何给幻灯片增加背景 ：  

~~~tabs
tab: 源码
![[幻灯片/背景.md|raw]]

tab: 效果
![[幻灯片背景.gif]]

~~~



## 本地路径

本地路径受 [[Minimal主题#附件文件夹|附件文件夹路径]] 设置的影响， 语法是 `bg=![[image.jpg]]`  ： 

> [!INFO] 提示
> 不要引号`![[image.jpg]]`
> 
>  下面代码是不对的，多了引号。导出 HTML 时会遇到问题 ：
> `<!-- slide bg="![[image.jpg]]" data-background-size="contain" -->`


## RevealJS

在这个网站上， 有更多关于幻灯片背景设置的方法 ： 

https://revealjs.com/backgrounds/

以图片等比例缩放全部展示为例，使用语法 `data-background-size="contain"` ： 

```markdown
<!-- slide bg=![[image.jpg]] data-background-size="contain" -->
```


## 透明

透明的概念是背景图能看到多少， 这里的 0.2 表示只能看到 20% ：  

```markdown
<!-- slide bg="https://picsum.photos/seed/picsum/800/600" data-background-opacity="0.2" -->
```


# 提示词

可以给演讲者加一些提示词，按 `s` 弹出对话框， 不在主屏幕上显示 ：    

~~~tabs
tab: 源码
![[幻灯片/提示词.md|raw]]


tab: 效果
![[提示词.gif]]

~~~

幻灯片中 note 以后的文字不会被放映出来，被认为是提示词，在一个新的浏览器窗口中被打开 ：  

![[Advanced Slides 提示词界面.svg]]


# 熄屏

Advance Silds 自带的功能， 按 `B` 键 或者 `.` 键将幻灯片熄灭， 然后供演讲者发挥讲解 ：   

![[幻灯片息屏.gif]]



# 放大局部

在播放的时候按 `alt` + `点击左键`， 鼠标点哪就放大哪。 在 Advanced Slides 中鼠标点击不会切换到下一页， 所以完全不必担心 ：    

![[幻灯片放大局部.gif]]



# 幻灯片属性

通过在 `.md` 文件最前面增加属性，可以控制幻灯片的`尺寸`、`主题` 等 ：    

![[YAML配置方法.svg]]

下面是可用的一些幻灯片属性 ：  

| 名称                  | 描述                                                                | 数据类型                                          | 默认值               |
| ------------------- | ----------------------------------------------------------------- | --------------------------------------------- | ----------------- |
| width               | Sets the width of the presentation                                | number                                        | 960               |
| height              | Sets the width of the presentation                                | number                                        | 700               |
| margin              | Empty space around the content                                    | number                                        | 0.04              |
| minScale            | Bounds for smallest possible scale to apply to content            | number                                        | 0.2               |
| maxScale            | Bounds for largest possible scale to apply to content             | number                                        | 2.0               |
| notesSeparator      | Sets the note delimiter                                           | string                                        | note:             |
| separator           | Sets the slide separator                                          | string                                        | ^( ?\| )—( ?\| )$ |
| verticalSeparator   | Sets the vertical slide separator                                 | string                                        | ^( ?\| )–( ?\| )$ |
| enableLinks         | Enable backlinks in slides                                        | true / false                                  | false             |
| theme               | Sets the theme                                                    |                                               | black             |
| highlightTheme      | Sets the highlight theme                                          |                                               | zenburn           |
| css                 | Adds further css files                                            |                                               | []                |
| enableOverview      | Shows the Overview Button on the bottom right corner of the slide | true / false                                  | false             |
| enableChalkboard    | Activates the chalkboard for slides                               | true / false                                  | false             |
| controls            | Display presentation control arrows                               | true / false                                  | true              |
| controlsLayout      | Determines where controls appear                                  | edges / bottom-right                          | bottom-right      |
| progress            | Display a presentation progress bar                               | true / false                                  | true              |
| slideNumber         | Display the page number of the current slide                      |                                               | false             |
| overview            | Enable the slide overview mode                                    | true / false                                  | true              |
| center              | Vertical centering of slides                                      | true / false                                  | true              |
| loop                | Loop the presentation                                             | true / false                                  | false             |
| rtl                 | Change the presentation direction to be RTL                       | true / false                                  | false             |
| shuffle             | Randomizes the order of slides each time the presentation loads   | true / false                                  | false             |
| fragments           | Turns fragments on and off globally                               | true / false                                  | true              |
| showNotes           | Flags if speaker notes should be visible to all viewers           | true / false                                  | false             |
| autoSlide           | Controls automatic progression to the next slide                  | number (in milliseconds)                      | 0                 |
| transition          | Transition style                                                  | none / fade / slide / convex / concave / zoom | slide             |
| transitionSpeed     | Transition speed                                                  | default / fast / slow                         | default           |
| bg                  | Sets a default background for all slides                          |                                               | ‘#ffffff’         |
| markdown            | Sets options for marked                                           | (see note below)                              | (see note below)  |
| enableTimeBar       | Activates elapsing timer bar for slides                           | true / false                                  | false             |
| timeForPresentation | Sets the time for elapsing timer in seconds                       | number                                        | 120               |
| defaultTemplate     | Sets a template that will be applied to all slides                |                                               | null              |

下面是 Advanced Slides 介绍的属性 ：  
https://mszturc.github.io/obsidian-advanced-slides/yaml/

更多参数还可以参考 ： 
https://revealjs.com/config/



## 宽高

属性 `width` 和 `height` 设置的并不是以像素为单位的幻灯片`宽度`和`高度`，但是比例是一致的 ：  

~~~tabs
tab: 代码
![[幻灯片/幻灯片宽高|raw]]

tab: 0
![[幻灯片宽高浏览器效果Ⅰ.svg]]


tab: 1
![[幻灯片宽高浏览器效果Ⅱ.svg]]

~~~

下图是同样的浏览器窗口， 相同的宽高比但是不同的宽高值显示效果。分辨率高可以容纳更多文字 ： 

![[幻灯片不同分辨率对文字显示的影响.svg]]

> [!INFO] 提示
> 通常的会议幕布以 16:9 为主， 电脑显示屏是 1920 : 1080 


## 留白

属性 `margin`  设置留白比例，下图是同样尺寸大小浏览器 `留白` 和 `不留白` 的效果 ：  

![[幻灯片留白比例.svg]]

> [!INFO] 提示
> 将 `margin` 设置为 0， 宽高与屏幕分辨率一致， 按 `f` 全屏播放， 你将得到一个完全适合某台机器的幻灯片， 如果希望幻灯片可以全屏这点**非常重要**。



## 背景

属性 `bg` 可以给所有页面设置背景颜色，但是依然可以随时对整个幻灯片色进行修改 ：   

~~~tabs

tab: 源码
![[幻灯片/幻灯片全局背景色|raw]]

tab: 效果

![[幻灯片yaml背景颜色设置.svg]]

~~~

属性 `bg` 还可以设置成图片，需要在浏览器中才可以看到效果 ：  

```
---
bg: Attachments/image.jpg
width: "800"
height: "600"
---

<grid drag="100 100" drop="0 0">
第一页
</grid>
---

<grid drag="100 100" drop="0 0" bg="red">
第二页
</grid>

```



## 自动播放

可以设置一个自动播放的参数， 还可以随时修改切换时间 ：  

~~~tabs
tab: 源码
![[幻灯片/幻灯片自动播放.md|raw]]

tab: 效果
![[幻灯片自动播放.gif]]
~~~


## 循环

利用 `loop`  参数可以让一个自动播放的幻灯片， 播放到最后的时候再进行循环 ： 

~~~tabs
tab: 源码
![[幻灯片/幻灯片自动循环播放.md|raw]]

tab: 效果 
![[幻灯片循环自动播放.gif]]
~~~

> [!INFO] 注意
> loop 不是字符串类型



## 乱序

参数 `shuffle` 可以让幻灯片不按编写的顺序播放， 而是乱序播放 ：  

```
---
autoSlide: "3000"
loop: true
shuffle: true
---

第一页
---
第二页
---
第三页
---
第四页
---
第五页
---
第六页

```


## 最小(大)缩放比

`minScale` 和 `maxScale` 控制幻灯片的缩放比例， 假设幻灯片设置的是 1920×1080， 当浏览器窗口没有这么大的时候就进行缩小， 直到 minScale 之后就不再缩小了。 



# 布局

使用 `<split>` 标签进行 `分栏` 布局， 使用 `<grid>` 标签进行 `网格` 布局。 

## 分栏布局

### even 属性

下面代码将图片分 3 栏 ， 通过设置 `even` 属性内容将被均匀分割 ：  

~~~tabs
tab: 源码
![[幻灯片/分栏even属性|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/分栏even属性]],
	page: 0
}
```
~~~


### grap 属性

利用 `grap` 属性可以设置元素之间的距离(这里是3em) ：   

~~~tabs
tab: 源码
![[幻灯片/分栏grap属性|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/分栏grap属性]],
	page: 0
}
```
~~~

还可以让各栏以一定比例来呈现，下面范例最左边 2em、最右边 1em ：  

~~~tabs
tab: 源码
![[幻灯片/分栏grap属性呈比例|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/分栏grap属性呈比例]],
	page: 0
}
```
~~~



# 网格布局

网格布局将整个页面按照网格进行划分， 按百分比来分大小和位置， 或者用文字描述。

## 概念

网格布局的核心概念是 `drag-and-drop拖拽` ， 用于调整幻灯片的 `大小` 和 `位置` ： 

- `drag` 标记大小
- `drop` 标记位置

基本语法像下面这样 ： 

```markdown
单位是百分比
<grid drag="width height" drop="x y">
```

下面是一个非常简单的范例程序，负数表示距右边的距离 ：  

~~~tabs
tab: 源码
![[幻灯片/网格坐标值|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格坐标值]],
	page: 0
}
```

~~~

> [!info] 提示
> 坐标 (-5 10) 的含义是距右侧 5% 

还可以像下面这样，用文字描述位置 ：   

~~~tabs
tab: 源码
![[幻灯片/网格描述|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格描述]],
	page: 0
}
```

~~~


## 流概念

"流" 是用来定义主轴方向 ： 

```markdown
/* 主轴 y 轴，一行、一行显示 */
<grid drag="width height" drop="x y" flow="col">
```

或  

```markdown
/* 主轴 x 轴，一列、一列显示 */
<grid drag="width height" drop="x y" flow="row">
```


## 逐行流

呈现方式，主轴 y ：  
- 一行、一行的显示
- 每个子元素之间间距相同
- 最上和最下留白相同

下面范例可以非常清晰的阐明此概念 ：   

~~~tabs
tab: 源码
![[幻灯片/逐行的流|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/逐行的流]],
	page: 0
}
```

~~~


## 逐列流

呈现方式，主轴 x ： 
- 一列、一列的显示
- 每个子元素之间间距相同
- 最左和最右留白相同

~~~tabs
tab: 源码
![[幻灯片/逐列的流|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/逐列的流]],
	page: 0
}
```
~~~


## 背景色

格子的 `bg` 属性可以设置格子的背景色。下面三个格子，各有不同的背景色 ：  

~~~tabs
tab: 源码
![[幻灯片/格子背景|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/格子背景]],
	page: 0
}
```
~~~

注意 ： Noise 利用元素注释放在了格子里面。 


## 边框

下面三个格子，都加上了不同的边框：  

~~~tabs
tab: 源码
![[幻灯片/网格布局边框|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局边框]],
	page: 0
}
```
~~~

> [!INFO] 语法
> ```markdown
> <grid  drag="width height" drop="x y" border="width style color">
> ```
> - *width* 选项可以是 *thin*、*medium*、*thick* 
> - *style*  选项可采用*dotted*、*solid*、*dashed*、*inset* 或 *outset* 值
> - *color* 选项可采用任何有效的 [CSS 颜色值](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)



## 动画

下面代码为每个格子增加了一个不同的动画 ： 

~~~tabs
tab: 代码
![[幻灯片/网格布局动画|raw]]

tab: 效果

```slide
{
	slide:[[Attachments/幻灯片/网格布局动画]],
	page: 0
}
```

~~~

```
<grid drag="width height" drop="x y" animate="动画名称">
```



## 透明

下面代码说明两点 ：
1. 脚本的顺序，决定了遮盖顺序
2. 如何让一块元素透明

~~~tabs
tab: 源码
![[幻灯片/网格布局透明|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局透明]],
	page: 0
}
```

~~~

> [!INFO] 语法
> ```html
> 0.0 到 1.0 对应 0 到 100%
> opacity="0.5"
> ```



## 过滤器

下面代码展示了如何将一个图片设置成灰色，如何将文字进行几个像素的模糊 ： 

~~~tabs
tab: 源码
![[幻灯片/网格布局过滤器|raw]]

tab: 0
```slide
{
	slide:[[Attachments/幻灯片/网格布局过滤器]],
	page: 0
}
```

tab: 1
```slide
{
	slide:[[Attachments/幻灯片/网格布局过滤器]],
	page: 1
}
```

~~~

下面是各种方法的调用说明 ：   

```markdown
<grid  drag="width height" drop="x y" filter="effect">
```

| 滤镜函数               | 效果说明  | 范例                                      | 范例说明                      |
| :----------------- | :---- | :-------------------------------------- | :------------------------ |
| **`blur()`**       | 模糊效果  | `blur(10px)`                            | 使内容模糊 10 像素。              |
| **`brightness()`** | 亮度效果  | `brightness(200%)`<br>`brightness(0.5)` | 亮度增加到 200%。<br>亮度降低到 50%。 |
| **`contrast()`**   | 对比度效果 | `contrast(150%)`                        | 对比度增加 50%。                |
| **`grayscale()`**  | 灰度效果  | `grayscale(100%)`                       | 将内容变为完全的灰度图像。             |
| **`hue-rotate()`** | 色相旋转  | `hue-rotate(90deg)`                     | 旋转色相 90 度。                |
| **`invert()`**     | 反相效果  | `invert(100%)`                          | 将颜色反相。                    |
| **`opacity()`**    | 不透明度  | `opacity(50%)`                          | 使内容半透明。                   |
| **`saturate()`**   | 饱和度效果 | `saturate(200%)`                        | 饱和度增加到 200%。              |
| **`sepia()`**      | 褐色调效果 | `sepia(100%)`                           | 使内容呈现复古的褐色调。              |


## 旋转

正值顺时针旋转，负值逆时针 ：  

```markdown
/* deg = 10 为顺时针旋转10° */
<grid  drag="width height" drop="x y" rotate="deg">
```

下面代码是两个格子的旋转 ：   

~~~tabs
tab: 源码
![[幻灯片/网格布局旋转|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局旋转]],
	page: 0
}
```
~~~


## 填充

这个代码用于给上、下、左、右， 设置像素宽度的留白 ：  

```markdown
/* 4个参数 */
<grid  drag="width height" drop="x y" pad="top right bottom left">

/* 2个参数 */
<grid  drag="width height" drop="x y" pad="topBottom rightLeft">

/* 1个参数 */
<grid  drag="width height" drop="x y" pad="px">

```

下面代码有两个区域， 都设置了留白， 页面更美观 ：  

~~~tabs
tab: 源码
![[幻灯片/网格布局填充|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局填充]],
	page: 0
}
```
~~~



## 调整内容

下面代码有三列元素，默认主轴为 y 轴。下面代码在主轴上分别有不同的对齐 ：  

~~~tabs
tab: 源码
![[幻灯片/网格布局主轴对齐|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局主轴对齐]],
	page: 0
}
```
~~~


~~~tabs
tab: 源码
![[幻灯片/网格布局主轴对齐2|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局主轴对齐2]],
	page: 0
}
```
~~~

> [!INFO] 下面是可选的对齐方式
> - start
> - center
> - space-between
> - space-around
> - space-evenly (default)
> - end


## 对齐

下面代码有三个格子， 采用不同的对齐方式。其中 `justify` 是两端对齐 ：   

~~~tabs
tab: 源码
![[幻灯片/网格布局垂直对齐|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局垂直对齐]],
	page: 0
}
```
~~~

下面格子里的内容是拉伸对齐的 ：   

~~~tabs
tab: 源码
![[幻灯片/网格布局拉伸对齐|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/网格布局拉伸对齐]],
	page: 0
}
```

~~~


> [!INFO] 可选的对齐方式
> - left
> - right
> - center (默认)
> - justify / block
> - top
> - bottom
> - topleft
> - topright
> - bottomleft
> - bottomright
> - stretch

下面图展示了各种对齐方式，第 0 页说明照片被如何缩放(没有一个加了文字不超出范围或者间距过大的)，其他页展示了如何对齐，最后一页是范例代码，可以很好的控制显示 ：  

~~~tabs
tab: 源码
![[乔布斯照片展示.md|raw]]

tab: 0
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 0
}
```

tab: 1
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 1
}
```

tab: 2
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 2
}
```

tab: 3
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 3
}
```

tab: 4
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 4
}
```

tab: 5
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 5
}
```

tab: 6
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 6
}
```

tab: 7
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 7
}
```

tab: 8
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 8
}
```

tab: 9
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 9
}
```

tab: 10
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 10
}
```

tab: 11
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 11
}
```

tab: 12
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 12
}
```

tab: 13
```slide
{
	slide:[[Attachments/幻灯片/乔布斯照片展示]],
	page: 13
}
```

~~~


## 片段控制

定义为了 `片段frag` 的格子不会立刻出现，需要点击等到你要看到它的时候 ：   

~~~tabs
tab: 源码
![[幻灯片/网络布局片段控制.md|raw]]

tab: 效果
![[网络布局片段控制.gif]]

~~~

> [!INFO] 提示
> 相同的段落编号会同时播放
> `data-fragment-index="1"`  和 `frag="1"` 会同时播放



# 插件

Advanced Slides 中有很多插件可以使用 ：`菜单Menu`、`概述Overview`、`黑板Chalkboard`、`用时Elapsed Time Bar`、`激光笔Laser Pointer`、`幻灯片编号Slide Numbers` 。这些插件需要在设置中启用 ：   

~~~tabs
tab: 幻灯片插件启用方法
![[Advanced Slides 启用插件.svg]]

tab: 插件描述
![[幻灯片插件详细介绍.svg]]

~~~



## 页面切换按钮

可以通过鼠标点击来切换幻灯片 ： 

![[幻灯片页面切换按钮.svg]]


## 菜单

可以通过点击菜单， 看到所有的幻灯片， 点击一下切换过去， 避免幻灯片太多 ： 

![[幻灯片菜单示意图.svg]]


## 进度条

幻灯片进度条可以指示已经播放了多少页幻灯片， 还剩多少 ： 

![[幻灯片进度条.svg]]


## 幻灯片页码

在右下角指示幻灯片的页码 ： 

![[幻灯片页码.svg]]


## 总览

利用总览可以很容易知道所有的页面和当前页面 ：  

![[幻灯片插件总览.svg]]



## 黑板

可以在幻灯片上标注的叫黑板 ：一种是在幻灯片上绘画，另一种是翻到幻灯片后面绘画 ：   

![[幻灯片黑板.svg]]
反面黑板还可以反回来， 但是文字还在，右击是橡皮 ：   

![[幻灯片黑板反面.svg]]



## 倒计时

下面是幻灯片倒计时，属性 `timeForPresentation` 是时间，最下方的红条 ：  

~~~tabs
tab: 源码
![[幻灯片/演讲倒计时|raw]]

tab: 效果
![[演讲倒计时.svg]]

~~~



## 激光笔

激光笔可以在给用户展示方案的时候， 用鼠标引起用户注意 ： 

![[幻灯片荧光笔.svg]]

> [!INFO] 提示
> 需要按 `Q` 才开启激光笔



# 模板

下面两个文档 `tpl-footer.md` 用来做模板 `use-tpl-footer.md` 用来产生幻灯片 ：   

~~~tabs
tab: tpl-footer.md
![[幻灯片/tpl-footer|raw]]

tab: use-tpl-footer.md
![[幻灯片/use-tpl-footer|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/use-tpl-footer.md]],
	page: 0
}
```

~~~

在 `tpl-footer.md` 创建了两个块 `content` 和 `footer` ， 如果要把内容放在 `footer` 块中， 幻灯片 `use-tpl-footer.md` 像下面 ：   

```
::: footer
会被放在footer块中
:::
```

> [!INFO] 注意
> 注意 yaml 参数模板里面设置无效



## 可选变量

如果你设置了一个模板，又不录入内容， 幻灯片里面会进行提示 ： 

![[幻灯片模板没有设置必要的内容.svg]]

这时候可以将模板里面的某个元素设置为可选 ：    

~~~tabs
tab: tpl-footer-optional.md
![[幻灯片/tpl-footer-optional|raw]]


tab: use-tpl-footer-optional.md
![[幻灯片/use-tpl-footer-optional|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/use-tpl-footer-optional.md]],
	page: 0
}
```

~~~

> [!INFO] 提示
> 注意关键的语法是一个问号 <%? footer %>



## 复杂模板

模板打开里面有 7 个部分 ：    

~~~tabs
tab: tpl-con-2-1-box.md
![[幻灯片/tpl-con-2-1-box|raw]]

tab: use-tpl-con-2-1-box.md
![[幻灯片/use-tpl-con-2-1-box|raw]]

tab: 效果

```slide
{
	slide:[[Attachments/幻灯片/use-tpl-con-2-1-box.md]],
	page: 0
}
```

~~~

> [!INFO] 注意
> 在 `use-tpl-con-2-1-box.md` 中， 利用元素修饰改变了上方对齐


## 二级标题模板

下面用渐变色设计了几个二级标题模板 ：    

~~~tabs
tab: 源码
![[二级标题模板.md|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/二级标题模板.md]],
	page: 0
}
```

~~~



# 自动动画

下面是一段自动动画 `data-id` 相同的被识别为同一个元素，切换到第二页的时候，自动添加过度动画 ：   

~~~tabs
tab: 源码
![[幻灯片/自动动画id相同|raw]]

tab: 效果
![[自动动画id相同.gif]]
~~~


> [!INFO] 提示
> 更多动画可以参考 ： https://revealjs.com/auto-animate/
> 


## 文本移动

自动动画还可用于在幻灯片中添加、删除或重新排列内容时自动将元素移动到新位置 ：

~~~tabs
tab: 源码
![[幻灯片/自动动画文本移动|raw]]

tab: 效果
![[自动动画文本移动.gif]]

~~~



## 代码展示

下面文本展示了如何将代码动态展示出来 ：  

~~~tabs
tab: 源码
![[幻灯片/自动动画代码展示.md|raw]]

tab: 效果
![[自动动画代码展示.gif]]

~~~



## 列表动画

下面文本展示了如何将列表动态展开：

~~~tabs
tab: 代码
![[幻灯片/自动动画展示自动列表.md|raw]]

tab: 效果
![[自动动画展示自动列表.gif]]

~~~



## 图片切换

下面代码展示了如何做一个相册对图片进行切换 ：  

~~~tabs
tab: 源码
![[幻灯片/自动动画展示图片切换.md|raw]]

tab: 效果
![[自动动画展示图片切换.gif]]

~~~


## 文字变亮

下面展示如何让一段文字高亮， 其他文字暗色 ： 

~~~tabs
tab: 源码
![[幻灯片/高亮文字动画.md|raw]]

tab: 效果
![[高亮文字动画.gif]]
~~~



## 文字下划线

下面代码展示了如何给一段文字增加下划线强调， 并且以动画进行展示 ：   

~~~tabs
tab: 源码
![[幻灯片/文字下划线动画.md|raw]]

tab: 效果
![[文字下划线动画.gif]]

~~~



## 框文字

下面展示了如何给文字加框， 来着重显示几个文字 ： 

~~~tabs
tab: 源码
![[幻灯片/文字框动画.md|raw]]

tab: 效果
![[文字框动画.gif]]

~~~



## 部分变更

下面展示如何变更部分数学公式 ，而其他部分不改变， 没有幻灯片切换的感觉 ，而是通过动画 ：   

~~~tabs
tab: 源码
![[幻灯片/部分变更动画.md|raw]]

tab: 效果
![[部分变更动画.gif]]
~~~




# 排版

排版需要综合利用到前面所有的工具

## 图片排版

一个 svg 图片可以不变形的在某个区域进行拉伸 ： 

~~~tabs
tab: 源码
![[拉伸填充.md|raw]]

tab: 效果
![[拉伸填充动画.gif]]

~~~

下面是一个原本 960×540  的图片， 将它填充到一个 1920×1080 的幕布 。 它们两个比例一致， 所以看起来特别舒服 ：   

~~~tabs
tab: 源码
![[填充满幕布.md|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/填充满幕布]],
	page: 1
}
```
~~~



## 文字排版

下面范例展示了如何让文字适应容器的大小，绿色的文字溢出了容器，黄色代码进行里弥补。使用 `r-fit-text` 来适配可以使文字在一定范围内自适应容器宽度 ： 

~~~tabs:
tab: 源码
![[文字自适应.md|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/文字自适应]],
	page: 0
}
```

~~~

不过使用  `r-fit-text`  也存在一些问题，它只照顾宽度不关心高度 ：  

~~~tabs
tab: 源码
![[r-fit-text存在的问题.md|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/r-fit-text存在的问题]],
	page: 0
}
```

~~~

如果需要指定文字大小， 可以指定像素数 ： 

~~~tabs
tab: 源码
![[指定文字像素数.md|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/指定文字像素数]],
	page: 0
}
```

~~~




## 图文混排

下面在 787×324 像素中嵌入一副 960×540 大小的的svg图片，能明显发现区域的宽度比图片宽很多，有很多留白， 因此在右侧配一些文字比较合理 ： 

~~~tabs
tab: 源码
![[图文混排.md|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/图文混排]],
	page: 0
}
```

~~~

下面将 960×540 大小的的svg图片无损的嵌入到页面， 并配上标题。标题和内容的文字都是 24px 大小一致 ： 

~~~tabs
tab: 源码
![[图片嵌入并配标题|raw]]

tab: 效果
```slide
{
	slide:[[Attachments/幻灯片/图片嵌入并配标题]],
	page: 0
}
```

~~~



## 分列

下面是展示了分列， 还有内容在列中的一些调整，排列图片还是存在问题 ：   

~~~tabs
tab: 源码
![[分列排列幻灯片|raw]]

tab: 0
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 0
}
```

tab: 1
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 1
}
```

tab: 2
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 2
}
```

tab: 3
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 3
}
```

tab: 4
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 4
}
```

tab: 5
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 5
}
```

tab: 6
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 6
}
```

tab: 7
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 7
}
```

tab: 8
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 8
}
```

tab: 9
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 9
}
```

tab: 10
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 10
}
```

tab: 11
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 11
}
```

tab: 12
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 12
}
```

tab: 13
```slide
{
	slide:[[Attachments/幻灯片/分列排列幻灯片]],
	page: 13
}
```
~~~



