package com.sellerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sellerservice.app.entity.DashboardStatsEntity;


@Repository
public interface DashboardStatsRepo extends JpaRepository<DashboardStatsEntity, Long> {

}
