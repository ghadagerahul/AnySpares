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

import com.buyerservice.app.dto.VehicleModelsDto;
import com.buyerservice.app.service.VehicleModelsService;

@RestController
@RequestMapping("/vehicle-models")
public class VehicleModelsController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private VehicleModelsService modelsService;

	@GetMapping("/load")
	public ResponseEntity<HashMap<String, Object>> loadVehiclemodels(@RequestParam String vehicletype) {

		logger.info("===========================================");
		logger.info("VehicleModelsController-loadVehiclemodels");
		logger.info("loadVehiclemodels-vehicletype: " + vehicletype);
		logger.info("===========================================");

		List<VehicleModelsDto> vehicleModels = modelsService.loadVehicleModels(vehicletype);

		HashMap<String, Object> responseMap = new HashMap<>();
		if (null != vehicleModels && vehicleModels.size() > 0) {
			responseMap.put("success", true);
			responseMap.put("data", vehicleModels);
			return ResponseEntity.ok(responseMap);
		}

		responseMap.put("success", false);
		responseMap.put("data", List.of());
		return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);
	}

}
