package com.anyspares.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.controller.entity.DashboardInventoryEntity;

@Repository
public interface DashboardInventoryRepo extends JpaRepository<DashboardInventoryEntity, Long> {

}
