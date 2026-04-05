package com.paymentservice.app.dto;

import lombok.Data;

@Data
public class RazorpayOrderRequestDTO {

	private int amount;
	private String currency;
	private String receipt;

}
