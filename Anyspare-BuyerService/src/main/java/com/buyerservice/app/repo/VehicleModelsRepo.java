package com.buyerservice.app.repo;

import com.buyerservice.app.entity.VehicleModelDetailsEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface VehicleModelsRepo extends JpaRepository<VehicleModelDetailsEntity, Long> {

	List<VehicleModelDetailsEntity> findByBrandId(long brandId);
	
}
