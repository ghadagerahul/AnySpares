package com.anyspares.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.dto.BuyerLoginDto;
import com.anyspares.app.dto.BuyerUserRegistrationDto;
import com.anyspares.app.dto.ForgotPasswordRequestDto;
import com.anyspares.app.entity.BuyerUserDetails;
import com.anyspares.app.entity.UserOtpDto;
import com.anyspares.app.repo.BuyerUsersRepo;
import com.anyspares.app.service.AuthService;

import io.micrometer.common.util.StringUtils;

/**
 * REST controller that manages user authentication actions like registration
 * and login.
 *
 * <p>
 * Exposes endpoints under {@code /auth}./p>
 *
 * @author Rahul
 * @since 21-09-2025
 */
@RestController
@RequestMapping("/buyerAuth")
public class BuyerAuthController {

	@Autowired
	private BuyerUsersRepo appUserRepo;

	@Autowired
	private AuthService appService;

	private Logger logger = LoggerFactory.getLogger(getClass());

	@GetMapping("/test")
	public String testMethod() {
		return "Test successful!";
	}

	/**
	 * Registers a new user.
	 *
	 * @param user registration details
	 * @return success or failure response
	 */
	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody BuyerUserRegistrationDto user) {
		logger.debug("registerUser- user: " + user);

		Map<String, Object> response = new HashMap<>();

		if (null != user) {

			Long mobileNo = user.getMobileNo();

			if (appService.isUserPresent(mobileNo)) {
				response.put("success", true);
				response.put("message", "User Already Present");
				return ResponseEntity.ok(response);
			}

			if (StringUtils.isNotBlank(user.getUserName()) && StringUtils.isNotBlank(user.getPassword())) {
				BuyerUserDetails save = appService.registerNewUser(user);
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
	public ResponseEntity<Map<String, Object>> loginWithExistingUser(@RequestBody BuyerLoginDto details) {
		logger.debug("loginWithExistingUser- details: " + details);
		Map<String, Object> response = new HashMap<>();
		if (null != details) {

			long mobileNo = details.getMobileNo();
			List<BuyerUserDetails> userDetailsbyMobileNo = appUserRepo.findByMobileNo(mobileNo);

			if (null != userDetailsbyMobileNo && !userDetailsbyMobileNo.isEmpty() && userDetailsbyMobileNo.size() > 0) {

				boolean isMatch = userDetailsbyMobileNo.stream().filter(Objects::nonNull)
						.anyMatch(x -> x.getPassword().equals(details.getPassword()));

				if (isMatch) {
					response.put("success", true);
					response.put("message", "Login successful");
					return ResponseEntity.ok(response);
				}

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

		boolean otpGenerated = appService.generateBuyerForgetPasswordOtp(emailId, mobileNo);

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

			isOtpVerified = appService.verifyBuyerForgetPasswordOtp(mobileNo, otp);

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

			isOtpVerified = appService.resetBuyerPassword(mobileNo, otp, newPassword);

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
