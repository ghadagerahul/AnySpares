package com.anyspares.app.controller.service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.controller.entity.DashboardInventoryEntity;
import com.anyspares.app.controller.entity.DashboardRecentActivitiesEntity;
import com.anyspares.app.controller.entity.DashboardStatsEntity;
import com.anyspares.app.controller.service.DashboardService;
import com.anyspares.app.repo.DashboardInventoryRepo;
import com.anyspares.app.repo.DashboardRecentActivitiesRepo;
import com.anyspares.app.repo.DashboardStatsRepo;

@Service
public class DashboardServiceImpl implements DashboardService {

	@Autowired
	private DashboardStatsRepo dashboardStatsRepo;

	@Autowired
	private DashboardInventoryRepo dashboardInventoryRepo;

	@Autowired
	private DashboardRecentActivitiesRepo activitiesRepo;

	@Override
	public List<DashboardStatsEntity> loadStatsData() {
		// TODO Auto-generated method stub
		List<DashboardStatsEntity> statsList = dashboardStatsRepo.findAll();

		return statsList;
	}

	@Override
	public List<DashboardInventoryEntity> loadInventoryData() {
		// TODO Auto-generated method stub
		List<DashboardInventoryEntity> inventoryList = dashboardInventoryRepo.findAll();
		
		return inventoryList;
	}

	@Override
	public List<DashboardRecentActivitiesEntity> loadRecentActivities() {
		// TODO Auto-generated method stub

		List<DashboardRecentActivitiesEntity> recActiviriesList = activitiesRepo.findAll();
		
		return recActiviriesList;
		
	}

}
