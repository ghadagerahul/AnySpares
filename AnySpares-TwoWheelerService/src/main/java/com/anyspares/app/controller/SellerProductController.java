package com.anyspares.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.entity.ProductEntity;
import com.anyspares.app.model.ProductDto;
import com.anyspares.app.repo.ProductRepository;
import com.anyspares.app.service.TwoWheelerProductService;

@RestController
@RequestMapping("/seller/products")
public class SellerProductController {

	private final ProductRepository productRepository;

	Logger productLogger = LoggerFactory.getLogger(getClass());

	@Autowired
	private TwoWheelerProductService twoWheelerProductService;

	SellerProductController(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

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

	@GetMapping("/productFromProductId/{productId}")
	public ResponseEntity<HashMap<String, Object>> fetchProductFromProductId(@PathVariable String productId) {
		ProductEntity productByProductId = twoWheelerProductService.getProductByProductId(productId);

		HashMap<String, Object> respMap = new HashMap<>();
		if (null != productByProductId) {
			respMap.put("sucess", true);
			respMap.put("message", "ProductEntity Fetched successfully");
			respMap.put("data", productByProductId);
		} else {
			respMap.put("sucess", true);
			respMap.put("message", "ProductEntity Fetch Failed");
			respMap.put("data", Optional.empty().get());
		}
		return ResponseEntity.ok(respMap);
	}

	@PutMapping("/updateProduct/{productId}")
	public ResponseEntity<HashMap<String, Object>> updateProductEntry(@ModelAttribute ProductDto dto,
			@PathVariable String productId) {

		boolean updateProductFlag = twoWheelerProductService.updateProduct(dto, productId);

		HashMap<String, Object> hashMap = new HashMap<>();
		hashMap.put("sucess", updateProductFlag);

		return ResponseEntity.ok(hashMap);
	}

}
