package com.buyerservice.app.dto;

import lombok.Data;

@Data
public class VehicleProductDto {

	private String name;
	private String type;
	private double rating;
	private int reviews;
	private double discountedPrice;
	private double originalPrice;
	private double discount;
	private String imageUrl;

}
