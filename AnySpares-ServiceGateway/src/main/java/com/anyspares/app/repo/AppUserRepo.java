package com.anyspares.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.UserDetails;
import java.util.List;

@Repository
public interface AppUserRepo extends JpaRepository<UserDetails, Long> {

	List<UserDetails> findByMobileNo(Long mobileNo);

}
