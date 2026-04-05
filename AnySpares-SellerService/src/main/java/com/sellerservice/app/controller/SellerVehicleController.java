package com.sellerservice.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sellerservice.app.entity.VehicleBrandDetailsEntity;
import com.sellerservice.app.entity.VehicleModelDetailsEntity;
import com.sellerservice.app.model.VehicleBrandsDetailsDto;
import com.sellerservice.app.model.VehicleModelDetailsDto;
import com.sellerservice.app.service.VehicleService;

@RestController
@RequestMapping("/Vehicles")
public class SellerVehicleController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private VehicleService service;

	@PostMapping("/addVehicleBrand")
	public ResponseEntity<Map<String, Object>> addVehicleBrand(@ModelAttribute VehicleBrandsDetailsDto detailsDto) {

		Map<String, Object> response = new HashMap<>();
		logger.info("Add Vehicle Brand request received: {}", detailsDto);

		try {
			boolean isSaved = service.addVehicleBrand(detailsDto);

			if (isSaved) {
				response.put("success", true);
				response.put("message", "Vehicle details saved successfully");
				return ResponseEntity.ok(response);
			}

			response.put("success", false);
			response.put("message", "vehicle details Already Exists");
			return ResponseEntity.status(HttpStatus.CONFLICT).body(response);

		} catch (Exception ex) {
			logger.error("Error while saving vehicle brand", ex);
			response.put("success", false);
			response.put("message", "Internal server error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@PostMapping("/addVehicleModel")
	public ResponseEntity<Map<String, Object>> addVehicleModels(@ModelAttribute VehicleModelDetailsDto detailsDto) {

		Map<String, Object> response = new HashMap<>();
		logger.info("Add Vehicle Model request received: {}", detailsDto);

		try {
			boolean isSaved = service.addVehicleModels(detailsDto);

			if (isSaved) {
				response.put("success", true);
				response.put("message", "Details saved successfully");
				return ResponseEntity.ok(response);
			}

			response.put("success", false);
			response.put("message", "Details Already Exists");
			return ResponseEntity.status(HttpStatus.CONFLICT).body(response);

		} catch (Exception ex) {
			logger.error("Error while saving vehicle Models", ex);
			response.put("success", false);
			response.put("message", "Internal server error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@GetMapping("/getVehicleBrands")
	ResponseEntity<HashMap<String, Object>> getVehicleDetails() {
		List<VehicleBrandDetailsEntity> vehicleBrands = service.getVehicleBrands();
		HashMap<String, Object> reshMap = new HashMap<>();
		if (null != vehicleBrands && vehicleBrands.size() > 0) {
			reshMap.put("success", true);
			reshMap.put("data", vehicleBrands);
			return ResponseEntity.ok(reshMap);
		}

		reshMap.put("success", false);
		reshMap.put("data", List.of());
		return ResponseEntity.status(HttpStatus.OK).body(reshMap);

	}

}
