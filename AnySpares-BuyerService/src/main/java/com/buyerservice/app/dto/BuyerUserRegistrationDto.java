package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class BuyerUserRegistrationDto {

	private String firstName;
	private String lastName;
	private String emailId;
	private Long mobileNo;
	private String userName;
	private String password;
	private String confPassword;

}
