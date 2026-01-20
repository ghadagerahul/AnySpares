package com.anyspares.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.CategoryEntity;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

	boolean existsByName(String name);

	@Query(value = "SELECT DISTINCT name FROM spare.hm_product_category WHERE name IS NOT NULL", nativeQuery = true)
	List<String> findDistinctCategories();

}
