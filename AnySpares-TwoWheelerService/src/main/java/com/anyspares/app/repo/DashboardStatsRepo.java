package com.anyspares.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.controller.entity.DashboardStatsEntity;

@Repository
public interface DashboardStatsRepo extends JpaRepository<DashboardStatsEntity, Long> {

}
