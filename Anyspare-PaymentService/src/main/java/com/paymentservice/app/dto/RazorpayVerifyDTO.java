package com.paymentservice.app.dto;

import lombok.Data;

@Data
public class RazorpayVerifyDTO {

	private String razorpay_order_id;
	private String razorpay_payment_id;
	private String razorpay_signature;

}
