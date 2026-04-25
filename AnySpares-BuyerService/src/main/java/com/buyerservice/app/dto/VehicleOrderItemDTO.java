package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class VehicleOrderItemDTO {

//	private String id;
//	private String name;
//	private double price;
//	private Integer quantity;
//	private String imageUrl;

	private String productId;
	private String productName;
	private String imageUrl;
	private double price;
	private Integer quantity;
	private String userId;

}
