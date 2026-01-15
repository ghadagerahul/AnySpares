package com.anyspares.app.service.Impl;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.entity.CategoryEntity;
import com.anyspares.app.model.CategoryDto;
import com.anyspares.app.repo.CategoryRepository;
import com.anyspares.app.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public boolean addCategory(CategoryDto categoryDto) {

		if (categoryDto == null) {
			return false;
		}

		CategoryEntity entity = new CategoryEntity();
		entity.setName(categoryDto.getName());
		entity.setDescription(categoryDto.getDescription());
		entity.setIcon(categoryDto.getIcon());
		entity.setColor(categoryDto.getColor());
		entity.setImage(categoryDto.getImage());
		entity.setTotalProducts(categoryDto.getTotalProducts());

		CategoryEntity savedEntity = categoryRepository.save(entity);

		return savedEntity != null && savedEntity.getCategoryId() != null;
	}

	@Override
	public boolean categoryExists(String categoryName) {

		if (categoryName == null || categoryName.trim().isEmpty()) {
			return false;
		}

		return categoryRepository.existsByName(categoryName.trim());
	}

	@Override
	public List<CategoryDto> getAllCategories() {

		List<CategoryEntity> entities = categoryRepository.findAll();

		if (entities.isEmpty()) {
			return Collections.emptyList();
		}

		return entities.stream().map(entity -> {
			CategoryDto dto = new CategoryDto();
			dto.setCategoryId(entity.getCategoryId());
			dto.setName(entity.getName());
			dto.setDescription(entity.getDescription());
			dto.setIcon(entity.getIcon());
			dto.setColor(entity.getColor());
			dto.setImage(entity.getImage());
			dto.setTotalProducts(entity.getTotalProducts());
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public void getCategoriesById() {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean updateCategory(Long id, CategoryDto categoryRequest) {

		if (id == null || categoryRequest == null) {
			return false;
		}

		return categoryRepository.findById(id).map(existingCategory -> {
			existingCategory.setName(categoryRequest.getName());
			existingCategory.setDescription(categoryRequest.getDescription());
			existingCategory.setIcon(categoryRequest.getIcon());
			existingCategory.setColor(categoryRequest.getColor());
			existingCategory.setImage(categoryRequest.getImage());
			existingCategory.setTotalProducts(categoryRequest.getTotalProducts());

			categoryRepository.save(existingCategory);
			return true;
		}).orElse(false);
	}

	@Override
	public boolean deleteCategory(Long categoryId) throws Exception {

		if (categoryId == null) {
			throw new IllegalArgumentException("Category id must not be null");
		}

		if (!categoryRepository.existsById(categoryId)) {
			return false;
		}

		categoryRepository.deleteById(categoryId);
		return true;
	}

}
