package com.anyspares.app.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.PasswordResetOtp;

@Repository
public interface PasswordResetOtpRepo extends JpaRepository<PasswordResetOtp, Long> {

	Optional<PasswordResetOtp> findTopByUserIdOrderByCreatedAtDesc(Long sellerUserId);

	@Query(value = """
			SELECT * FROM spare_otp_tracking
			WHERE user_id = :userId
			AND mobile_no = :mobileNo
			AND is_used = :isUsed
			ORDER BY created_at DESC
			LIMIT 1
			""", nativeQuery = true)
	PasswordResetOtp findLatestUserIssuedOtp(@Param("userId") Long userId, @Param("mobileNo") Long mobileNo,
			@Param("isUsed") String isUsed);

	@Query(value = """
			SELECT * FROM spare_otp_tracking
			WHERE mobile_no = :mobileNo
			AND otp = :otp """, nativeQuery = true)
	PasswordResetOtp checkOtpVerified(String mobileNo, String otp);
}
