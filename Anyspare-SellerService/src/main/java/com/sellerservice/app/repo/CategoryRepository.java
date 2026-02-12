package com.sellerservice.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.CategoryEntity;

import jakarta.transaction.Transactional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

	boolean existsByName(String name);

	@Query(value = "SELECT DISTINCT name FROM spare.hm_product_category WHERE name IS NOT NULL", nativeQuery = true)
	List<String> findDistinctCategories();

	@Modifying
	@Transactional
	@Query(value = """
			UPDATE spare.hm_product_category c
			SET total_products = (
			    SELECT COUNT(*)
			    FROM spare.hm_twowheeler_products p
			    WHERE p.category = c.name
			      AND p.status = 'Active'
			)
			WHERE c.name = :category
			""", nativeQuery = true)
	int updateTotalProducts(@Param("category") String category);

}
