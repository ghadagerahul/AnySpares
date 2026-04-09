package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleCategoryDto;

public interface VehicleCategoryService {

	List<VehicleCategoryDto> loadVehicleCategory(String vehicleType);

}
