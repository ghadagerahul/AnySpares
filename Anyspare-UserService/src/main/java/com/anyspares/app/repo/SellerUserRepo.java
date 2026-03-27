package com.anyspares.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.SellerUserDetails;

@Repository
public interface SellerUserRepo extends JpaRepository<SellerUserDetails, Long> {

	List<SellerUserDetails> findByMobileNo(Long mobileNo);

	List<SellerUserDetails> findByEmailAddress(String emailAddress);

}