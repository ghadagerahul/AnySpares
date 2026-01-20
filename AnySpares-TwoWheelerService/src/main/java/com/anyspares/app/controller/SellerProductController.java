package com.anyspares.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anyspares.app.model.ProductDto;
import com.anyspares.app.service.TwoWheelerProductService;

@RestController
@RequestMapping("/seller/products")
public class SellerProductController {

	Logger productLogger = LoggerFactory.getLogger(getClass());

	@Autowired
	private TwoWheelerProductService twoWheelerProductService;

	@PostMapping(value = "/addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addNewProduct(@ModelAttribute ProductDto productDto) {
		productLogger.info("Callled ProductController-addNewProduct");
		productLogger.info("productDto: " + productDto);

		boolean uploadStatus = twoWheelerProductService.addProduct(productDto);

		if (uploadStatus) {
			return ResponseEntity.ok(Map.of("success", true, "message", "Product Added Successfully"));

		}

		return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Add Product failed"));
	}

	@GetMapping("/fetchFormLoadData")
	public ResponseEntity<HashMap<String, Object>> getCategoriesList() {

		Map<String, List<String>> productCategoriesMap = twoWheelerProductService.getProductCategoriesList();

		HashMap<String, Object> responsehMap = null;

		if (null != productCategoriesMap && productCategoriesMap.size() > 0) {
			responsehMap = new HashMap<>();
			responsehMap.put("sucess", true);
			responsehMap.put("message", "Category List Fetched Sunncessfully");
			responsehMap.put("data", productCategoriesMap);
		} else {
			responsehMap = new HashMap<>();
			responsehMap.put("sucess", true);
			responsehMap.put("message", "Category List Fetch Failed");
			responsehMap.put("data", List.of());
		}

		return ResponseEntity.ok(responsehMap);
	}

}
