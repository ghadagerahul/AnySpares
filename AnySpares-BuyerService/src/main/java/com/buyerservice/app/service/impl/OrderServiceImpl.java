package com.buyerservice.app.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.buyerservice.app.constants.Constants;
import com.buyerservice.app.dto.VehicleOrderRequestDTO;
import com.buyerservice.app.dto.VehicleOrderResponseDTO;
import com.buyerservice.app.entity.OrderAddressEntity;
import com.buyerservice.app.entity.OrderContactEntity;
import com.buyerservice.app.entity.OrderEntity;
import com.buyerservice.app.entity.OrderItemsEntity;
import com.buyerservice.app.repo.OrderItemRepository;
import com.buyerservice.app.repo.OrderRepository;
import com.buyerservice.app.service.OrderService;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OrderServiceImpl implements OrderService {

	private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private OrderItemRepository orderItemRepository;

	@Override
	@Transactional
	public VehicleOrderResponseDTO createOrder(VehicleOrderRequestDTO request) {
		try {
			// Create Order entity
			OrderEntity order = new OrderEntity();
			order.setUserId(request.getUserId());
			order.setTotalAmount(request.getTotalAmount());
			order.setPaymentMethod(request.getPaymentMethod());
			order.setStatus("PENDING");

			// Set embedded address
			OrderAddressEntity address = new OrderAddressEntity();
			address.setName(request.getAddress().getName());
			address.setPhone(request.getAddress().getPhone());
			address.setStreet(request.getAddress().getStreet());
			address.setCity(request.getAddress().getCity());
			address.setState(request.getAddress().getState());
			address.setPincode(request.getAddress().getPincode());
			order.setAddress(address);

			// Set embedded contact
			OrderContactEntity contact = new OrderContactEntity();
			contact.setName(request.getContact().getName());
			contact.setPhone(request.getContact().getPhone());
			contact.setEmail(request.getContact().getEmail());
			order.setContact(contact);

			// Save order first to get ID
			OrderEntity savedOrder = orderRepository.save(order);

			// Create and save order items
			List<OrderItemsEntity> orderItems = request.getItems().stream().map(itemDTO -> {
				OrderItemsEntity item = new OrderItemsEntity();
				item.setOrder(savedOrder);
				item.setItemId(itemDTO.getProductId());
				item.setName(itemDTO.getProductName());
				item.setPrice(itemDTO.getPrice());
				item.setQuantity(itemDTO.getQuantity());
				item.setImageUrl(getImageNameFromUrl(itemDTO.getImageUrl()));
				return item;
			}).collect(Collectors.toList());

			orderItemRepository.saveAll(orderItems);

			// Update order with items
			savedOrder.setItems(orderItems);

			logger.info("Order created successfully for userId: {} with orderId: {}", request.getUserId(),
					savedOrder.getId());
			return new VehicleOrderResponseDTO(savedOrder.getId(), Constants.ORDER_PLACED, savedOrder.getTotalAmount(),
					savedOrder.getStatus());
		} catch (Exception ex) {
			logger.error("Error creating order for userId {}: {}", request != null ? request.getUserId() : null,
					ex.getMessage(), ex);
			return new VehicleOrderResponseDTO(null, "Failed to place order: " + ex.getMessage(), null, "FAILED");
		}
	}

	@Override
	public List<OrderEntity> getUserOrders(Long userId) {
		try {
			return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
		} catch (Exception ex) {
			logger.error("Error fetching orders for userId {}: {}", userId, ex.getMessage(), ex);
			return List.of();
		}
	}

	@Override
	public OrderEntity getOrderById(Long orderId) {
		try {
			return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		} catch (Exception ex) {
			logger.error("Error fetching order by id {}: {}", orderId, ex.getMessage(), ex);
			throw new RuntimeException("Order not found");
		}
	}

	public String getImageNameFromUrl(String url) {
		if (url == null || url.isEmpty()) {
			return null;
		}
		String path = url.split("\\?")[0];
		return path.substring(path.lastIndexOf("/") + 1);
	}

	@Override
	public void updateOrderStatus(Long orderId, String status) {
		// TODO Auto-generated method stub

	}

}