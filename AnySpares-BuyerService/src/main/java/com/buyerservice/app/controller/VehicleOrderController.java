package com.buyerservice.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buyerservice.app.dto.VehicleOrderRequestDTO;
import com.buyerservice.app.dto.VehicleOrderResponseDTO;
import com.buyerservice.app.entity.OrderEntity;
import com.buyerservice.app.service.OrderService;

@RestController
@RequestMapping("/vehicle-orders")
public class VehicleOrderController {

	@Autowired
	private OrderService orderService;

	private Logger logger = LoggerFactory.getLogger(getClass());

	@GetMapping("/test")
	public String testOrders() {
		return "Vehicle Orders API is working fine";
	}

	@PostMapping("/place-order")
	public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody VehicleOrderRequestDTO request) {

		logger.info("Received order placement request: {}", request);

		Map<String, Object> resMap = new HashMap<>();

		try {
			VehicleOrderResponseDTO response = orderService.createOrder(request);

			if (response == null) {
				resMap.put("success", false);
				resMap.put("message", "Order creation failed");
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resMap);
			}

			resMap.put("success", true);
			resMap.put("data", response);
			resMap.put("message", response.getMessage());

			return ResponseEntity.ok(resMap);

		} catch (Exception e) {
			logger.error("Error while placing order", e);

			resMap.put("success", false);
			resMap.put("message", "Failed to place order");

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resMap);
		}
	}

	@PutMapping("/payment-status/{orderId}/{status}")
	public void updateOrderStatus(@PathVariable Long orderId, @PathVariable String status) {
		orderService.updateOrderStatus(orderId, status);
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<OrderEntity>> getUserOrders(@PathVariable Long userId) {
		List<OrderEntity> orders = orderService.getUserOrders(userId);
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<OrderEntity> getOrderById(@PathVariable Long orderId) {
		OrderEntity order = orderService.getOrderById(orderId);
		return ResponseEntity.ok(order);
	}
}
