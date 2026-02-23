package com.buyerservice.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buyerservice.app.dto.VehicleProductDto;
import com.buyerservice.app.service.VehicleProductService;

import java.util.*;

@RestController
@RequestMapping("/vehicle-products")
public class VehicleProductController {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private VehicleProductService productService;

	@GetMapping("/load")
	public ResponseEntity<HashMap<String, Object>> loadProducts(@RequestParam(required = false) String modelId,
			@RequestParam(required = false) String category, @RequestParam(required = false) String vehicleType) {

		logger.info("VehicleProductControlle-loadProducts || modelId: " + modelId + " || category: " + category
				+ " || vehicleType: " + vehicleType);

		List<VehicleProductDto> productsData = productService.loadProductsData(modelId, category, vehicleType);

		HashMap<String, Object> responseMap = new HashMap<>();
		if (null != productsData && productsData.size() > 0) {
			responseMap.put("success", true);
			responseMap.put("data", productsData);
			return ResponseEntity.ok(responseMap);
		}

		responseMap.put("success", false);
		responseMap.put("data", List.of());
		return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);

	}
}
