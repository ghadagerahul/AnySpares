package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class VehicleCheckoutContactDto {

	private Long id;
	private String userId;
	private String name;
	private String phone;
	private String email;

}
