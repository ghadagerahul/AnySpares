package com.sellerservice.app.service;

import java.util.List;

import com.sellerservice.app.entity.DashboardInventoryEntity;
import com.sellerservice.app.entity.DashboardRecentActivitiesEntity;
import com.sellerservice.app.entity.DashboardStatsEntity;


public interface DashboardService {

	public List<DashboardStatsEntity> loadStatsData();

	public List<DashboardInventoryEntity> loadInventoryData();

	public List<DashboardRecentActivitiesEntity> loadRecentActivities();

}
