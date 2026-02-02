package com.anyspares.app.model;

import lombok.Data;

@Data
public class ProductSummaryDto {

	private Integer total;
	private Integer active;
	private Integer outOfStock;

}
