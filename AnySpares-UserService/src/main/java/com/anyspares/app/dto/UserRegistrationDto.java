package com.anyspares.app.dto;

import java.util.List;

import lombok.Data;

@Data
public class UserRegistrationDto {

	private String firstName;
	private String lastName;
	private String email;
	// private Long mobileNo;
	private String userName;
	// private String password;
	// private String confPassword;

	private String businessName;
	private String ownerName;
	private Long mobileNo;
	// private String emailAddress;
	private String gstNumber;
	private String completeAddress;
	private String city;
	private String pincode;
	private List<String> vehicleType;
	private String password;
	private String confPassword;

	private String userType;

}
