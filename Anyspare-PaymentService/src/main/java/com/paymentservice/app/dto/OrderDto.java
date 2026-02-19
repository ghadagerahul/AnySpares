package com.paymentservice.app.dto;

import lombok.Data;

@Data
public class OrderDto {

	private String username;
	private String email;
	private String product;
	private int price;
	private Long quantity;

}
