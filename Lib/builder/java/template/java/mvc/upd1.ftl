<%@page language="java" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
<%@include file="/commons/include/web.jsp"%>
<script type="text/javascript">
$${frame}.callback = function(){if($${frame}.result.code == 1){
	location.href = "list.htm?page=${'$'}{page}";
}};
</script>
</head>
<body>
<table class="listLogo">
	<tr>
		<td class="title">修改</td>
		<td class="menuTool">
			<a class="save" id="dataFormSave" href="#">保存</a>
			<a class="back" href="list.htm?page=${'$'}{page}">返回</a>
		</td>
	</tr>
</table>
<div class="line"></div>
<form id="dataForm" method="post" action="upd2.htm">
<table class="listTable">
<#list table.columnNokey as c>
	<#if c.length<=4000>
	<tr>
		<td class="form_title">${c.comment}</td>
		<td class="form_input"><input type="text" name="${c.nameLowerCamel}" maxlength="${c.length}" value="${'$'}{fn:escapeXml(po.${c.nameLowerCamel})}" /></td>
	</tr>
	<#else>
	<tr>
		<td class="form_title">${c.comment}</td>
		<td class="form_input"><textarea name="${c.nameLowerCamel}" style="width:400px;height:60px;">${'$'}{fn:escapeXml(po.${c.nameLowerCamel})}</textarea></td>
	</tr>
	</#if>
</#list>
</table>
<#list table.columnKey as c>
<input type="hidden" name="${c.nameLowerCamel}" value="${'$'}{po.${c.nameLowerCamel}}" />
</#list>
</form>
</body>
</html>
