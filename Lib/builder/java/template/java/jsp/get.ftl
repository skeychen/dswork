<%@page language="java" pageEncoding="UTF-8" import="java.util.*,${frame}.web.MyRequest,
${namespace}.MyFactory"%><%
MyRequest req = new MyRequest(request);
Long id = req.getLong("keyIndex");
request.setAttribute("po", MyFactory.get${model}Service().get(id));
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
<%@include file="/commons/include/web.jsp"%>
</head>
<body>
<table class="listLogo">
	<tr>
		<td class="title">明细</td>
		<td class="menuTool">
			<a class="back" onclick="window.history.back();return false;" href="#">返回</a>
		</td>
	</tr>
</table>
<div class="line"></div>
<table class="listTable">
<#list table.columnNokey as c>
	<#if c.length<=4000>
	<tr>
		<td class="form_title">${c.comment}</td>
		<td class="form_input">${'$'}{fn:escapeXml(po.${c.nameLowerCamel})}</td>
	</tr>
	<#else>
	<tr>
		<td class="form_title">${c.comment}</td>
		<td class="form_input"><textarea class="readonlytext" style="width:400px;height:60px;">${'$'}{fn:escapeXml(po.${c.nameLowerCamel})}</textarea></td>
	</tr>
	</#if>
</#list>
</table>
</body>
</html>