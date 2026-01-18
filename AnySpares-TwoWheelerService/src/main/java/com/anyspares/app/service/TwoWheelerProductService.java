package com.anyspares.app.service;

import java.util.List;

import com.anyspares.app.entity.ProductEntity;
import com.anyspares.app.model.ProductDto;

public interface TwoWheelerProductService {

	public boolean addProduct(ProductDto productDto);

	public List<ProductEntity> getProductsByCategoryType(String categoryType);

}
