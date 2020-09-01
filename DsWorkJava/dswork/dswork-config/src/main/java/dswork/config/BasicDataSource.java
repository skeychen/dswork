package dswork.config;

public class BasicDataSource extends org.apache.commons.dbcp2.BasicDataSource
{
	private String filters;
	private int maxPoolPreparedStatementPerConnectionSize = -1;

	public synchronized int getMaxActive()
	{
		return getMaxTotal();
	}

	public synchronized void setMaxActive(final int maxActive)
	{
		setMaxTotal(maxActive);
	}

	public synchronized long getMaxWait()
	{
		return getMaxWaitMillis();
	}

	public synchronized void setMaxWait(long maxWait)
	{
		setMaxWaitMillis(maxWait);
	}

	public String getFilters()
	{
		return filters;
	}

	public void setFilters(String filters)
	{
		this.filters = filters;
	}

	public int getMaxPoolPreparedStatementPerConnectionSize()
	{
		return maxPoolPreparedStatementPerConnectionSize;
	}

	public void setMaxPoolPreparedStatementPerConnectionSize(int maxPoolPreparedStatementPerConnectionSize)
	{
		this.maxPoolPreparedStatementPerConnectionSize = maxPoolPreparedStatementPerConnectionSize;
	}
	// @Override
	// protected org.apache.commons.dbcp.ConnectionFactory createConnectionFactory() throws java.sql.SQLException
	// {
	// if(driverClassName.equals("dswork.jdbc.DriverSpy"))
	// {
	// connectionProperties.put("user", username);
	// connectionProperties.put("password", password);
	// return new org.apache.commons.dbcp.DriverConnectionFactory(new dswork.jdbc.DriverSpy(), url,
	// connectionProperties);
	// }
	// else
	// {
	// return super.createConnectionFactory();
	// }
	// }
}
