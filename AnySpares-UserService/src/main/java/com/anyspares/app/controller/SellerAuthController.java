package com.anyspares.app.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.dto.ForgotPasswordRequestDto;
import com.anyspares.app.dto.SellerLoginDto;
import com.anyspares.app.dto.SellerUserRegistrationDto;
import com.anyspares.app.entity.SellerUserDetails;
import com.anyspares.app.entity.UserOtpDto;
import com.anyspares.app.service.AuthService;

@RestController
@RequestMapping("/sellerAuth")
public class SellerAuthController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private AuthService appUserService;

	/**
	 * Registers a new user.
	 *
	 * @param user registration details
	 * @return success or failure response
	 */
	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody SellerUserRegistrationDto user) {
		logger.debug("registerUser- user: " + user);

		Map<String, Object> response = new HashMap<>();

		if (null != user) {

			Long mobileNo = user.getMobileNo();

			if (appUserService.isUSellerserPresent(mobileNo, user.getPassword())) {
				response.put("success", true);
				response.put("message", "User Already Present");
				return ResponseEntity.ok(response);
			}

			if (StringUtils.isNotBlank(user.getBusinesstName()) && StringUtils.isNotBlank(user.getPassword())) {
				SellerUserDetails save = appUserService.registerSellerUser(user);
				if (null != save) {
					response.put("success", true);
					response.put("message", "Registration successful");
					return ResponseEntity.ok(response);
				}
			}
		}

		response.put("success", false);
		response.put("message", "Registration Failed");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	/**
	 * Logs in an existing user.
	 *
	 * @param details login credentials
	 * @return success or failure response
	 */
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> loginWithExistingUser(@RequestBody SellerLoginDto details) {
		logger.debug("loginWithExistingUser- details: " + details);
		Map<String, Object> response = new HashMap<>();
		if (null != details) {

			Long mobileNo = details.getMobileNumber();
			boolean sellerserPresent = appUserService.isUSellerserPresent(mobileNo, details.getPassword());

			if (sellerserPresent) {
				response.put("success", true);
				response.put("message", "Login successful");
				response.put("user", appUserService.finduserByMobileNumber(mobileNo));
				return ResponseEntity.ok(response);

			}
		}
		response.put("success", false);
		response.put("message", "Invalid login");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}


	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequestDto request) {

		if (logger.isDebugEnabled()) {
			logger.debug("forgotPassword - request: {}", request);
		}

		Map<String, Object> response = new HashMap<>();

		if (request == null || StringUtils.isBlank(request.getEmailOrMobile())) {
			response.put("success", false);
			response.put("message", "Email or Mobile is required");
			return ResponseEntity.badRequest().body(response);
		}

		String emailId = null;
		Long mobileNo = null;

		try {

			if (request.getEmailOrMobile().contains("@")) {
				emailId = request.getEmailOrMobile().trim();
			} else {
				mobileNo = Long.parseLong(request.getEmailOrMobile().trim());
			}
		} catch (NumberFormatException e) {
			response.put("success", false);
			response.put("message", "Invalid mobile number format");
			return ResponseEntity.badRequest().body(response);
		}

		boolean otpGenerated = appUserService.generateSellerForgetPasswordOtp(emailId, mobileNo);

		if (!otpGenerated) {
			response.put("success", false);
			response.put("message", "User not found or OTP generation failed");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		response.put("success", true);
		response.put("message", "OTP sent successfully");

		return ResponseEntity.ok(response);
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody UserOtpDto request) {

		boolean isOtpVerified = false;
		if (null != request) {
			String mobileNo = request.getEmailOrMobile();
			String otp = request.getOtp();

			isOtpVerified = appUserService.verifySellerForgetPasswordOtp(mobileNo, otp);

			if (isOtpVerified) {
				Map<String, Object> response = new HashMap<>();
				response.put("success", true);
				response.put("message", "OTP verified successfully");
				return ResponseEntity.ok(response);
			}
		}

		Map<String, Object> response = new HashMap<>();
		response.put("success", false);
		response.put("message", "OTP is Invalid.");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

	}

	@PostMapping("/reset-password")
	public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody UserOtpDto request) {

		boolean isOtpVerified = false;
		if (null != request) {
			String mobileNo = request.getEmailOrMobile();
			String otp = request.getOtp();
			String newPassword = request.getNewPassword();

			isOtpVerified = appUserService.resetSellerPassword(mobileNo, otp, newPassword);

			if (isOtpVerified) {
				Map<String, Object> response = new HashMap<>();
				response.put("success", true);
				response.put("message", "Password reset successfully");
				return ResponseEntity.ok(response);
			}
		}

		Map<String, Object> response = new HashMap<>();
		response.put("success", false);
		response.put("message", "Password reset failed. Invalid OTP.");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

	}

}
