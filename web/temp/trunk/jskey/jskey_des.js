var $jskey = $jskey || {};



(function(){



//chang the string into the bit array
//return bit array(it's length % 64 = 0)
var getKeyBytes = function(key)
{
	var keyBytes = [];
	var len = key.length;
	var iterator = parseInt(len / 4);
	var remainder = len % 4;
	var i = 0;
	for(i = 0; i < iterator; i++)
	{
		keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4));
	}
	if(remainder > 0)
	{
		keyBytes[i] = strToBt(key.substring(i * 4 + 0, len));
	}
	return keyBytes;
};

//chang the string(it's length <= 4) into the bit array
//return bit array(it's length = 64)
var strToBt = function(str)
{
	var len = str.length;
	var bt = new Array(64);
	var i = 0, j = 0, p = 0, q = 0;
	//计算str的前4个字符
	for(i = 0; i < len && i < 4; i++)
	{
		var k = str.charCodeAt(i);
		for(j = 0; j < 16; j++)
		{
			var pow = 1, m = 0;
			for(m = 15; m > j; m--)
			{
				pow *= 2;
			}
			bt[16 * i + j] = parseInt(k / pow) % 2;
		}
	}
	// len小于4时补0计算
	for(p = len; p < 4; p++)
	{
		var k = 0;
		for(q = 0; q < 16; q++)
		{
			var pow = 1, m = 0;
			for(m = 15; m > q; m--)
			{
				pow *= 2;
			}
			bt[16 * p + q] = parseInt(k / pow) % 2;
		}
	}
	return bt;
};

var binaryArray = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
//二进制转十六进制
var bt4ToHex = function(binary)
{
	var hex = "";
	try
	{
		var i = parseInt(binary, 2);
		if(i > -1 && i < 16)
		{
			hex = i.toString(16);
		}
	}
	catch(ex)
	{
	}
	return hex.toUpperCase();;
};
// 十进制转二进制
var getBoxBinary = function (i)
{
	var binary = "";
	if(i > -1 && i < 16)
	{
		binary = binaryArray[i];
	}
	return binary;
};
// 十六进制转二进制
var hexToBt4 = function(hex)
{
	var binary = "";
	try
	{
		var i = parseInt(hex, 16);
		if(i > -1 && i < 16)
		{
			binary = binaryArray[i];
		}
	}
	catch(ex)
	{
	}
	return binary;
};

//chang the bit(it's length = 64) into the string
//return string
var byteToString = function(byteData)
{
	var str = "";
	for(var i = 0; i < 4; i++)
	{
		var count = 0;
		for(var j = 0; j < 16; j++)
		{
			var pow = 1;
			for(var m = 15; m > j; m--)
			{
				pow *= 2;
			}
			count += byteData[16 * i + j] * pow;
		}
		if(count != 0)
		{
			str += String.fromCharCode(count);
		}
	}
	return str;
};

var bt64ToHex = function(byteData)
{
	var hex = "";
	for(var i = 0; i < 16; i++)
	{
		var bt = "";
		for(var j = 0; j < 4; j++)
		{
			bt += byteData[i * 4 + j];
		}
		hex += bt4ToHex(bt);
	}
	return hex;
};

var hexToBt64 = function(hex)
{
	var binary = "";
	for(var i = 0; i < 16; i++)
	{
		binary += hexToBt4(hex.substring(i, i + 1));
	}
	return binary;
};

var enc = function(dataByte, keyByte)
{
	var keys = generateKeys(keyByte);
	var ipByte = initPermute(dataByte);
	var ipLeft = new Array(32);
	var ipRight = new Array(32);
	var tempLeft = new Array(32);
	var i = 0, j = 0, k = 0, m = 0, n = 0;
	for(k = 0; k < 32; k++)
	{
		ipLeft[k] = ipByte[k];
		ipRight[k] = ipByte[32 + k];
	}
	for(i = 0; i < 16; i++)
	{
		for(j = 0; j < 32; j++)
		{
			tempLeft[j] = ipLeft[j];
			ipLeft[j] = ipRight[j];
		}
		var key = new Array(48);
		for(m = 0; m < 48; m++)
		{
			key[m] = keys[i][m];
		}
		var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
		for(n = 0; n < 32; n++)
		{
			ipRight[n] = tempRight[n];
		}
	}
	var finalData = new Array(64);
	for(i = 0; i < 32; i++)
	{
		finalData[i] = ipRight[i];
		finalData[32 + i] = ipLeft[i];
	}
	return finallyPermute(finalData);
};

var dec = function(dataByte, keyByte)
{
	var keys = generateKeys(keyByte);
	var ipByte = initPermute(dataByte);
	var ipLeft = new Array(32);
	var ipRight = new Array(32);
	var tempLeft = new Array(32);
	var i = 0, j = 0, k = 0, m = 0, n = 0;
	for(k = 0; k < 32; k++)
	{
		ipLeft[k] = ipByte[k];
		ipRight[k] = ipByte[32 + k];
	}
	for(i = 15; i >= 0; i--)
	{
		for(j = 0; j < 32; j++)
		{
			tempLeft[j] = ipLeft[j];
			ipLeft[j] = ipRight[j];
		}
		var key = new Array(48);
		for(m = 0; m < 48; m++)
		{
			key[m] = keys[i][m];
		}
		var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
		for(n = 0; n < 32; n++)
		{
			ipRight[n] = tempRight[n];
		}
	}
	var finalData = new Array(64);
	for(i = 0; i < 32; i++)
	{
		finalData[i] = ipRight[i];
		finalData[32 + i] = ipLeft[i];
	}
	return finallyPermute(finalData);
};

var initPermute = function(originalData)
{
	var ipByte = new Array(64);
	var i = 0, m = 1, n = 0, j, k;
	for(i = 0, m = 1, n = 0; i < 4; i++,m += 2,n += 2)
	{
		for(j = 7, k = 0; j >= 0; j--,k++)
		{
			ipByte[i * 8 + k] = originalData[j * 8 + m];
			ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
		}
	}
	return ipByte;
};

var expandPermute = function(rightData)
{
	var epByte = new Array(48);
	for(var i = 0; i < 8; i++)
	{
		if(i == 0)
		{
			epByte[i * 6 + 0] = rightData[31];
		}
		else
		{
			epByte[i * 6 + 0] = rightData[i * 4 - 1];
		}
		epByte[i * 6 + 1] = rightData[i * 4 + 0];
		epByte[i * 6 + 2] = rightData[i * 4 + 1];
		epByte[i * 6 + 3] = rightData[i * 4 + 2];
		epByte[i * 6 + 4] = rightData[i * 4 + 3];
		if(i == 7)
		{
			epByte[i * 6 + 5] = rightData[0];
		}
		else
		{
			epByte[i * 6 + 5] = rightData[i * 4 + 4];
		}
	}
	return epByte;
};

var xor = function(byteOne, byteTwo)
{
	var xorByte = new Array(byteOne.length);
	for(var i = 0; i < byteOne.length; i++)
	{
		xorByte[i] = byteOne[i] ^ byteTwo[i];
	}
	return xorByte;
};

var sBoxPermute = function(expandByte)
{

	var sBoxByte = new Array(32);
	var binary = "";
	var s1 =
	[
		[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
		[0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
		[4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
		[15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
	];
	var s2 =
	[
		[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
		[3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
		[0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
		[13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
	];
	var s3 =
	[
		[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
		[13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
		[13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
		[1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
	];
	var s4 =
	[
		[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
		[13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
		[10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
		[3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
	];
	var s5 =
	[
		[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
		[14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
		[4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
		[11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
	];
	var s6 =
	[
		[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
		[10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
		[9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
		[4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
	];
	var s7 =
	[
		[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
		[13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
		[1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
		[6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
	];
	var s8 =
	[
		[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
		[1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
		[7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
		[2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
	];
	for(var m = 0; m < 8; m++)
	{
		var i = 0, j = 0;
		i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
		j = expandByte[m * 6 + 1] * 2 * 2 * 2 + expandByte[m * 6 + 2] * 2 * 2 + expandByte[m * 6 + 3] * 2 + expandByte[m * 6 + 4];
		switch(m)
		{
			case 0:
				binary = getBoxBinary(s1[i][j]);
				break;
			case 1:
				binary = getBoxBinary(s2[i][j]);
				break;
			case 2:
				binary = getBoxBinary(s3[i][j]);
				break;
			case 3:
				binary = getBoxBinary(s4[i][j]);
				break;
			case 4:
				binary = getBoxBinary(s5[i][j]);
				break;
			case 5:
				binary = getBoxBinary(s6[i][j]);
				break;
			case 6:
				binary = getBoxBinary(s7[i][j]);
				break;
			case 7:
				binary = getBoxBinary(s8[i][j]);
				break;
		}
		sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1));
		sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2));
		sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3));
		sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4));
	}
	return sBoxByte;
};

var pPermute = function(e)
{
	var p = [//e = sBoxByte
		e[15], e[6],  e[19], e[20], e[28], e[11], e[27], e[16], e[0],  e[14], e[22], e[25], e[4],  e[17], e[30], e[9],
		e[1],  e[7],  e[23], e[13], e[31], e[26], e[2],  e[8],  e[18], e[12], e[29], e[5],  e[21], e[10], e[3],  e[24]
	];
	return p;
};

var finallyPermute = function (e)
{
	var p = [//e = endByte
		e[39], e[7], e[47], e[15], e[55], e[23], e[63], e[31], e[38], e[6], e[46], e[14], e[54], e[22], e[62], e[30],
		e[37], e[5], e[45], e[13], e[53], e[21], e[61], e[29], e[36], e[4], e[44], e[12], e[52], e[20] ,e[60], e[28],
		e[35], e[3], e[43], e[11], e[51], e[19], e[59], e[27], e[34], e[2], e[42], e[10], e[50], e[18], e[58], e[26],
		e[33], e[1], e[41], e[9],  e[49], e[17], e[57], e[25], e[32], e[0], e[40], e[8],  e[48], e[16], e[56], e[24]
	];
	return p;
};

//generate 16 keys for xor
var generateKeys = function (keyByte)
{
	var e = new Array(56);
	var keys = [[], [] ,[] ,[] ,[] ,[], [], [], [], [],[] ,[], [], [], [], []];
	var loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
	for(var i = 0; i < 7; i++)
	{
		for(var j = 0, k = 7; j < 8; j++,k--)
		{
			e[i * 8 + j] = keyByte[8 * k + i];
		}
	}
	for(var i = 0; i < 16; i++)
	{
		var tempLeft = 0;
		var tempRight = 0;
		for(var j = 0; j < loop[i]; j++)
		{
			tempLeft = e[0];
			tempRight = e[28];
			for(k = 0; k < 27; k++)
			{
				e[k] = e[k + 1];
				e[28 + k] = e[29 + k];
			}
			e[27] = tempLeft;
			e[55] = tempRight;
		}
		var t = [
			e[13], e[16], e[10], e[23], e[0],  e[4],  e[2],  e[27], e[14], e[5],  e[20], e[9],  e[22], e[18], e[11], e[3],
			e[25], e[7],  e[15], e[6],  e[26], e[19], e[12], e[1],  e[40], e[51], e[30], e[36], e[46], e[54], e[29], e[39],
			e[50], e[44], e[32], e[47], e[43], e[48], e[38], e[55], e[33], e[52], e[45], e[41], e[49], e[35], e[28], e[31]
		];
		for(var m = 0; m < 48; m++)
		{
			keys[i][m] = t[m];
		}
	}
	return keys;
};



/**
 * 将字符串转化为des编码
 * @param str 需要加密的String
 * @param key 密钥
 * @return des编码的String
 */
var encodeDes = function(str, key)
{
	var len = str.length;
	var encData = "";
	var keyBt;
	var length = 0;
	if(key != null && key != "")
	{
		keyBt = getKeyBytes(key);
		length = keyBt.length;
		var iterator = parseInt(len / 4);
		var remainder = len % 4;
		for(var i = 0; i < iterator; i++)
		{
			var tempData = str.substring(i * 4 + 0, i * 4 + 4);
			var tempByte = strToBt(tempData);
			var encByte;
			var tempBt = tempByte;
			for(var x = 0; x < length; x++)
			{
				tempBt = enc(tempBt, keyBt[x]);
			}
			encByte = tempBt;
			encData += bt64ToHex(encByte);
		}
		if(remainder > 0)
		{
			var remainderData = str.substring(iterator * 4 + 0, len);
			var tempByte = strToBt(remainderData);
			var encByte;
			var tempBt = tempByte;
			for(var x = 0; x < length; x++)
			{
				tempBt = enc(tempBt, keyBt[x]);
			}
			encByte = tempBt;
			encData += bt64ToHex(encByte);
		}
	}
	return encData;
};



/**
 * 将des编码的字符串进行解码
 * @param str des编码的字符串
 * @param key 密钥
 * @return 解码后的字符串
 */
var decodeDes = function(str, key)
{
	var len = str.length;
	var decStr = "";
	var keyBt;
	var length = 0;
	if(key != null && key != "")
	{
		keyBt = getKeyBytes(key);
		length = keyBt.length;
		var iterator = parseInt(len / 16);
		var i = 0;
		for(i = 0; i < iterator; i++)
		{
			var tempData = str.substring(i * 16 + 0, i * 16 + 16);
			var strByte = hexToBt64(tempData);
			var intByte = new Array(64);
			for(var j = 0; j < 64; j++)
			{
				intByte[j] = parseInt(strByte.substring(j, j + 1));
			}
			var decByte;
			var tempBt = intByte;
			for(var x = length - 1; x >= 0; x--)
			{
				tempBt = dec(tempBt, keyBt[x]);
			}
			decByte = tempBt;
			decStr += byteToString(decByte);
		}
	}
	return decStr;
};



$jskey.encodeDes = encodeDes;



$jskey.decodeDes = decodeDes;



})();