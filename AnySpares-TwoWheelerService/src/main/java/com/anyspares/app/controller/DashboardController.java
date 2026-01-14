package com.anyspares.app.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.entity.DashboardInventoryEntity;
import com.anyspares.app.entity.DashboardRecentActivitiesEntity;
import com.anyspares.app.entity.DashboardStatsEntity;
import com.anyspares.app.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

	@Autowired
	private DashboardService dashboardService;

	Logger logger = LoggerFactory.getLogger(getClass());

	@GetMapping("/stats")
	public ResponseEntity<List<DashboardStatsEntity>> loadStatsData() {
		List<DashboardStatsEntity> statsData = null;
		try {
			statsData = dashboardService.loadStatsData();
			logger.info("loadStatsData-statsData: " + statsData);
			return ResponseEntity.ok(statsData);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}

	}

	@GetMapping("/inventory")
	public ResponseEntity<List<DashboardInventoryEntity>> loadInventoryData() {

		List<DashboardInventoryEntity> inventoryData = null;

		try {
			inventoryData = dashboardService.loadInventoryData();

			return ResponseEntity.ok(inventoryData);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}

	}

	@GetMapping("/recentActivities")
	public ResponseEntity<List<DashboardRecentActivitiesEntity>> loadRecentActivities() {

		List<DashboardRecentActivitiesEntity> recentActivities = null;

		try {
			recentActivities = dashboardService.loadRecentActivities();
			return ResponseEntity.ok(recentActivities);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().build();

		}

	}

}
