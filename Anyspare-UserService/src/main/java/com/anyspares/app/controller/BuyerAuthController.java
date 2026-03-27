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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.dto.BuyerLoginDto;
import com.anyspares.app.dto.BuyerUserRegistrationDto;
import com.anyspares.app.entity.BuyerUserDetails;
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
@CrossOrigin(originPatterns = "*")
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

}
