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
@Table(name = "hm_twowheeler_products")
public class ProductEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long product_id;

	@Column(nullable = false)
	private String name;

	private String brand;
	private String model;
	private String category;
	private String status;
	private String type;

	private Double mrp;
	private Double price;

	private Integer stock;
	private Integer minQty;

	@Column(length = 2000)
	private String description;

	private String compatibleModels;

//	@ElementCollection
//	@CollectionTable(name = "product_compatible_models", joinColumns = @JoinColumn(name = "product_id"))
//	@Column(name = "compatible_model")
//	private List<String> compatibleModels = new ArrayList<>();

	private boolean warranty;

	private String productimage;

}
