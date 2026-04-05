package com.paymentservice.app.service.impl;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paymentservice.app.dto.RazorpayOrderRequestDTO;
import com.paymentservice.app.service.RozorPayService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class RozorPayServiceimpl implements RozorPayService {

	@Autowired
	private RazorpayClient rzpClient;

	Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public Order createOrder(RazorpayOrderRequestDTO dto) {

		try {
			logger.info("RozorPayServiceimpl-createOrder-->dto: " + dto);
			JSONObject jsonObject = new JSONObject(dto);
			Order order = rzpClient.orders.create(jsonObject);
			logger.info("Line-31::order: " + order);
			return order;
		} catch (RazorpayException e) {
			e.printStackTrace();
		}
		return null;
	}

}
