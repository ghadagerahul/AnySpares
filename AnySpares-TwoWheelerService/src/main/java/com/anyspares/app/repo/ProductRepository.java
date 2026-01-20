package com.anyspares.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.ProductEntity;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

	List<ProductEntity> getByCategory(String CategoryTYpe);

	@Query(value = "SELECT DISTINCT brand FROM spare.hm_twowheeler_products WHERE brand IS NOT NULL", nativeQuery = true)
	List<String> findDistinctBrands();

	@Query(value = "SELECT DISTINCT model FROM spare.hm_twowheeler_products WHERE model IS NOT NULL", nativeQuery = true)
	List<String> findDistinctModels();

}
