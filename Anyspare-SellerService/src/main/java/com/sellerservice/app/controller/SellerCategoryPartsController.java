package com.sellerservice.app.controller;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sellerservice.app.entity.ProductEntity;
import com.sellerservice.app.service.TwoWheelerProductService;


@RestController
@RequestMapping("/sellercategoryparts")
public class SellerCategoryPartsController {

	@Autowired
	@Lazy
	private TwoWheelerProductService productService;

	Logger logger = LoggerFactory.getLogger(getClass());

	@GetMapping("/categories/{categoryType}")
	public ResponseEntity<HashMap<String, Object>> getPartsUnderCategories(@PathVariable String categoryType) {
	
		logger.info("Inside SellerCategoryPartsController-getPartsUnderCategories()");
		HashMap<String, Object> resonsehMap = null;
		List<ProductEntity> productsByCategoryType = null;
		
		try {
			productsByCategoryType = productService.getProductsByCategoryType(categoryType);

			resonsehMap = new HashMap<>();

			resonsehMap.put("success", true);
			resonsehMap.put("message", "Categories Product fetched successfully");
			if (null != productsByCategoryType && productsByCategoryType.size() > 0)
				resonsehMap.put("data", productsByCategoryType);

			return ResponseEntity.ok(resonsehMap);

		} catch (Exception e) {
			resonsehMap = new HashMap<>();
			resonsehMap.put("success", false);
			resonsehMap.put("message", "Error while fetch Product");
			resonsehMap.put("data", List.of());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resonsehMap);
		}

	}

}
