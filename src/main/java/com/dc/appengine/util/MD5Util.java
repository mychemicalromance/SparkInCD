package com.dc.appengine.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {
	
	private static char[] hexDigits={'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};
	
	public static String md5(String str){
		MessageDigest md5 = null;
		try {
			md5 = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		if( md5 != null ){
			md5.update(str.getBytes());
			byte[] encodeBytes = md5.digest();
			char encodeStr[] = new char [encodeBytes.length * 2];
			int k = 0;
			for( int i = 0 ; i < encodeBytes.length ; i++ ){
				byte encodeByte = encodeBytes[i];
				encodeStr[k++] = hexDigits[encodeByte >> 4 & 0xf];
				encodeStr[k++] = hexDigits[encodeByte & 0xf];
			}
			return new String(encodeStr);
		}
		return null;
	}

	public static String md5(File file) throws Exception{
		MessageDigest md = MessageDigest.getInstance("MD5");
		try (InputStream in = new FileInputStream(file)) {
			byte[] buffer = new byte[8192];
			int length;
			while ((length = in.read(buffer)) != -1) {
				md.update(buffer, 0, length);
			}
			BigInteger bigInteger = new BigInteger(1, md.digest());
			return bigInteger.toString(16);
		}
	}
	
}
