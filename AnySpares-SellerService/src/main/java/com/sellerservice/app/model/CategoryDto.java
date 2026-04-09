package com.sellerservice.app.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CategoryDto {

	private String name;
	private String forvehicletype;
	private String description;
	private String color;
	private MultipartFile image;
	private Integer totalProducts;

}
