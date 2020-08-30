package dswork.common.model;

public class ZAuthtoken
{
	private String access_token = "";
	private int expires_in;
	private String refresh_token = "";
	private String openid = null;

	public ZAuthtoken()
	{
	}

	public ZAuthtoken(String access_token, int expires_in, String refresh_token, String openid)
	{
		this.access_token = access_token;
		this.expires_in = expires_in;
		this.refresh_token = refresh_token;
		this.openid = openid;
	}

	public String getAccess_token()
	{
		return access_token;
	}

	public void setAccess_token(String access_token)
	{
		this.access_token = access_token;
	}

	public int getExpires_in()
	{
		return expires_in;
	}

	public void setExpires_in(int expires_in)
	{
		this.expires_in = expires_in;
	}

	public String getRefresh_token()
	{
		return refresh_token;
	}

	public void setRefresh_token(String refresh_token)
	{
		this.refresh_token = refresh_token;
	}

	public String getOpenid()
	{
		return openid;
	}

	public void setOpenid(String openid)
	{
		this.openid = openid;
	}
}
