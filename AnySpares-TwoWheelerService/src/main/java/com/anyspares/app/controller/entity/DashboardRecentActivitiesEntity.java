package com.anyspares.app.controller.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "dashboard_rec_activities")
public class DashboardRecentActivitiesEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recActId;

	private String type;
	private String title;
	private String description;
	private String time;
	private String color;

}
