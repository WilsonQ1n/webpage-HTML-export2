# markwhen

这是一个 Obsidian 的第三方插件， 他的官网是 ： 
https://markwhen.com/

在 Obsidian 中， 下面范例就可以生成一个甘特图：

```markdown
section Markwhen 8-21-2025 13.08.16.mw
	  group 软件开发 #Project1A
	    // Supports ISO8601
	    2025-01/2025-03: 主函数框架 @开发 #John
	    2025-03/2025-06: 子函数 #Michelle
		子函数跟多信息：
	      - [x] 显示函数
	      - [x] 控制函数
	      - [] 帮助函数
	      - [] 辅助函数
	    2025-07: 测试
	endGroup

	group 硬件开发 #Project2
		2025-04/4 months: 原理图 #John
	    contact: imeal@example.com
	  // Supports American date formats
	  03/2025 - 1 year: 元件选择和测试 @开发 #Michelle
	    assignees: [Michelle, Johnathan]
	    location: "123 Main Street, Kansas City, MO"
	    - [x] 无源元件
	    - [x] 电源系统
	    - [ ] 晶振
	    - [ ] 核心板
	    - [ ] 连接件
		2025-07-24: 硬件测试完成 #John
		2025-10-01: 组装完成
		2025-08-21: 软件测试完成
	endGroup
endSection
```

> [!INFO]
> 安装 Markwhen 只需要在第三方市场搜索 **Markdown**



注意，使用 `Tab` 进行缩进非常重要。 这样有缩进线可以进行折叠：
![[Pasted image 20250823063716.png]]


# 新建工程
如果想新建一个 Markwhen， 只需要在侧边栏点击下面图标 ：
![[Pasted image 20250827145808.png]]

> [!下面是一个新建好的Markwhen]
> [[Markwhen 8-27-2025 16.00.08.mw|Markwhen范例工程]]


# section节
一个贯穿的图就是一个节：
![[Pasted image 20250822232703.png]]



# group组

一个group组是在节section下面的一块数据，语法像下面这样：

```markdown
section 网关开发
	  group 软件开发 #Project1A
	    // Supports ISO8601
	    2025-01/2025-03: 主函数框架 @开发 #John
	    2025-03/2025-06: 子函数 #Michelle
		子函数跟多信息：
	      - [x] 显示函数
	      - [x] 控制函数
	      - [] 帮助函数
	      - [] 辅助函数
	    2025-07: 测试
	endGroup
endSection
```

![[Pasted image 20250823064953.png]]

可以给组插入时间段：

```markdown
section 网关开发
	  group 软件开发 #Project1A
	    2025-01/2025-03: 主函数框架 @开发 #John
	endGroup
endSection
```

还可以像下面这样， 插入4个月的进度：  

```markdown
section 网关开发
	  group 软件开发 #Project1A
	    2025-04/4 months: 原理图
	endGroup
endSection
```



# 颜色控制

两个时间段如果是一个后缀， 会被设置成同一个颜色：

![[Pasted image 20250823070719.png]]
下面是颜色控制的代码：

```markdown
section Markwhen 8-21-2025 13.08.16.mw
	  group 软件开发 #Project1A
	    // Supports ISO8601
	    2025-01/2025-03: 主函数框架 @开发 #John
	endGroup

	group 硬件开发 #Project2
		2025-04/4 months: 原理图 #John
	endGroup
endSection
```



# 进度条
完成百分比就是进度条 ：
![[Pasted image 20250823070939.png]]
下面是进度条的实现， 每个 x 就是完成一个子任务 ：
![[Pasted image 20250823071302.png]]



# 垂直分割

可以利用垂直分割窗口， 编辑和观察起来更舒服：

![[Pasted image 20250823223145.png]]

分割是在窗体上进行的：

![[Pasted image 20250823224026.png]]


