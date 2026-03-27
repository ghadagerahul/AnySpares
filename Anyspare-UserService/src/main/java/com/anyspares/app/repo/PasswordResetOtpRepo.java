package com.anyspares.app.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.PasswordResetOtp;

@Repository
public interface PasswordResetOtpRepo extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopBySellerUserIdOrderByCreatedAtDesc(Long sellerUserId);

}
