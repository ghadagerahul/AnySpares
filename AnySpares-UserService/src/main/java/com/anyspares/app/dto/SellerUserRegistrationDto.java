package com.anyspares.app.dto;

import java.util.List;

import lombok.Data;

@Data
public class SellerUserRegistrationDto {

	private String businesstName;
	private String ownerName;
	private Long mobileNo;
	private String emailAddress;
	private String gstNumber;
	private String completeAddress;
	private String city;
	private String pincode;
	private List<String> vehicleType;
	private String password;
	private String confPassword;

}
