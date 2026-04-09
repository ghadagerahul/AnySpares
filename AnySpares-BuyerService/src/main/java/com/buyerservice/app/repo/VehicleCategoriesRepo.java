package com.buyerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buyerservice.app.entity.VehicleCategoryEntity;
import java.util.List;

@Repository
public interface VehicleCategoriesRepo extends JpaRepository<VehicleCategoryEntity, Long> {

	List<VehicleCategoryEntity> findByCategoryForvehicletype(String categoryForvehicletype);

}
