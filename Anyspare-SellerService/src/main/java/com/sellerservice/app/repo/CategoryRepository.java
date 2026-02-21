package com.sellerservice.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sellerservice.app.entity.CategoryEntity;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

	// ✔ Matches entity field: categoryName
	boolean existsByCategoryName(String categoryName);

	// ✔ Native query can still use DB column names
	@Query(value = "SELECT DISTINCT category_Name FROM hm_product_category WHERE category_Name IS NOT NULL", nativeQuery = true)
	List<String> findDistinctCategories();

	// ✔ Update total products safely
	@Modifying
	@Transactional
	@Query(value = """
			UPDATE hm_product_category c
			SET total_products = (
			    SELECT COUNT(*)
			    FROM hm_vehicle_products p
			    WHERE p.category = c.category_Name
			      AND p.status = 'Active'
			)
			WHERE c.category_Name =  :categoryName
			""", nativeQuery = true)
	int updateTotalProducts(@Param("categoryName") String categoryName);
}