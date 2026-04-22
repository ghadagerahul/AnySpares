//package com.anyspares.app.controller;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import com.anyspares.app.service.AuthService;
//import com.anyspares.app.service.impl.AuthHandlerFactory;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.anyspares.app.dto.UserLoginDto;
//
//@RestController
//@RequestMapping("/v1/auth")
//public class AuthControllerBkp {
//
//	@Autowired
//	private AuthHandlerFactory authHandlerFactory;
//
//	private static final Logger logger = LoggerFactory.getLogger(AuthControllerBkp.class);
//
////	@PostMapping("/register")
////	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody UserRegistrationDto user) {
////		logger.debug("registerUser- user: " + user);
////
////		Map<String, Object> response = new HashMap<>();
////
////		if (null != user) {
////
////			Long mobileNo = user.getMobileNo();
////
////			if (appService.isUserPresent(mobileNo, user.getUserType())) {
////				response.put("success", true);
////				response.put("message", "User Already Present");
////				return ResponseEntity.ok(response);
////			}
////
////			if ((StringUtils.isNotBlank(user.getUserName()) || StringUtils.isNotBlank(user.getOwnerName()))
////					&& StringUtils.isNotBlank(user.getPassword())) {
////				boolean isRegistered = appService.registerNewUser(user);
////				if (isRegistered) {
////					response.put("success", true);
////					response.put("message", "Registration successful");
////					return ResponseEntity.ok(response);
////				}
////			}
////		}
////
////		response.put("success", false);
////		response.put("message", "Registration Failed");
////		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
////	}
//
//
////	@PostMapping("/login")
////	public ResponseEntity<Map<String, Object>> login(@RequestBody UserLoginDto userLoginDto) {
////		logger.info("AuthController login- details: {}", userLoginDto);
////		Map<String, Object> response = new HashMap<>();
////
////		if (null != userLoginDto) {
////            AuthService auth = authHandlerFactory.getServices(userLoginDto.getUserType());
////            auth.validateUserLogin();
////			boolean validateUserLogin = appService.validateUserLogin(details);
////			if (validateUserLogin) {
////				response.put("success", true);
////				response.put("message", "Login successful");
////				response.put("user", appService.finduserByMobileNumber(details.getMobileNo()));
////				return ResponseEntity.ok(response);
////			}
////		}
//
////		response.put("success", false);
////		response.put("message", "Invalid login");
////		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
////	}
//
////	@PostMapping("/forgot-password")
////	public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequestDto request) {
////
////		if (logger.isDebugEnabled()) {
////			logger.debug("forgotPassword - request: {}", request);
////		}
////
////		Map<String, Object> response = new HashMap<>();
////
////		if (request == null || StringUtils.isBlank(request.getEmailOrMobile())) {
////			response.put("success", false);
////			response.put("message", "Email or Mobile is required");
////			return ResponseEntity.badRequest().body(response);
////		}
////
////		String emailId = null;
////		Long mobileNo = null;
////
////		try {
////
////			if (request.getEmailOrMobile().contains("@")) {
////				emailId = request.getEmailOrMobile().trim();
////			} else {
////				mobileNo = Long.parseLong(request.getEmailOrMobile().trim());
////			}
////		} catch (NumberFormatException e) {
////			response.put("success", false);
////			response.put("message", "Invalid mobile number format");
////			return ResponseEntity.badRequest().body(response);
////		}
////
////		boolean otpGenerated = appService.generateBuyerForgetPasswordOtp(emailId, mobileNo);
////
////		if (!otpGenerated) {
////			response.put("success", false);
////			response.put("message", "User not found or OTP generation failed");
////			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
////		}
////
////		response.put("success", true);
////		response.put("message", "OTP sent successfully");
////
////		return ResponseEntity.ok(response);
////	}
////
////	@PostMapping("/verify-otp")
////	public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody UserOtpDto request) {
////
////		boolean isOtpVerified = false;
////		if (null != request) {
////			String mobileNo = request.getEmailOrMobile();
////			String otp = request.getOtp();
////
////			isOtpVerified = appService.verifyBuyerForgetPasswordOtp(mobileNo, otp);
////
////			if (isOtpVerified) {
////				Map<String, Object> response = new HashMap<>();
////				response.put("success", true);
////				response.put("message", "OTP verified successfully");
////				return ResponseEntity.ok(response);
////			}
////		}
////
////		Map<String, Object> response = new HashMap<>();
////		response.put("success", false);
////		response.put("message", "OTP is Invalid.");
////		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
////
////	}
////
////	@PostMapping("/reset-password")
////	public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody UserOtpDto request) {
////
////		boolean isOtpVerified = false;
////		if (null != request) {
////			String mobileNo = request.getEmailOrMobile();
////			String otp = request.getOtp();
////			String newPassword = request.getNewPassword();
////
////			isOtpVerified = appService.resetBuyerPassword(mobileNo, otp, newPassword);
////
////			if (isOtpVerified) {
////				Map<String, Object> response = new HashMap<>();
////				response.put("success", true);
////				response.put("message", "Password reset successfully");
////				return ResponseEntity.ok(response);
////			}
////		}
////
////		Map<String, Object> response = new HashMap<>();
////		response.put("success", false);
////		response.put("message", "Password reset failed. Invalid OTP.");
////		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
////
////	}
//
//}
