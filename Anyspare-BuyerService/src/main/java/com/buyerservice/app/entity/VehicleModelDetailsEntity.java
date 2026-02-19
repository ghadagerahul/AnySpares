package com.buyerservice.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "vehicle_models_details")
public class VehicleModelDetailsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long modelId;

	private Long brandId;
	private String brandName;
	private String vehicleCategory;
	private String modelName;
	private Integer modelYearFrom;
	private Integer modelYearTo;
	private String modelImage;

}
