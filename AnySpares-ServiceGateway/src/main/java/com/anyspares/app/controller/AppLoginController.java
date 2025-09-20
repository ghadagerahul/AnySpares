package com.anyspares.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anyspares.app.controller.model.LoginDetails;
import com.anyspares.app.controller.model.UserDetailsModel;
import com.anyspares.app.entity.UserDetails;
import com.anyspares.app.repo.AppUserRepo;
import com.anyspares.app.service.AppUserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
public class AppLoginController {

	@Autowired
	private AppUserRepo appUserRepo;

	@Autowired
	private AppUserService appService;

	private Logger logger = LoggerFactory.getLogger(getClass());

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody UserDetailsModel user) {
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
				UserDetails save = appService.registerNewUser(user);
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

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> loginWithExistingUser(@RequestBody LoginDetails details) {
		logger.debug("loginWithExistingUser- details: " + details);
		Map<String, Object> response = new HashMap<>();
		if (null != details) {

			long mobileNo = details.getMobileNo();
			List<UserDetails> userDetailsbyMobileNo = appUserRepo.findByMobileNo(mobileNo);

			if (null != userDetailsbyMobileNo && !userDetailsbyMobileNo.isEmpty() && userDetailsbyMobileNo.size() > 0) {

				boolean isMatch = userDetailsbyMobileNo.stream().filter(Objects::nonNull)
						.anyMatch(x -> x.getPassword().equals(details.getPassword()));

				if (isMatch)
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
