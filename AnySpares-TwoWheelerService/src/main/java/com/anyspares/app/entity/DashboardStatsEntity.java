package com.anyspares.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "dashboard_stats")
public class DashboardStatsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long statsId;
	private String title;
	private Long value;
	private String color;

}
