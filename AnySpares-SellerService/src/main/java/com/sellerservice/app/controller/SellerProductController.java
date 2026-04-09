package com.sellerservice.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sellerservice.app.entity.ProductEntity;
import com.sellerservice.app.model.ProductDto;
import com.sellerservice.app.service.TwoWheelerProductService;

@RestController
@RequestMapping("/seller/products")
public class SellerProductController {

	Logger productLogger = LoggerFactory.getLogger(getClass());

	@Autowired
	private TwoWheelerProductService twoWheelerProductService;

	@PostMapping(value = "/addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> addNewProduct(@RequestPart("product") ProductDto productDto,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {

		productLogger.info("Called ProductController-addNewProduct"+productDto);

		try {
			productDto.setImages(images);

			boolean uploadStatus = twoWheelerProductService.addProduct(productDto);

			if (uploadStatus) {
				return ResponseEntity.ok(Map.of("success", true, "message", "Product Added Successfully"));
			}

			return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Add Product failed"));

		} catch (Exception ex) {
			productLogger.error("Error while adding product", ex);
			return ResponseEntity.internalServerError()
					.body(Map.of("success", false, "message", "Internal server error"));
		}
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

	@PutMapping(value = "/updateProduct/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> updateProductEntry(@PathVariable String productId,
			@RequestPart("product") ProductDto dto,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {

		Map<String, Object> response = new HashMap<>();

		if (productId == null || productId.isBlank()) {
			response.put("success", false);
			response.put("message", "ProductId is required");
			return ResponseEntity.badRequest().body(response);
		}

		try {
			// Attach images explicitly
			dto.setImages(images);

			boolean updated = twoWheelerProductService.updateProduct(dto, productId);

			if (updated) {
				response.put("success", true);
				response.put("message", "Product updated successfully");
				return ResponseEntity.ok(response);
			}

			response.put("success", false);
			response.put("message", "Product not found or update failed");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

		} catch (Exception ex) {
			productLogger.error("Error while updating product {}", productId, ex);
			response.put("success", false);
			response.put("message", "Internal server error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

}
