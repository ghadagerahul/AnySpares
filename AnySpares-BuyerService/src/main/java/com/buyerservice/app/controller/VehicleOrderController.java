package com.buyerservice.app.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	public ResponseEntity<VehicleOrderResponseDTO> placeOrder(@RequestBody VehicleOrderRequestDTO request) {

		logger.info("Received order placement request: " + request);

		try {
			VehicleOrderResponseDTO response = orderService.createOrder(request);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest()
					.body(new VehicleOrderResponseDTO(null, "Failed to place order: " + e.getMessage(), null, null));
		}
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
