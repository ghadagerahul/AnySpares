package com.anyspares.app.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@jakarta.persistence.Entity
@Data
@Table(name = "DemoTable")
@AllArgsConstructor
@NoArgsConstructor
public class Entity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String name;

}
