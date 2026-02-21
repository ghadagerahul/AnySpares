package com.sellerservice.app.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.ProductEntity;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

	List<ProductEntity> getByCategory(String CategoryTYpe);

	@Query(value = "SELECT DISTINCT brand FROM spare.hm_vehicle_products WHERE brand IS NOT NULL", nativeQuery = true)
	List<String> findDistinctBrands();

	@Query(value = "SELECT DISTINCT model FROM spare.hm_vehicle_products WHERE model IS NOT NULL", nativeQuery = true)
	List<String> findDistinctModels();

	@Query(value = "SELECT COUNT(*) FROM  spare.hm_vehicle_products", nativeQuery = true)
	Integer getProductSummary();

	@Query(value = "SELECT COUNT(*) FROM  spare.hm_vehicle_products where status = :prodStatus", nativeQuery = true)
	Integer getProductSummaryByStatus(@Param("prodStatus") String prodStatus);

	Optional<ProductEntity> findByNameAndBrandAndModelAndMrp(String name, String brand, String model, double mrp);

}
