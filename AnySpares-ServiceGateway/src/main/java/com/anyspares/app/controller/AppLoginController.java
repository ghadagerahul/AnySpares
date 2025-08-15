package com.anyspares.app.controller;

import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anyspares.app.controller.model.LoginDetails;
import com.anyspares.app.entity.UserDetails;
import com.anyspares.app.repo.AppUserRepo;

@RestController
@RequestMapping("/auth")
public class AppLoginController {

	@Autowired
	private AppUserRepo appUserRepo;

	private Logger logger = LoggerFactory.getLogger(getClass());

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody UserDetails details) {

		logger.debug("registerUser- details: " + details);
		if (null != details) {

			Long mobileNo = details.getMobileNo();

			if (null != appUserRepo.findByMobileNo(mobileNo) || !appUserRepo.findByMobileNo(mobileNo).isEmpty()
					|| appUserRepo.findByMobileNo(mobileNo).size() > 0) {
				return new ResponseEntity<>("User Already Exist.", HttpStatus.OK);
			}

			UserDetails save = appUserRepo.save(details);
			if (details.equals(save)) {
				return new ResponseEntity<>("User Created SuccessFully.", HttpStatus.OK);
			}
		}

		return new ResponseEntity<>("Invalid Data In Request.", HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/login")
	public ResponseEntity<String> loginWithExistingUser(@RequestBody LoginDetails details) {
		logger.debug("loginWithExistingUser- details: " + details);
		if (null != details) {

			long mobileNo = details.getMobileNo();

			List<UserDetails> userDetailsbyMobileNo = appUserRepo.findByMobileNo(mobileNo);

			if (null != userDetailsbyMobileNo && !userDetailsbyMobileNo.isEmpty() && userDetailsbyMobileNo.size() > 0) {

				boolean isMatch = userDetailsbyMobileNo.stream().filter(Objects::nonNull)
						.anyMatch(x -> x.getPassword().equals(details.getPassword()));

				if (isMatch)
					new ResponseEntity<>("User Vlidated Succesfully", HttpStatus.OK);

			}
		}
		return new ResponseEntity<>("Invalid Login Data.", HttpStatus.BAD_REQUEST);
	}

}
