package com.anyspares.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.BuyerUserDetails;
import com.anyspares.app.entity.PasswordResetOtp;

@Repository
public interface BuyerUsersRepo extends JpaRepository<BuyerUserDetails, Long> {

	List<BuyerUserDetails> findByMobileNo(Long mobileNo);

	List<BuyerUserDetails> findByEmailId(String emailId);

	@Modifying
	@Query(value = """
			UPDATE buyer_user_details
			SET password = :newPassword
			WHERE mobile_no = :mobileNo
			AND id = :userId
			""", nativeQuery = true)
	int updatePasswordByMobileNo(@Param("mobileNo") String mobileNo, @Param("userId") Long userId,
			@Param("newPassword") String newPassword);
}