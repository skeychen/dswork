package dswork.config;

import java.io.File;
import java.io.FileFilter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import dswork.core.util.EnvironmentUtil;

public class WebInitializer implements dswork.web.MyWebInitializer
{
	@Override
	public void onStartup(ServletContext context) throws ServletException
	{
		String spath = ",classpath*:/dswork/config/spring";
		
		String active = EnvironmentUtil.getToString("dswork.active", "");
		String log4j2 = "/WEB-INF/classes/config/log4j2.xml";
		String dswork = "classpath*:/config/config.properties";
		String dsworkSSO = "/config/sso.properties";
		
		String spring = ",classpath*:/config/spring-*.xml";
		String springmvc = ",classpath*:/config/springmvc-*.xml";
		
		if(active.length() > 0)
		{
			String pathWeb = context.getRealPath("/");
			String pathDev = "/WEB-INF/classes/config/" + active + "/";
			File devfiles = new File(pathWeb + pathDev);
			if(devfiles.isDirectory())
			{
				String pathUse = "/WEB-INF/classes/config/";
				File usefiles = new File(pathWeb + pathUse);
				File[] files;
				StringBuilder v = new StringBuilder(256);
				java.util.Map<String, String> map = new java.util.HashMap<String, String>();
				
				files = devfiles.listFiles(new FileFilter(){public boolean accept(File f){if(f.isFile() && f.getName().startsWith("spring-")){return true;}return false;}});
				for(File f : files){map.put(f.getName(), "1");v.append(",").append(pathDev).append(f.getName());}
				files = usefiles.listFiles(new FileFilter(){public boolean accept(File f){if(f.isFile() && f.getName().startsWith("spring-")){return true;}return false;}});
				for(File f : files){if(map.get(f.getName()) == null){v.append(",").append(pathUse).append(f.getName());}}
				if(v.length() > 0) {spring = v.toString();}
				map.clear();
				v.setLength(0);

				files = devfiles.listFiles(new FileFilter(){public boolean accept(File f){if(f.isFile() && f.getName().startsWith("springmvc-")){return true;}return false;}});
				for(File f : files){map.put(f.getName(), "1");v.append(",").append(pathDev).append(f.getName());}
				files = usefiles.listFiles(new FileFilter(){public boolean accept(File f){if(f.isFile() && f.getName().startsWith("springmvc-")){return true;}return false;}});
				for(File f : files){if(map.get(f.getName()) == null){v.append(",").append(pathUse).append(f.getName());}}
				if(v.length() > 0) {springmvc = v.toString();}
				map.clear();
				v.setLength(0);
				
				if((new File(pathWeb + "/WEB-INF/classes/config/" + active + "/config.properties")).isFile())
				{
					dswork = "classpath*:/config/" + active + "/config.properties";
					EnvironmentUtil.setSystemProperties("/config/" + active + "/config.properties");
				}
				
				String log4jFile = (new File(pathWeb + "/WEB-INF/classes/config/" + active + "/log4j2.xml")).isFile() ? "/" + active : "";
				log4j2 = "/WEB-INF/classes/config" + log4jFile + "/log4j2.xml";
				
				String ssoFile = (new File(pathWeb + "/WEB-INF/classes/config/" + active + "/sso.properties")).isFile() ? "/" + active : "";
				dsworkSSO = "/config" + ssoFile + "/sso.properties";
				
				System.out.println("dsworkConfiguration=" + dswork);
				System.out.println("dsworkSSOConfiguration=" + dsworkSSO);
				System.out.println("contextConfigLocation=" + spring);
			}
		}

		String jdbcDialect = EnvironmentUtil.getToString("jdbc.dialect.name", "");
		if(jdbcDialect.length() > 0)
		{
			context.setInitParameter("jdbc.dialect.name", jdbcDialect);
		}
		context.setInitParameter("dsworkConfiguration", dswork);
		context.setInitParameter("dsworkSSOConfiguration", dsworkSSO);
		context.setInitParameter("log4jConfiguration", log4j2);
		String dsworkDataSource = EnvironmentUtil.getToString("dswork.datasource", "");
		if(dsworkDataSource.length() > 0)
		{
			context.setInitParameter("dswork.datasource", dsworkDataSource);
		}
		if(c("jdbc.url"))
		{
			spring = spath + "/spring-mybatis" + (c("jdbc.read.url")?"-rw.xml":".xml")
					+ (chk("jdbc.transaction") ? spath + "/spring-t.xml" + spring : spring);
		}
		if(c("jdbc.common.dialect.name"))
		{
			spring = spath + "/spring-mybatis-common" + (c("jdbc.common.read.url")?"-rw.xml":".xml")
				+ (chk("jdbc.common.transaction") ? spath + "/spring-t-common.xml" + spring : spring);
		}
		if(c("jdbc1.dialect.name"))
		{
			String[] mapperArray = {null, null, null, null, null, null};
			spring = spath + "/spring-mybatis1" + (c("jdbc1.read.url")?"-rw.xml":".xml")
					+ (chk("jdbc1.transaction") ? spath + "/spring-t-1.xml" + spring : spring);
			String[] mappers = EnvironmentUtil.getToString("jdbc1.mapper", "").replaceAll(" ", "").split(",");
			int i = 1;
			for(String p : mappers){if(p.length() > 0 && i < 6){mapperArray[i] = p;i++;}}
			for(i = 1; i < 6; i++){if(mapperArray[i] != null){context.setInitParameter("dswork1.m" + i, mapperArray[i]);}}
		}
		if(c("jdbc2.dialect.name"))
		{
			
			String[] mapperArray = {null, null, null, null, null, null};
			spring = spath + "/spring-mybatis2" + (c("jdbc2.read.url")?"-rw.xml":".xml")
					+ (chk("jdbc2.transaction") ? spath + "/spring-t-2.xml" + spring : spring);
			String[] mappers = EnvironmentUtil.getToString("jdbc2.mapper", "").replaceAll(" ", "").split(",");
			int i = 1;
			for(String p : mappers){if(p.length() > 0 && i < 6){mapperArray[i] = p;i++;}}
			for(i = 1; i < 6; i++){if(mapperArray[i] != null){context.setInitParameter("dswork2.m" + i, mapperArray[i]);}}
		}
		if(c("jdbc3.dialect.name"))
		{
			
			String[] mapperArray = {null, null, null, null, null, null};
			spring = spath + "/spring-mybatis3" + (c("jdbc3.read.url")?"-rw.xml":".xml")
					+ (chk("jdbc3.transaction") ? spath + "/spring-t-3.xml" + spring : spring);
			String[] mappers = EnvironmentUtil.getToString("jdbc3.mapper", "").replaceAll(" ", "").split(",");
			int i = 1;
			for(String p : mappers){if(p.length() > 0 && i < 6){mapperArray[i] = p;i++;}}
			for(i = 1; i < 6; i++){if(mapperArray[i] != null){context.setInitParameter("dswork3.m" + i, mapperArray[i]);}}
		}
		context.setInitParameter("contextConfigLocation", "classpath*:/dswork/config/spring/spring-property.xml" + spring + (spath + "/spring-project.xml"));
		spring = null;
		
		String[] mapperArray = {null, null, null, null, null, null};
		String dsworkBasePackage = EnvironmentUtil.getToString("dswork.base-package", "").replaceAll(" ", "");
		int i = 1;
		if(dsworkBasePackage.length() > 0)
		{
			context.setInitParameter("dswork.base-package", dsworkBasePackage);
			String[] basePackages = dsworkBasePackage.split(",");
			for(String p : basePackages)
			{
				if(p.length() > 0 && i < 6)
				{
					context.setInitParameter("dswork.p" + i, p);/*旧版本的spring，如4.0.9的mvc不支持多个扫描包的配置，有bug，这是兼容模式*/
					mapperArray[i] = "classpath*:/" + p.replace('.', '/') + "/mapper/**/*.map.xml";
					i++;
				}
			}
		}
		String[] mappers = EnvironmentUtil.getToString("jdbc.mapper", "").replaceAll(" ", "").split(",");
		i = 1;
		for(String p : mappers){if(p.length() > 0 && i < 6){mapperArray[i] = p;i++;}}
		for(i = 1; i < 6; i++){if(mapperArray[i] != null){context.setInitParameter("dswork.m" + i, mapperArray[i]);}}
		
		try
		{
			System.setProperty("rootDir", context.getRealPath("/").replaceAll("\\\\", "/"));
			System.setProperty("logsDir", (new File(context.getRealPath("/") + "/../../logs")).getCanonicalPath().replaceAll("\\\\", "/"));
			System.setProperty("contextPath", context.getContextPath());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		try
		{
			File f = new File(context.getRealPath("/") + log4j2);
			if(f.isFile())
			{
				Class.forName("org.apache.logging.log4j.core.LoggerContext");
				//Class.forName("org.apache.logging.log4j.web.Log4jServletContextListener");
				//context.addListener("org.apache.logging.log4j.web.Log4jServletContextListener");
				//org.apache.logging.log4j.core.LoggerContext c = (org.apache.logging.log4j.core.LoggerContext)org.apache.logging.log4j.LogManager.getContext(false);
				//c.setConfigLocation(context.getResource(log4j2).toURI());
				//c.reconfigure();
				//org.apache.logging.log4j.core.config.ConfigurationSource source = new org.apache.logging.log4j.core.config.ConfigurationSource(new java.io.FileInputStream(f), context.getResource(log4j2));
				org.apache.logging.log4j.core.config.Configurator.initialize(null, (new org.apache.logging.log4j.core.config.ConfigurationSource(new java.io.FileInputStream(f), context.getResource(log4j2))));
			}
		}
		catch(Exception e)
		{
		}
		
		context.addListener("org.springframework.web.util.IntrospectorCleanupListener");
		context.addListener("org.springframework.web.context.ContextLoaderListener");
		
		javax.servlet.FilterRegistration.Dynamic encodingFilter = context.addFilter("encodingFilter", "org.springframework.web.filter.CharacterEncodingFilter");
		encodingFilter.setInitParameter("encoding", "UTF-8");
		encodingFilter.setInitParameter("forceEncoding", "true");
		encodingFilter.addMappingForUrlPatterns(null, false, "/*");// false指最优先加载

		javax.servlet.ServletRegistration.Dynamic springmvcServlet = context.addServlet("springmvcServlet", "org.springframework.web.servlet.DispatcherServlet");
		springmvcServlet.setLoadOnStartup(1);
		springmvcServlet.setInitParameter("contextConfigLocation", "classpath*:/dswork/config/mvc/springmvc-servlet.xml" + springmvc);
		springmvcServlet.addMapping("*.htm");
		
		try
		{
			javax.servlet.ServletRegistration.Dynamic authcodeServlet = context.addServlet("AuthcodeServlet", "dswork.web.MyAuthCodeServlet");
			authcodeServlet.addMapping("/authcode");
		}
		catch(Exception e)
		{
		}
	}
	
	private boolean c(String name)
	{
		return EnvironmentUtil.getToString(name, "").length() > 0;
	}
	
	private boolean chk(String name)
	{
		return EnvironmentUtil.getToString(name, "true").equals("true");
	}
}
// context.setInitParameter("log4jConfiguration", "/WEB-INF/classes/config/log4j2.xml");