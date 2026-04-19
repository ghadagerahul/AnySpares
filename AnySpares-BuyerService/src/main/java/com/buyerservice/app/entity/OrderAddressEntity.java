package com.buyerservice.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class OrderAddressEntity {

	@Column(name = "address_name", nullable = false)
	private String name;

	@Column(name = "address_phone", nullable = false)
	private String phone;

	@Column(name = "street", nullable = false)
	private String street;

	@Column(name = "city", nullable = false)
	private String city;

	@Column(name = "state", nullable = false)
	private String state;

	@Column(name = "pincode", nullable = false)
	private String pincode;
}