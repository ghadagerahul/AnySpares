package com.sellerservice.app.model;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ProductDto {

	private String name;
	private String brand;
	private String model;
	private String category;
	private String status;
	private String type;
	private double mrp;
	private double price;
	private Integer stock;
	private Integer minQty;
	private String description;
	private List<String> compatibleModels;
	private boolean warranty;
	private MultipartFile images;

}
