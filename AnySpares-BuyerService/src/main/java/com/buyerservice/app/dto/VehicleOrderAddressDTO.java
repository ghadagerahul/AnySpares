package com.buyerservice.app.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class VehicleOrderAddressDTO {

//	private String name;
//	private String phone;
//	private String street;
//	private String city;
//	private String state;
//	private String pincode;

	private Long id;
	private String userId;
	private String name;
	private String phone;
	private String street;
	private String city;
	private String state;
	private String pincode;
	private Boolean isDefault;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
