package com.paymentservice.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Configuration
public class RozorPayConfig {

	@Value("${razorpay.key.id}")
	private String apikey;

	@Value("${razorpay.key.secret}")
	private String secretKey;

	@Bean
	public RazorpayClient razorpayClient() throws RazorpayException {

		RazorpayClient razorpayClient = new RazorpayClient(apikey, secretKey);
		return razorpayClient;
	}

}
