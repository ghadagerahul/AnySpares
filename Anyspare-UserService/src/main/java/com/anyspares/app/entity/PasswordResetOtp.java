package com.anyspares.app.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "SPARE_OTP_TRACKING")
public class PasswordResetOtp {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long userId;

	@Column(length = 10)
	private String otp;

	private Long mobileNo;

	private String email;

	private LocalDateTime createdAt;

	private LocalDateTime expiresAt;

	private String isUsed;

}
