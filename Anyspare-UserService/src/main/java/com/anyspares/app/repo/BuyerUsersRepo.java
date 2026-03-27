package com.anyspares.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.BuyerUserDetails;

@Repository
public interface BuyerUsersRepo extends JpaRepository<BuyerUserDetails, Long> {

	List<BuyerUserDetails> findByMobileNo(Long mobileNo);

}