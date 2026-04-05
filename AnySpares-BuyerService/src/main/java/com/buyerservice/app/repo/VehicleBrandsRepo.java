package com.buyerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buyerservice.app.entity.VehicleBrandDetailsEntity;
import java.util.List;

@Repository
public interface VehicleBrandsRepo extends JpaRepository<VehicleBrandDetailsEntity, Long> {

	List<VehicleBrandDetailsEntity> findByVehicleCategory(String vehicleCategory);

}
