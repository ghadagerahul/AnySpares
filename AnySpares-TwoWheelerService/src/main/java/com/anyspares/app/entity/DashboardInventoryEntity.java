package com.anyspares.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "dashboard_inventory")
public class DashboardInventoryEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long invId;

	private String vehicleType;

	private Long totalProducts;

	private String color;

}
