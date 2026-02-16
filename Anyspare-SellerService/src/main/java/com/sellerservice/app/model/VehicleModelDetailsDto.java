package com.sellerservice.app.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class VehicleModelDetailsDto {

	private Long brandId;
	private String brandName;
	private String vehicleCategory;
	private String modelName;
	private Integer modelYearFrom;
	private Integer modelYearTo;
	private MultipartFile modelImage;
}
