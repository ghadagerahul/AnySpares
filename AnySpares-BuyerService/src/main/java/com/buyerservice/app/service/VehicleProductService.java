package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleProductDto;

public interface VehicleProductService {

	List<VehicleProductDto> loadProductsData(String modelId, String category, String vehicleType);

	VehicleProductDto getProductDetails(long productId);

}
