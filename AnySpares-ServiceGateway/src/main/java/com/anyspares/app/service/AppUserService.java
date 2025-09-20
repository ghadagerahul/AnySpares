package com.anyspares.app.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.controller.model.UserDetailsModel;
import com.anyspares.app.entity.UserDetails;
import com.anyspares.app.repo.AppUserRepo;

@Service
public class AppUserService {

	@Autowired
	private AppUserRepo appUserRepo;

	Logger logger = LoggerFactory.getLogger(getClass());

	public UserDetails registerNewUser(UserDetailsModel userdetails) {

		UserDetails details = new UserDetails();
		UserDetails save = null;
		if (null != userdetails) {

			details.setUserName(userdetails.getUserName());
			details.setEmailId(userdetails.getEmail());
			details.setFirstName(userdetails.getFirstName());
			details.setLastName(userdetails.getLastName());
			details.setMobileNo(userdetails.getMobileNo());
			details.setAddress(null);
			details.setPassword(userdetails.getPassword());

			try {
				save = appUserRepo.save(details);
			} catch (Exception e) {
				logger.error("Exception while Registering New user: " + e.getMessage());
			}
			return save;
		}
		return null;
	}

	public boolean isUserPresent(Long mobileno) {

		List<UserDetails> byMobileNo = null;
		try {
			byMobileNo = appUserRepo.findByMobileNo(mobileno);
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (null != byMobileNo && !byMobileNo.isEmpty())
			return true;

		return false;

	}

}
