package com.anyspares.app.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.controller.model.SellerUserDetailsModel;
import com.anyspares.app.controller.model.UserDetailsModel;
import com.anyspares.app.entity.SellerUserDetails;
import com.anyspares.app.entity.UserDetails;
import com.anyspares.app.repo.AppUserRepo;

/**
 * Service layer for managing user operations such as registration and user
 * existence checks.
 *
 * <p>
 * This service acts as an intermediate layer between the controller and
 * repository, handling business logic and database interactions related to
 * {@link UserDetails}.
 * </p>
 * 
 * @author rahul
 * @see 21-09-2025
 */
public interface AppUserService {

	/**
	 * Registers a new user in the system.
	 *
	 * @param userdetails model object containing user input data
	 * @return saved {@link UserDetails} entity, or {@code null} if save fails
	 */
	public UserDetails registerNewUser(UserDetailsModel userdetails);

	/**
	 * Checks if a user exists in the system by mobile number.
	 *
	 * @param mobileno mobile number to check
	 * @return {@code true} if user exists, otherwise {@code false}
	 */
	public boolean isUserPresent(Long mobileno);

	public SellerUserDetails registerSellerUser(SellerUserDetailsModel userdetails);

	public boolean isUSellerserPresent(Long mobileno, String pwd);

	public SellerUserDetails finduserByMobileNumber(Long mobileno);

}