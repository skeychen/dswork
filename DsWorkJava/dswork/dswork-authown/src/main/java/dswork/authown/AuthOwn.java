package dswork.authown;

import java.util.List;

public class AuthOwn
{
	private String id;// ID
	private String account;// 账号
	private String name;// 姓名
	private String own;// 网站所有者
	private List<String> ownList = new java.util.ArrayList<String>();
	
	public AuthOwn(String id, String account, String name, String own)
	{
		this.id = id;
		this.account = account;
		this.name = name;
		this.own = own;
	}

	public String getId()
	{
		return id;
	}

	public String getAccount()
	{
		return account;
	}

	public String getName()
	{
		return name;
	}

	public String getOwn()
	{
		return own;
	}
	
	public List<String> getOwnList()
	{
		if(own.length() > 0 &&  ownList.size() == 0)
		{
			String[] arr = String.valueOf(own).split(",", -1);
			for(String str : arr)
			{
				str = str.trim();
				if(str.length() > 0)
				{
					if(!ownList.contains(str))
					{
						ownList.add(str);
					}
				}
			}
		}
		return ownList;
	}
}
