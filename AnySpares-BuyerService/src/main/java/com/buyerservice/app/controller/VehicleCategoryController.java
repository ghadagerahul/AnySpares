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

import com.buyerservice.app.dto.VehicleCategoryDto;
import com.buyerservice.app.service.VehicleCategoryService;

@RestController
@RequestMapping("/vehicle-categories")
public class VehicleCategoryController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private VehicleCategoryService categoryService;

	@GetMapping("/load")
	public ResponseEntity<HashMap<String, Object>> loadVehicleCategories(@RequestParam String vehicleType) {

		List<VehicleCategoryDto> vehicleCategoryList = categoryService.loadVehicleCategory(vehicleType);

		HashMap<String, Object> responseMap = new HashMap<>();
		if (null != vehicleCategoryList && vehicleCategoryList.size() > 0) {
			responseMap.put("success", true);
			responseMap.put("data", vehicleCategoryList);
			return ResponseEntity.ok(responseMap);
		}

		responseMap.put("success", false);
		responseMap.put("data", List.of());
		return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);
	}

}
