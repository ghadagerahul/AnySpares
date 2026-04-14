package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class VehicleCartDto {

	private long productId;
	private long quantity;
	private long userId;

}
