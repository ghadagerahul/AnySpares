package com.buyerservice.app.dto;

import java.util.List;

import lombok.Data;

@Data
public class VehicleOrderRequestDTO {
	private Long userId;
	private List<VehicleOrderItemDTO> items;
	private VehicleOrderAddressDTO address;
	private VehicleOrderContactDTO contact;
	private String paymentMethod;
	private double totalAmount;
}
