package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleProductDto;
import com.buyerservice.app.entity.VehicleProductEntiry;

public interface VehicleProductService {

	List<VehicleProductDto> loadProductsData(String modelId, String category, String vehicleType);

}
