<%@page language="java" pageEncoding="UTF-8" import="java.util.*,${frame}.web.MyRequest,${frame}.core.page.*,
${namespace}.MyFactory"%><%
MyRequest req = new MyRequest(request);
Map map = req.getParameterValueMap(false, false);
Page pageModel = MyFactory.get${model}Service().queryPage(req.getInt("page"), req.getInt("pageSize", 10), map);
request.setAttribute("pageModel", pageModel);
request.setAttribute("pageNav", (new PageNav(request, pageModel)));
request.setAttribute("param", map);
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
<%@include file="/commons/include/web.jsp"%>
<script type="text/javascript">
$(function(){
	$${frame}.page.menu("del.jsp", "upd1.jsp", "getById.jsp", "${'$'}{pageModel.page}");
});
$${frame}.doAjax = true;
$${frame}.callback = function(){if($${frame}.result.code == 1){
	location.href = "list.jsp?page=${'$'}{pageModel.page}";
}};
</script>
</head>
<body>
<table class="listLogo">
	<tr>
		<td class="title">${table.comment}列表</td>
		<td class="menuTool">
			<a class="insert" href="add1.jsp?page=${'$'}{pageModel.page}">添加</a>
			<a class="delete" id="listFormDelAll" href="#">删除所选</a>
		</td>
	</tr>
</table>
<div class="line"></div>
<form id="queryForm" method="post" action="list.jsp">
<table class="queryTable">
	<tr>
		<td class="input">
<#list table.columnNokey as c>
			&nbsp;${c.comment}：<input type="text" class="text" name="${c.nameLowerCamel}" value="${'$'}{fn:escapeXml(param.${c.nameLowerCamel})}" />
</#list>
		</td>
		<td class="query"><input id="_querySubmit_" type="button" class="button" value="查询" /></td>
	</tr>
</table>
</form>
<div class="line"></div>
<form id="listForm" method="post" action="del.jsp">
<table id="dataTable" class="listTable">
	<tr class="list_title">
		<td style="width:2%"><input id="chkall" type="checkbox" /></td>
		<td style="width:5%">操作</td>
<#list table.columnNokey as c>
		<td>${c.comment}</td>
</#list>
	</tr>
<c:forEach items="${'$'}{pageModel.result}" var="d">
	<tr>
		<td><input name="keyIndex" type="checkbox" value="${'$'}{d.id}" /></td>
		<td class="menuTool" keyIndex="${'$'}{d.id}">&nbsp;</td>
<#list table.columnNokey as c>
		<td>${'$'}{fn:escapeXml(d.${c.nameLowerCamel})}</td>
</#list>
	</tr>
</c:forEach>
</table>
<input name="page" type="hidden" value="${'$'}{pageModel.page}" />
</form>
<table class="bottomTable">
	<tr><td>${'$'}{pageNav.page}</td></tr>
</table>
</body>
</html>
