package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class MyCartIteamsDto {

	private Long productId;
	private String userId;
	private String productName;
	private double price;
	private long quantity;
	private String imageUrl;

}
