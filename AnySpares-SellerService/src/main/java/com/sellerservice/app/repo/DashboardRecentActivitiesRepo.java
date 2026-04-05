package com.sellerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.DashboardRecentActivitiesEntity;


@Repository
public interface DashboardRecentActivitiesRepo extends JpaRepository<DashboardRecentActivitiesEntity, Long> {

}
