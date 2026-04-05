package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleModelsDto;

public interface VehicleModelsService {

	List<VehicleModelsDto> loadVehicleModels(long brandId);

}
