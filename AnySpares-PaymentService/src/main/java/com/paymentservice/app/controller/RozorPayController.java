package com.paymentservice.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.paymentservice.app.dto.RazorpayOrderRequestDTO;
import com.paymentservice.app.dto.RazorpayVerifyDTO;
import com.paymentservice.app.service.RozorPayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

/**
 * REST Controller responsible for handling Razorpay payment operations.
 *
 * <p>
 * This controller exposes APIs to:
 * <ul>
 * <li>Create a Razorpay order</li>
 * <li>Verify Razorpay payment signature after payment completion</li>
 * </ul>
 *
 * <p>
 * These APIs are typically called from the frontend (Angular/React) during the
 * payment flow.
 *
 * Base URL: /rozorpay
 *
 * @author Rahul
 */
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET,
		RequestMethod.POST })
@RestController
@RequestMapping("/rozorpay")
public class RozorPayController {

	@Autowired
	private RozorPayService payService;

	@Value("${razorpay.key.secret}")
	private String secretKey;

	/**
	 * API to create a Razorpay order.
	 *
	 * <p>
	 * This API is called before opening Razorpay Checkout on frontend. Razorpay
	 * order ID returned from this API is required to initiate payment.
	 *
	 * @param dto Contains order details such as amount, currency, and receipt
	 * @return Razorpay Order details as JSON string
	 */
	@PostMapping("/create-order")
	public ResponseEntity<String> orderRequest(@RequestBody RazorpayOrderRequestDTO dto) {

		Order order = payService.createOrder(dto);

		System.out.println("@@@@@@@@@@@@@@@order: " + order);

		return ResponseEntity.ok(order.toString());
	}

	/**
	 * API to verify Razorpay payment after successful checkout.
	 *
	 * <p>
	 * Razorpay sends payment_id, order_id, and signature to frontend. Frontend
	 * forwards these values to this API for verification.
	 *
	 * <p>
	 * Signature verification ensures that the payment was not tampered with.
	 *
	 * @param dto Contains Razorpay order ID, payment ID, and signature
	 * @return Payment verification status
	 */
	@PostMapping("/verify")
	public ResponseEntity<Map<String, String>> verifyPaymentRequest(@RequestBody RazorpayVerifyDTO dto) {

		try {
			String data = dto.getRazorpay_order_id() + "|" + dto.getRazorpay_payment_id();

			boolean isValid = Utils.verifySignature(data, dto.getRazorpay_signature(), secretKey);

			if (isValid) {
				return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Payment verified"));
			}

			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("status", "FAILED", "message", "Invalid signature"));

		} catch (RazorpayException e) {
			e.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("status", "ERROR", "message", e.getMessage()));
		}
	}
}
