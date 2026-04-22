package com.buyerservice.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buyerservice.app.dto.MyCartIteamsDto;
import com.buyerservice.app.dto.VehicleCartDto;
import com.buyerservice.app.entity.MyBucketEntity;
import com.buyerservice.app.service.VehicleCartService;

import jakarta.websocket.server.PathParam;
import jakarta.ws.rs.Path;

@RestController
@RequestMapping("/cart")
public class VehicleCartController {

	@Autowired
	private VehicleCartService vehicleCartService;

	Logger apiLogger = LoggerFactory.getLogger(getClass());

	@GetMapping
	public String testCart() {
		return "Cart is working..!!!";
	}

	@PostMapping("/add")
	public ResponseEntity<Map<String, Object>> addToBucket(@RequestBody VehicleCartDto cartDto) {
		System.out.println("Item added to cart: " + cartDto);
		Map<String, Object> responseMap = new HashMap<String, Object>();

		if (null != cartDto) {

			Map<String, Object> toCart = vehicleCartService.addToCart(cartDto);

			if (null != toCart && !toCart.isEmpty()) {
				MyBucketEntity object = (MyBucketEntity) toCart.get("data");
				responseMap.put("data", object);
				responseMap.put("message", "Item added to cart successfully.");
				responseMap.put("success", true);
				return ResponseEntity.ok(responseMap);
			}
		}

		responseMap.put("message", "Failed to add item to cart. Invalid input.");
		responseMap.put("success", false);
		responseMap.put("data", List.of());
		return ResponseEntity.status(404).body(responseMap);
	}

	@GetMapping("/view-bucket/{userId}")
	public ResponseEntity<HashMap<String, Object>> getBucketIteams(@PathVariable("userId") Long userId) {

		HashMap<String, Object> responseData = new HashMap<String, Object>();
		System.out.println("###userId: " + userId);

		List<MyCartIteamsDto> bucketItems = vehicleCartService.getBucketItems(userId);

		if (null != bucketItems && !bucketItems.isEmpty()) {

			responseData.put("data", bucketItems);
			responseData.put("message", "Bucket items retrieved successfully.");
			responseData.put("success", true);
			return ResponseEntity.ok(responseData);
		}

		responseData.put("data", List.of());
		responseData.put("message", "No bucket items found for the user.");
		responseData.put("success", false);
		System.out.println("No bucket items found for the user.");
		return ResponseEntity.ok(responseData);
	}

	@PutMapping("/update")
	public ResponseEntity<Map<String, Object>> updateBucket(@RequestBody VehicleCartDto updateRequest) {
		Map<String, Object> responseMap = new HashMap<String, Object>();

		System.out.println("Update bucket request received: " + updateRequest);

		if (updateRequest == null || updateRequest.getUserId() <= 0 || updateRequest.getProductId() <= 0
				|| updateRequest.getQuantity() <= 0) {
			responseMap.put("message", "Invalid request. Missing required fields.");
			responseMap.put("success", false);
			return ResponseEntity.badRequest().body(responseMap);
		}

		List<MyCartIteamsDto> updateCart = vehicleCartService.updateCart(updateRequest);

		responseMap.put("message", "Update bucket functionality is not implemented yet.");
		responseMap.put("success", true);
		responseMap.put("data", updateCart);
		return ResponseEntity.ok(responseMap);
	}

	@DeleteMapping("/remove/{userId}/{productId}/{removeType}")
	public ResponseEntity<Map<String, Object>> removeFromBucket(@PathVariable Long userId, @PathVariable Long productId,
			@PathVariable String removeType) {
		Map<String, Object> responseMap = new HashMap<String, Object>();

		if (userId == null || userId <= 0 || productId == null || productId <= 0 || removeType == null
				|| removeType.isEmpty()) {
			responseMap.put("message", "Invalid userId or productId.");
			responseMap.put("success", false);
			return ResponseEntity.badRequest().body(responseMap);
		}

		List<MyCartIteamsDto> removeFromCart = vehicleCartService.removeFromCart(userId, productId, removeType);

		responseMap.put("message", "Remove from bucket functionality is not implemented yet.");
		responseMap.put("success", true);
		responseMap.put("data", removeFromCart);

		return ResponseEntity.ok(responseMap);
	}

}
