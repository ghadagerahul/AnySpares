package com.buyerservice.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class OrderContactEntity {
	@Column(name = "contact_name", nullable = false)
	private String name;

	@Column(name = "contact_phone", nullable = false)
	private String phone;

	@Column(name = "email", nullable = false)
	private String email;
}