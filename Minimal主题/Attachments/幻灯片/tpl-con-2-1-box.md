<grid drag="100 10" drop="top" bg="white" align="left" pad="0 20px">  <!--  1：最上方白色背景 "标题栏" -->
 <% title %>
</grid>

<grid drag="28 75" drop="69 15" bg="white" style="border-radius:15px"/>  <!--  2：右侧方白色背景圆角框 -->

<grid drag="64 75" drop="3 15" pad="0px 0px" bg="red" align="topleft"   justify-content="start" >  <!--  3：左侧主题文字部分 -->
<% left %>
</grid>


<grid drag="28 75" drop="69 15" align="topleft"  justify-content="start">  <!--  4：右侧文字部分 -->
<% right %> 
</grid>


<% content %>

<style>
.horizontal_dotted_line{
  border-bottom: 2px dotted gray;
}  
</style>

<grid drag="94 0" drop="3 -6" class="horizontal_dotted_line"> <!--  5：水平分割线 -->
</grid>

<grid drag="94 30" drop="3 64" align="bottomleft" > <!--  6：文件来源说明 -->
<%? source %>
</grid>

<grid drag="100 6" drop="bottom">  <!--  7：版权 -->
###### © 2022 Advanced Slides<!-- element style="font-weight:300" -->
</grid>
