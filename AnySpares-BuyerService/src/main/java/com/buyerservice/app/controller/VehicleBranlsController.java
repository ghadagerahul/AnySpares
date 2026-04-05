package com.buyerservice.app.controller;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buyerservice.app.dto.VehicleBrandsDto;
import com.buyerservice.app.service.VehicleBrandsService;

@RestController
@RequestMapping("/vehicle-brands")
public class VehicleBranlsController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private VehicleBrandsService brandsService;

	@GetMapping("/load")
	public ResponseEntity<HashMap<String, Object>> loadVehicleBrands(@RequestParam String vehicletype) {

		logger.info("===========================================");
		logger.info("VehicleModelsController-loadVehicleBrands");
		logger.info("loadVehiclemodels-vehicletype: " + vehicletype);
		logger.info("===========================================");

		List<VehicleBrandsDto> vehicleBrands = brandsService.loadVehicleBrands(vehicletype);

		HashMap<String, Object> responseMap = new HashMap<>();
		if (null != vehicleBrands && vehicleBrands.size() > 0) {
			responseMap.put("success", true);
			responseMap.put("data", vehicleBrands);
			return ResponseEntity.ok(responseMap);
		}

		responseMap.put("success", false);
		responseMap.put("data", List.of());
		return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);
	}

}
