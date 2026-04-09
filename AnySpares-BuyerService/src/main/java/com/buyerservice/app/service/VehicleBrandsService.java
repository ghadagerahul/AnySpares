package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleBrandsDto;

public interface VehicleBrandsService {

	List<VehicleBrandsDto> loadVehicleBrands(String vehicletype);

}
