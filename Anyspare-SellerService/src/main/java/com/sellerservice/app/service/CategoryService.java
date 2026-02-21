package com.sellerservice.app.service;

import java.util.List;

import com.sellerservice.app.model.CategoryDto;
import com.sellerservice.app.model.CategoryResponseDto;
import com.sellerservice.app.model.ProductSummaryDto;



public interface CategoryService {

	public boolean addCategory(CategoryDto categoryDto);

	public boolean categoryExists(String categoryName);

	public List<CategoryResponseDto> getAllCategories();

	public void getCategoriesById();

	public boolean updateCategory(Long id, CategoryDto categoryRequest);

	public boolean deleteCategory(Long categoryId) throws Exception;

	public ProductSummaryDto getProductSummary();

}
