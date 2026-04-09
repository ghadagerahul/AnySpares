package com.sellerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.VehicleModelDetailsEntity;
import java.util.List;

@Repository
public interface VehicleModelsDetailsRepo extends JpaRepository<VehicleModelDetailsEntity, Long> {

	List<VehicleModelDetailsEntity> findByModelName(String modelName);

	@Query(value = """
			SELECT DISTINCT model_name FROM spare.vehicle_models_details WHERE model_name IS NOT NULL
			""", nativeQuery = true)
	List<String> findDistinctModels();

}
