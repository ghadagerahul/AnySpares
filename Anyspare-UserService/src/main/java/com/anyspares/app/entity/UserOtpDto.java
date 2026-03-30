package com.anyspares.app.entity;

import lombok.Data;

@Data
public class UserOtpDto {

	private String emailOrMobile;
	private String otp;
	private String newPassword;

}
