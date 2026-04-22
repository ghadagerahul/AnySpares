package com.buyerservice.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "product_order_items")
@Data
public class OrderItemsEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id", nullable = false)
	private OrderEntity order;

	@Column(name = "item_id", nullable = false)
	private String itemId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "price", nullable = false)
	private double price;

	@Column(name = "quantity", nullable = false)
	private Integer quantity;

	@Column(name = "image_url")
	private String imageUrl;
}