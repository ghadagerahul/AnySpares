package com.sellerservice.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sellerservice.app.entity.DashboardInventoryEntity;
import com.sellerservice.app.entity.DashboardRecentActivitiesEntity;
import com.sellerservice.app.entity.DashboardStatsEntity;
import com.sellerservice.app.repo.DashboardInventoryRepo;
import com.sellerservice.app.repo.DashboardRecentActivitiesRepo;
import com.sellerservice.app.repo.DashboardStatsRepo;
import com.sellerservice.app.service.DashboardService;



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
