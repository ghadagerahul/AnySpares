package com.sellerservice.app.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class VehicleBrandsDetailsDto {

	private String brandName;
	private String vehicleCategory;
	private MultipartFile brandImage;

}
