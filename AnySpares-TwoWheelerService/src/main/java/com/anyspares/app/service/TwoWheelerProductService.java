package com.anyspares.app.service;

import java.util.List;
import java.util.Map;

import com.anyspares.app.entity.ProductEntity;
import com.anyspares.app.model.ProductDto;

public interface TwoWheelerProductService {

	public boolean addProduct(ProductDto productDto);

	public List<ProductEntity> getProductsByCategoryType(String categoryType);

	public Map<String, List<String>> getProductCategoriesList();

	public boolean updateProduct(ProductDto dto, String productId);

	public ProductEntity getProductByProductId(String productId);

}
