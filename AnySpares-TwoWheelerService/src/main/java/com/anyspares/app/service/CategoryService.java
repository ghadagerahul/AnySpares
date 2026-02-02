package com.anyspares.app.service;

import java.util.List;

import com.anyspares.app.entity.CategoryEntity;
import com.anyspares.app.model.CategoryDto;
import com.anyspares.app.model.ProductSummaryDto;

public interface CategoryService {

	public boolean addCategory(CategoryDto categoryDto);

	public boolean categoryExists(String categoryName);

	public List<CategoryDto> getAllCategories();

	public void getCategoriesById();

	public boolean updateCategory(Long id, CategoryDto categoryRequest);

	public boolean deleteCategory(Long categoryId) throws Exception;

	public ProductSummaryDto getProductSummary();

}
