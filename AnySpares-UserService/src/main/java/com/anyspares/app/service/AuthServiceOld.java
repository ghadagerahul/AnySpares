package com.anyspares.app.service;

import com.anyspares.app.dto.SellerUserRegistrationDto;
import com.anyspares.app.payload.request.UserDetails;
import com.anyspares.app.dto.UserRegistrationDto;
import com.anyspares.app.entity.SellerUserDetails;

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

public interface AuthServiceOld {

	/**
	 * Registers a new user in the system.
	 *
	 * @param user model object containing user input data
	 * @return saved {@link UserDetails} entity, or {@code null} if save fails
	 */
	public boolean registerNewUser(UserRegistrationDto user);

	/**
	 * Checks if a user exists in the system by mobile number.
	 *
	 * @param mobileno mobile number to check
	 * @param userType 
	 * @return {@code true} if user exists, otherwise {@code false}
	 */
	public boolean isUserPresent(Long mobileno, String userType);

	public SellerUserDetails registerSellerUser(SellerUserRegistrationDto userdetails);

	public boolean isUSellerserPresent(Long mobileno, String pwd);

	public SellerUserDetails finduserByMobileNumber(Long mobileno);

	public boolean generateSellerForgetPasswordOtp(String emailIdStr, Long mobileNo);

	public boolean generateBuyerForgetPasswordOtp(String emailIdStr, Long mobileNo);

	public boolean verifySellerForgetPasswordOtp(String mobileNo, String otp);

	public boolean verifyBuyerForgetPasswordOtp(String mobileNo, String otp);

	public boolean resetBuyerPassword(String mobileNo, String otp, String newPassword);

	public boolean resetSellerPassword(String mobileNo, String otp, String newPassword);

	public boolean validateUserLogin(UserDetails details);

}
