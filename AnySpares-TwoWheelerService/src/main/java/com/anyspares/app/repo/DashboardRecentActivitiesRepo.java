package com.anyspares.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.DashboardRecentActivitiesEntity;

@Repository
public interface DashboardRecentActivitiesRepo extends JpaRepository<DashboardRecentActivitiesEntity, Long> {

}
