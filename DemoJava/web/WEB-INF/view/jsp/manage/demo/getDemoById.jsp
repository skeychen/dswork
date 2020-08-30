<%@page language="java" pageEncoding="UTF-8"%>
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
	<tr>
		<td class="form_title">标题</td>
		<td class="form_input">${fn:escapeXml(po.title)}</td>
	</tr>
	<tr>
		<td class="form_title">内容</td>
		<td class="form_input">${fn:escapeXml(po.content)}</td>
	</tr>
	<tr>
		<td class="form_title">创建时间</td>
		<td class="form_input">${fn:escapeXml(po.foundtime)}</td>
	</tr>
</table>
</body>
</html>