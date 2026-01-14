package com.anyspares.app.service;

import java.util.List;

import com.anyspares.app.entity.DashboardInventoryEntity;
import com.anyspares.app.entity.DashboardRecentActivitiesEntity;
import com.anyspares.app.entity.DashboardStatsEntity;

public interface DashboardService {

	public List<DashboardStatsEntity> loadStatsData();

	public List<DashboardInventoryEntity> loadInventoryData();

	public List<DashboardRecentActivitiesEntity> loadRecentActivities();

}
