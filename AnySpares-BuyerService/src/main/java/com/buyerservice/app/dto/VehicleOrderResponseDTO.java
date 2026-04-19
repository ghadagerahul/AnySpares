package com.buyerservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VehicleOrderResponseDTO {

	private Long orderId;
	private String message;
	private Double totalAmount;
	private String status;
}
