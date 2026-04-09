package com.buyerservice.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buyerservice.app.entity.VehicleProductEntiry;

@Repository
public interface VehicleProductRepo extends JpaRepository<VehicleProductEntiry, Long> {

	@Query(value = """
						SELECT *
			FROM hm_vehicle_products vd
			WHERE vd.model = :modelId
			  AND vd.vehicle_type = :vehicleType
			  AND vd.category = :category;
						""", nativeQuery = true)
	List<VehicleProductEntiry> loadProductsData(@Param("modelId") String modelId, @Param("category") String category,
			@Param("vehicleType") String vehicleType);
}
