package com.buyerservice.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "vehicles_mybucket_items")
@Data
@ToString(exclude = "bucket")
@EqualsAndHashCode(exclude = "bucket")
public class MyBucketItemEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long productId;

	private long quantity;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bucket_id")
	@JsonBackReference
	private MyBucketEntity bucket;
}
