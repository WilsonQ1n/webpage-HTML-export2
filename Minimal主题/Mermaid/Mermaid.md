---
tags:
  - Minimal主题
---

# 资料

Mermaid 官方网站介绍它是一个图形和表格的工具：  

```tx
|说明|链接|
|:--:|--|
|官网|https://mermaid.js.org/|
|看板|https://mermaid.js.org/syntax/kanban.html|
|饼图|https://mermaid.js.org/syntax/pie.html|
```


# 与draw.io 配合

很多 Mermaid 的功能， 不是 Obsidian 中都实现了， 这时候可以安装  [draw.io](https://app.diagrams.net/) 。 在 draw.io 中插入 mermaid ：   
![[draw.io中插入marmaid.svg]]
在之后的对话框中，插入 mermaid 代码 ： 
![[输入mermaid代码.svg]]
将 draw.io 文件保存成 `.svg` 格式， 就可以在 obsidian 中引用了 ：   
![[draw.io文件保存成svg格式.svg]]
下图就是一个 draw.io 绘制的 mermaid 旅程图 ： 
![[draw.io绘制的旅程图.svg]]

# [看板](https://mermaid.js.org/syntax/kanban.html)

Mermaid 的看板图以 kanban 关键字开头， 以及列和列中间的内容 ：

````markdown
```mermaid
kanban
	column1[Column Title] 
		task1[Task Description]
```		
````

>[!INFO] 代码运行效果
> ```mermaid
> kanban
> 	column1[Column Title]
> 		task1[Task Description]
> ```


## `列`和`任务`

下面展示了如何添加列，并在列下面添加了任务 ： 

````markdown
```mermaid
kanban
	c1[水果] 
		t1[西瓜]
		t2[榴莲]
	c2[家禽] 
		t3[鸡]
		t4[鱼]
		t5[牛]
	c3[列] 
		t6[任务6]
		t7[任务7]	
```		
````

```mermaid
kanban
	c1[水果] 
		t1[西瓜]
		t2[榴莲]
	c2[家禽] 
		t3[鸡]
		t4[鱼]
		t5[牛]
	c3[列] 
		t6[任务6]
		t7[任务7]	
```

下面是标准语法 ：  

> [!INFO] 任务语法
> columnId[列标题]
> `Tab` taskId[任务描述]


## 元数据

使用 `@{...}` 语法为**任务**添加额外的元数据 ：  

```mermaid
kanban
group1[后端]
  task1[更新数据库]@{ ticket: MC-2037, assigned: '李明', priority: 'High' }

group2[前端]
  task2[更新页面]@{ ticket: MC-2017, assigned: '莉莉', priority: 'Low' }

```
代码：

````markdown
```mermaid
kanban
group1[后端]
  task1[更新数据库]@{ ticket: MC-2037, assigned: '李明', priority: 'High' }

group2[前端]
  task2[更新页面]@{ ticket: MC-2017, assigned: '莉莉', priority: 'Low' }

```
````


## 完整示例

下面提供一个完整实例的看板，看起来非常紧凑 ：   

```mermaid
---
config:
  kanban:
    ticketBaseUrl: 'https://mermaidchart.atlassian.net/browse/#TICKET#'
---
kanban
小组1
	[任务1]
	docs[任务2]
[小组2]
	id6[任务3]
id9[小组3]
	id8[任务4]@{ assigned: '小李' }
id10[小组4]
	id4[任务5:高优先级]@{ ticket: MC-2038, assigned: '小丽', priority: 'High' }
	id66[任务6:非常低优先级]@{ priority: 'Very Low', assigned: '小张' }
id11[小组5]
	id5[任务7]
	id2[任务8：非常高优先级]@{ ticket: MC-2036, priority: 'Very High'}
	id3[任务9：高优先级]@{ ticket: MC-2037, assigned: knsv, priority: 'High' }
id13[小组6]
	id131[任务10]
	id132[任务11]
	
id14[小组7]
	id141[任务12]
	id142[任务13]
id15[小组8]
	id151[任务14]
	id152[任务15]	
```

下面是代码 ，可以在[[Mermaid看板展示.canvas|白板中]]展示，更加美观 ： 

````markdown
```mermaid
---
config:
  kanban:
    ticketBaseUrl: 'https://mermaidchart.atlassian.net/browse/#TICKET#'
---
kanban
小组1
	[任务1]
	docs[任务2]
[小组2]
	id6[任务3]
id9[小组3]
	id8[任务4]@{ assigned: '小李' }
id10[小组4]
	id4[任务5:高优先级]@{ ticket: MC-2038, assigned: '小丽', priority: 'High' }
	id66[任务6:非常低优先级]@{ priority: 'Very Low', assigned: '小张' }
id11[小组5]
	id5[任务7]
	id2[任务8：非常高优先级]@{ ticket: MC-2036, priority: 'Very High'}
	id3[任务9：高优先级]@{ ticket: MC-2037, assigned: knsv, priority: 'High' }
id13[小组6]
	id131[任务10]
	id132[任务11]
	
id14[小组7]
	id141[任务12]
	id142[任务13]
id15[小组8]
	id151[任务14]
	id152[任务15]	
```
````


# [饼图](https://mermaid.js.org/syntax/pie.html)

下面是一个饼图最简单的范例 ： 

```mermaid
pie showData
title 宠物占比
"狗" : 386
"猫" : 85
"老鼠" : 15
```
下面是源码 ： 

````markdown
```mermaid
pie showData
title 宠物占比
"狗" : 386
"猫" : 85
"老鼠" : 15
```
````

语法说明：
- 以关键字 `pie` 开始
- `showData` 之后开始渲染，这个关键字是可选的
-  `title` 是饼图的标题

下面范例加粗了一些饼图的边框，百分比在饼图 0.8 的位置 ： 

```mermaid
---
config:
  pie:
    textPosition: 0.8
  themeVariables:
    pieOuterStrokeWidth: "10px"
---
pie showData
    title 产品A的关键材料占比
    "Calcium" : 42.96
    "Potassium" : 50.05
    "Magnesium" : 10.01
    "Iron" :  5
```

下面是源码：

````markdown
```mermaid
---
config:
  pie:
    textPosition: 0.8
  themeVariables:
    pieOuterStrokeWidth: "10px"
---
pie showData
    title 产品A的关键材料占比
    "Calcium" : 42.96
    "Potassium" : 50.05
    "Magnesium" : 10.01
    "Iron" :  5
```
````



# [旅程图](https://mermaid.js.org/syntax/userJourney.html)

下面是一个用户旅程图的简单范例 ： 

![[draw.io绘制的旅程图.svg]]

在 obsidian 中直接编辑旅程图，存在渲染问题。可以使用 [[Mermaid#与draw.io 配合|draw.io]] ：  

````markdown
```mermaid
journey
    title 产品出口
    section 商务
      产品沟通: 2: 研发
      货运方式谈判: 2: 研发
      发货: 3: 研发, 销售
    section 售后
      国外售后: 1: 服务部
      国内售后: 5: 服务部
```
````


# [象限图](https://mermaid.nodejs.cn/syntax/quadrantChart.html)

下面是一个象限图的范例，通常用来做 SWOT 分析 ：

```mermaid
quadrantChart
  title SWOT强弱危机分析
  x-axis Strengths --> Weaknesses
  y-axis Opportunities --> Threats
  quadrant-1 WEAKNESSES
  quadrant-2 STRENGTHS
  quadrant-3 OPPORTUNITIES
  quadrant-4 THREATS
  Campaign A: [0.9, 0.0] radius: 12
  Campaign B:::class1: [0.8, 0.1] color: #ff3300, radius: 10
  Campaign C: [0.7, 0.2] radius: 25, color: #00ff33, stroke-color: #10f0f0
  Campaign D: [0.6, 0.3] radius: 15, stroke-color: #00ff0f, stroke-width: 5px ,color: #ff33f0
  Campaign E:::class2: [0.5, 0.4]
  Campaign F:::class3: [0.4, 0.5] color: #0000ff
  classDef class1 color: #109060
  classDef class2 color: #908342, radius : 10, stroke-color: #310085, stroke-width: 10px
  classDef class3 color: #f00fff, radius : 10
```

````markdown
```mermaid
quadrantChart
  title SWOT强弱危机分析
  x-axis Strengths --> Weaknesses
  y-axis Opportunities --> Threats
  quadrant-1 WEAKNESSES
  quadrant-2 STRENGTHS
  quadrant-3 OPPORTUNITIES
  quadrant-4 THREATS
  Campaign A: [0.9, 0.0] radius: 12
  Campaign B:::class1: [0.8, 0.1] color: #ff3300, radius: 10
  Campaign C: [0.7, 0.2] radius: 25, color: #00ff33, stroke-color: #10f0f0
  Campaign D: [0.6, 0.3] radius: 15, stroke-color: #00ff0f, stroke-width: 5px ,color: #ff33f0
  Campaign E:::class2: [0.5, 0.4]
  Campaign F:::class3: [0.4, 0.5] color: #0000ff
  classDef class1 color: #109060
  classDef class2 color: #908342, radius : 10, stroke-color: #310085, stroke-width: 10px
  classDef class3 color: #f00fff, radius : 10
```
````

> [!TIP] 提示
> **象限图**里面不能有中文

上面源码中有一个关键词 `classDef` 用来定义类，一个类可以是同一个颜色，圈大小。


## 设置

还可以对这个象限图进行一些设置 ： 

```mermaid
---
config:
  quadrantChart:
    chartWidth: 600
    chartHeight: 400
    titleFontSize: 30
---
quadrantChart
  title 设置
  x-axis Urgent --> Not Urgent
  y-axis Not Important --> "Important ❤"
  quadrant-1 Plan
  quadrant-2 Do
  quadrant-3 Delegate
  quadrant-4 Delete
  Campaign A: [0.7, 0.7] radius: 12
```

````markdown
```mermaid
---
config:
  quadrantChart:
    chartWidth: 600
    chartHeight: 400
    titleFontSize: 30
---
quadrantChart
  title 设置
  x-axis Urgent --> Not Urgent
  y-axis Not Important --> "Important ❤"
  quadrant-1 Plan
  quadrant-2 Do
  quadrant-3 Delegate
  quadrant-4 Delete
  Campaign A: [0.7, 0.7] radius: 12
```
````

下面是可用的配置表 ：

| 参数                                | 描述                              | 默认值    |
| --------------------------------- | ------------------------------- | ------ |
| chartWidth                        | 图表的宽度                           | 500    |
| chartHeight                       | 图表的高度                           | 500    |
| titlePadding                      | 标题的顶部和底部填充                      | 10     |
| titleFontSize                     | 标题字体大小                          | 20     |
| quadrantPadding                   | 所有象限外的填充                        | 5      |
| quadrantTextTopPadding            | 当文本绘制在顶部时象限文本顶部填充（那里没有数据点）      | 5      |
| quadrantLabelFontSize             | 象限文本字体大小                        | 16     |
| quadrantInternalBorderStrokeWidth | 象限内的边框描边宽度                      | 1      |
| quadrantExternalBorderStrokeWidth | 象限外边框描边宽度                       | 2      |
| xAxisLabelPadding                 | x 轴文本的顶部和底部填充                   | 5      |
| xAxisLabelFontSize                | X 轴文本字体大小                       | 16     |
| xAxisPosition                     | x 轴的位置（顶部、底部）如果有点，则 x 轴将始终渲染在底部 | 'top'  |
| yAxisLabelPadding                 | y 轴文本的左右填充                      | 5      |
| yAxisLabelFontSize                | Y 轴文本字体大小                       | 16     |
| yAxisPosition                     | y 轴位置（左、右）                      | 'left' |
| pointTextPadding                  | 点和下面文本之间的填充                     | 5      |
| pointLabelFontSize                | 点文本字体大小                         | 12     |
| pointRadius                       | 要绘制的点的半径                        | 5      |


