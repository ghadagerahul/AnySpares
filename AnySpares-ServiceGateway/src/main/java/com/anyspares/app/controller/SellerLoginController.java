package com.anyspares.app.controller;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.controller.model.SellerLoginDetails;
import com.anyspares.app.controller.model.SellerUserDetailsModel;
import com.anyspares.app.entity.SellerUserDetails;
import com.anyspares.app.service.AppUserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/sellerAuth")
public class SellerLoginController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private AppUserService appUserService;

	/**
	 * Registers a new user.
	 *
	 * @param user registration details
	 * @return success or failure response
	 */
	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody SellerUserDetailsModel user) {
		logger.debug("registerUser- user: " + user);

		Map<String, Object> response = new HashMap<>();

		if (null != user) {

			Long mobileNo = user.getMobileNo();

			if (appUserService.isUserPresent(mobileNo)) {
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
	public ResponseEntity<Map<String, Object>> loginWithExistingUser(@RequestBody SellerLoginDetails details) {
		logger.debug("loginWithExistingUser- details: " + details);
		Map<String, Object> response = new HashMap<>();
		if (null != details) {

			Long mobileNo = details.getMobileNumber();
			boolean sellerserPresent = appUserService.isUSellerserPresent(mobileNo, details.getPassword());

			if (sellerserPresent) {
				response.put("success", true);
				response.put("message", "Login successful");
				return ResponseEntity.ok(response);

			}
		}

		response.put("success", false);
		response.put("message", "Invalid login");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

}
