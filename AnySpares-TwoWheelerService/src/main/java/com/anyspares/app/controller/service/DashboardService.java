package com.anyspares.app.controller.service;

import java.util.List;

import com.anyspares.app.controller.entity.DashboardInventoryEntity;
import com.anyspares.app.controller.entity.DashboardRecentActivitiesEntity;
import com.anyspares.app.controller.entity.DashboardStatsEntity;

public interface DashboardService {

	public List<DashboardStatsEntity> loadStatsData();

	public List<DashboardInventoryEntity> loadInventoryData();

	public List<DashboardRecentActivitiesEntity> loadRecentActivities();

}
