package com.anyspares.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Seller_Usr_Details")
public class SellerUserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String businesstName;
	private String ownerName;
	@Column(unique = true)
	private Long mobileNo;
	private String emailAddress;
	private String gstNumber;
	private String completeAddress;
	private String city;
	private String pincode;
	private String vehicleType;
	private String password;
}
