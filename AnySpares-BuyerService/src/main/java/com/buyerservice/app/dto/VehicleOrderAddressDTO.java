package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class VehicleOrderAddressDTO {

	private String name;
	private String phone;
	private String street;
	private String city;
	private String state;
	private String pincode;

}
