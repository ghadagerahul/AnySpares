package com.anyspares.app.controller.model;

import lombok.Data;

@Data
public class SellerUserDetailsModel {

	private String businesstName;
	private String ownerName;
	private Long mobileNo;
	private String emailAddress;
	private String gstNumber;
	private String completeAddress;
	private String city;
	private String pincode;
	private String vehicleType;
	private String password;
	private String confPassword;

}
