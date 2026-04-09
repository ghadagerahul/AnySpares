package com.sellerservice.app.model;

import lombok.Data;

@Data
public class CategoryResponseDto {

	private Long categoryId;
	private String name;
	private String forvehicletype;
	private String description;
	private String color;
	private String image;
	private Integer totalProducts;

}
