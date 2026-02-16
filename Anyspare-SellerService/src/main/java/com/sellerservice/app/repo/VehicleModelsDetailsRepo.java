package com.sellerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.VehicleModelDetailsEntity;
import java.util.List;


@Repository
public interface VehicleModelsDetailsRepo extends JpaRepository<VehicleModelDetailsEntity, Long> {

	List<VehicleModelDetailsEntity> findByModelName(String modelName);
	
}
