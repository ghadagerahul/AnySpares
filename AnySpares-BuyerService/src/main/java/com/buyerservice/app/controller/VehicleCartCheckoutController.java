package com.buyerservice.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
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

import com.buyerservice.app.dto.VehicleCheckoutContactDto;
import com.buyerservice.app.dto.VehicleOrderAddressDto;
import com.buyerservice.app.service.VehicleCartCheckoutService;

@RestController
@RequestMapping("/checkout")
public class VehicleCartCheckoutController {

	@Autowired
	private VehicleCartCheckoutService vehicleCartCheckoutService;;

	Logger apiLogger = LoggerFactory.getLogger(getClass());

	@GetMapping("/test")
	public String checkoutTest() {
		return "Checkout successful!";
	}

	@GetMapping("/order-address/{userId}")
	public ResponseEntity<Map<String, Object>> getOrderAddress(@PathVariable String userId) {
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			if (null != userId && StringUtils.isNotBlank(userId)) {
				apiLogger.info("Received request to get order address for user: {}", userId);
				List<VehicleOrderAddressDto> orderAddressData = vehicleCartCheckoutService.getOrderAddress(userId);
				if (null != orderAddressData && orderAddressData.size() > 0) {
					response.put("success", true);
					response.put("message", "Order address retrieved successfully");
					response.put("data", orderAddressData);
					return ResponseEntity.ok(response);
				}
			}
			response.put("success", true);
			response.put("message", "Order address retrieved successfully");
			response.put("data", List.of());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception ex) {
			apiLogger.error("Exception in getOrderAddress: {}", ex.getMessage(), ex);
			response.put("success", false);
			response.put("message", "Error retrieving order address");
			response.put("data", List.of());
			return ResponseEntity.internalServerError().body(response);
		}
	}

	@PostMapping("/order-address")
	public ResponseEntity<Map<String, Object>> saveOrderAddress(@RequestBody VehicleOrderAddressDto orderAddressDto) {
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			if (null != orderAddressDto && StringUtils.isNotBlank(orderAddressDto.getUserId())) {
				apiLogger.info("Received request to save order address for user: {}", orderAddressDto.getUserId());
				List<VehicleOrderAddressDto> orderAddress = vehicleCartCheckoutService
						.saveOrderAddress(orderAddressDto);
				if (null != orderAddress && orderAddress.size() > 0) {
					response.put("success", true);
					response.put("message", "Order address saved successfully");
					response.put("data", orderAddress);
					return ResponseEntity.ok(response);
				}
			}
			response.put("success", false);
			response.put("message", "Order address retrieved successfully");
			response.put("data", List.of());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception ex) {
			apiLogger.error("Exception in saveOrderAddress: {}", ex.getMessage(), ex);
			response.put("success", false);
			response.put("message", "Error saving order address");
			response.put("data", List.of());
			return ResponseEntity.internalServerError().body(response);
		}
	}

	@PutMapping("/order-address/{addressId}")
	public ResponseEntity<Map<String, Object>> updateOrderAddress(@PathVariable String addressId,
			@RequestBody VehicleOrderAddressDto addressDto) {
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			if (null != addressDto && StringUtils.isNotBlank(addressId)) {
				apiLogger.info("Received request to update order address for addressId: {}", addressId);
				List<VehicleOrderAddressDto> orderAddress = vehicleCartCheckoutService.updateOrderAddress(addressId,
						addressDto);
				if (null != orderAddress && orderAddress.size() > 0) {
					response.put("success", true);
					response.put("message", "Order address updated successfully");
					response.put("data", orderAddress);
					return ResponseEntity.ok(response);
				}
			}
			response.put("success", false);
			response.put("message", "Order address retrieved successfully");
			response.put("data", List.of());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception ex) {
			apiLogger.error("Exception in updateOrderAddress: {}", ex.getMessage(), ex);
			response.put("success", false);
			response.put("message", "Error updating order address");
			response.put("data", List.of());
			return ResponseEntity.internalServerError().body(response);
		}
	}

	@DeleteMapping("/order-address/{addressId}")
	public ResponseEntity<Map<String, Object>> deleteOrderAddress(@PathVariable String addressId) {
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			if (StringUtils.isNotBlank(addressId)) {
				apiLogger.info("Received request to delete order address for addressId: {}", addressId);
				List<VehicleOrderAddressDto> orderAddress = vehicleCartCheckoutService.deleteOrderAddress(addressId);
				if (null != orderAddress && orderAddress.size() > 0) {
					response.put("success", true);
					response.put("message", "Order address deleted successfully");
					response.put("data", orderAddress);
					return ResponseEntity.ok(response);
				}
			}
			response.put("success", false);
			response.put("message", "Order address retrieved successfully");
			response.put("data", List.of());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception ex) {
			apiLogger.error("Exception in deleteOrderAddress: {}", ex.getMessage(), ex);
			response.put("success", false);
			response.put("message", "Error deleting order address");
			response.put("data", List.of());
			return ResponseEntity.internalServerError().body(response);
		}
	}

	@GetMapping("/order-contact/{userId}")
	public ResponseEntity<Map<String, Object>> getOrderContactDetails(@PathVariable String userId) {
		Map<String, Object> response = new HashMap<>();
		try {
			if (StringUtils.isNotBlank(userId)) {
				apiLogger.info("Received request to get order contact details for user: {}", userId);
				List<VehicleCheckoutContactDto> orderContactData = vehicleCartCheckoutService.getOrderContacts(userId);
				if (orderContactData != null && !orderContactData.isEmpty()) {
					response.put("success", true);
					response.put("message", "Order contact details retrieved successfully");
					response.put("data", orderContactData);
					return ResponseEntity.ok(response);
				}
				response.put("success", true);
				response.put("message", "No order contact details found");
				response.put("data", List.of());
				return ResponseEntity.ok(response);
			}
			response.put("success", false);
			response.put("message", "Invalid userId");
			response.put("data", List.of());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception ex) {
			apiLogger.error("Exception in getOrderContactDetails: {}", ex.getMessage(), ex);
			response.put("success", false);
			response.put("message", "Error retrieving order contact details");
			response.put("data", List.of());
			return ResponseEntity.internalServerError().body(response);
		}
	}

	@PostMapping("/order-contact")
	public ResponseEntity<Map<String, Object>> getOrderContactDetails(@RequestBody VehicleCheckoutContactDto dto) {
		Map<String, Object> response = new HashMap<>();
		try {
			if (dto != null && StringUtils.isNotBlank(dto.getUserId())) {
				apiLogger.info("Received request to save order contact details for user: {}", dto.getUserId());
				VehicleCheckoutContactDto orderContactData = vehicleCartCheckoutService.saveOrderContacts(dto);
				if (orderContactData != null) {
					response.put("success", true);
					response.put("message", "Order contact details saved successfully");
					response.put("data", orderContactData);
					return ResponseEntity.ok(response);
				}
				response.put("success", false);
				response.put("message", "Failed to save order contact details");
				response.put("data", List.of());
				return ResponseEntity.badRequest().body(response);
			}
			response.put("success", false);
			response.put("message", "Invalid request body");
			response.put("data", List.of());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception ex) {
			apiLogger.error("Exception in saveOrderContactDetails: {}", ex.getMessage(), ex);
			response.put("success", false);
			response.put("message", "Error saving order contact details");
			response.put("data", List.of());
			return ResponseEntity.internalServerError().body(response);
		}
	}

}