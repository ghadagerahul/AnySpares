package com.sellerservice.app.service;

import java.util.List;

import com.sellerservice.app.entity.VehicleBrandDetailsEntity;
import com.sellerservice.app.model.VehicleBrandsDetailsDto;
import com.sellerservice.app.model.VehicleModelDetailsDto;

public interface VehicleService {

	boolean addVehicleBrand(VehicleBrandsDetailsDto detailsDto);

	List<VehicleBrandDetailsEntity> getVehicleBrands();

	boolean addVehicleModels(VehicleModelDetailsDto detailsDto);

}
