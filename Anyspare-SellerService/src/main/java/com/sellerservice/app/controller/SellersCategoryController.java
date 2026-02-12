package com.sellerservice.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sellerservice.app.entity.CategoryEntity;
import com.sellerservice.app.model.CategoryDto;
import com.sellerservice.app.model.ProductSummaryDto;
import com.sellerservice.app.service.CategoryService;

@RestController
@RequestMapping("/seller/categories")
public class SellersCategoryController {

	@Autowired
	private CategoryService categoryService;

	@GetMapping("/getAll")
	public ResponseEntity<Map<String, Object>> getAllSellerCategories() {

		Map<String, Object> response = new HashMap<>();

		try {
			List<CategoryDto> categories = categoryService.getAllCategories();

			response.put("success", true);
			response.put("message", "Categories fetched successfully");
			response.put("data", categories);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error fetching categories");
			response.put("data", List.of());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@GetMapping("/getSummary")
	public ResponseEntity<Map<String, Object>> getProductSummary() {

		Map<String, Object> response = new HashMap<>();

		try {
			ProductSummaryDto summary = categoryService.getProductSummary();

			response.put("success", true);
			response.put("message", "Categories fetched successfully");
			response.put("data", summary);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error fetching categories");
			response.put("data", List.of());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * Add new category
	 */
	@PostMapping("/add")
	public ResponseEntity<Map<String, Object>> addCategory(@RequestBody CategoryDto categoryDto) {

		// Basic validation
		if (categoryDto == null || categoryDto.getName() == null || categoryDto.getName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Category name is required"));
		}

		if (categoryDto.getDescription() == null || categoryDto.getDescription().trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Description is required"));
		}

		// Duplicate check
		if (categoryService.categoryExists(categoryDto.getName())) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of("success", false, "message", "Category already exists"));
		}

		categoryService.addCategory(categoryDto);

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(Map.of("success", true, "message", "Category added successfully"));
	}

	/**
	 * Update category
	 */
	@PutMapping("/update/{id}")
	public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable Long id,
			@RequestBody CategoryDto categoryRequest) {
		try {
			boolean updatedCategory = categoryService.updateCategory(id, categoryRequest);
			if (updatedCategory) {
				Map<String, Object> response = new HashMap<>();
				response.put("success", true);
				response.put("message", "Category updated successfully");
				response.put("data", updatedCategory);
				return ResponseEntity.ok(response);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("success", false, "message", "Category not found"));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("success", false, "message", "Error updating category: " + e.getMessage()));
		}
	}

	/**
	 * Delete category
	 */
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
		try {
			boolean isDeleted = categoryService.deleteCategory(id);
			if (isDeleted) {
				return ResponseEntity.ok(Map.of("success", true, "message", "Category deleted successfully"));
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("success", false, "message", "Category not found"));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("success", false, "message", "Error deleting category: " + e.getMessage()));
		}
	}

	/**
	 * Search categories by name
	 * 
	 */
	@GetMapping("/search")
	public ResponseEntity<Map<String, Object>> searchCategories(@RequestParam String query) {
		try {
			List<CategoryEntity> categories = null; // categoryService.searchCategories(query);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Categories search completed");
			response.put("data", categories);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("success", false, "message", "Error searching categories"));
		}
	}
}
