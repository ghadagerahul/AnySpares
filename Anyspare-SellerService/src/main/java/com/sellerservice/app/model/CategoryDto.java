package com.sellerservice.app.model;

import lombok.Data;

@Data
public class CategoryDto {

	private Long categoryId;
	private String name;
	private String description;
	private String icon;
	private String color;
	private String image;
	private Integer totalProducts;

}
