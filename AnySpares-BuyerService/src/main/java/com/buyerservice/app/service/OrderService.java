package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleOrderRequestDTO;
import com.buyerservice.app.dto.VehicleOrderResponseDTO;
import com.buyerservice.app.entity.OrderEntity;

public interface OrderService {

	List<OrderEntity> getUserOrders(Long userId);

	VehicleOrderResponseDTO createOrder(VehicleOrderRequestDTO request);

	OrderEntity getOrderById(Long orderId);

	void updateOrderStatus(Long orderId, String status);

}
