package com.anyspares.app.dto;

import lombok.Data;

@Data
public class UserLoginDto {

	private String emailId;
	private long mobileNo;
	private String password;
	private String userType;

}
