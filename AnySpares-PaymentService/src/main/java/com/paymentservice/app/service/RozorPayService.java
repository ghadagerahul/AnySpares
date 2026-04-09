package com.paymentservice.app.service;

import com.paymentservice.app.dto.RazorpayOrderRequestDTO;
import com.razorpay.Order;

public interface RozorPayService {

	public Order createOrder(RazorpayOrderRequestDTO dto);

}
