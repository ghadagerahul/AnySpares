package com.auth.app;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Utility {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String format = LocalDateTime.now().format(formatter);
		Timestamp valueOf = Timestamp.valueOf(format);
		
		System.out.println("valueOf: "+valueOf);
	}

}
