package com.auth.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auth.app.entiry.UserDetails;
import java.util.List;

@Repository
public interface AuthenticationService extends JpaRepository<UserDetails, Long> {

	List<UserDetails> findByMobileNo(Long mobileNo);
}
