package com.sellerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.VehicleBrandDetailsEntity;
import java.util.List;

@Repository
public interface VehicleBrandsDetailsRepo extends JpaRepository<VehicleBrandDetailsEntity, Long> {

	List<VehicleBrandDetailsEntity> findByBrandName(String brandName);

}
