package com.anyspares.app.service.impl;

import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.controller.model.SellerUserDetailsModel;
import com.anyspares.app.controller.model.UserDetailsModel;
import com.anyspares.app.entity.SellerUserDetails;
import com.anyspares.app.entity.UserDetails;
import com.anyspares.app.repo.AppUserRepo;
import com.anyspares.app.repo.SellerUserRepo;
import com.anyspares.app.service.AppUserService;

@Service
public class AppUserServiceImpl implements AppUserService {

	@Autowired
	private AppUserRepo appUserRepo;

	@Autowired
	private SellerUserRepo sellerUserRepo;

	Logger logger = LoggerFactory.getLogger(getClass());

	@Override
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

	@Override
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

	@Override
	public SellerUserDetails registerSellerUser(SellerUserDetailsModel userdetails) {

		SellerUserDetails details = new SellerUserDetails();
		SellerUserDetails save = null;
		if (null != userdetails) {

			details.setBusinesstName(userdetails.getBusinesstName());
			details.setOwnerName(userdetails.getOwnerName());
			details.setMobileNo(userdetails.getMobileNo());

			details.setEmailAddress(userdetails.getEmailAddress());
			details.setGstNumber(userdetails.getGstNumber());
			details.setCompleteAddress(userdetails.getCompleteAddress());
			details.setCity(userdetails.getCity());
			details.setPincode(userdetails.getPincode());

			details.setVehicleType(userdetails.getVehicleType());
			details.setPassword(userdetails.getPassword());

			try {
				save = sellerUserRepo.save(details);
			} catch (Exception e) {
				logger.error("Exception while Registering New user: " + e.getMessage());
			}
			return save;
		}
		return null;
	}

	@Override
	public boolean isUSellerserPresent(Long mobileno, String pwd) {

		List<SellerUserDetails> userDetailsList = null;
		try {
			userDetailsList = sellerUserRepo.findByMobileNo(mobileno);
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (null != userDetailsList && !userDetailsList.isEmpty() && userDetailsList.size() > 0) {

			boolean isMatch = userDetailsList.stream().filter(Objects::nonNull)
					.anyMatch(x -> x.getPassword().equals(pwd));
			return isMatch;
		}
		return false;
	}

	@Override
	public SellerUserDetails finduserByMobileNumber(Long mobileno) {

		List<SellerUserDetails> sellerUserDetails = sellerUserRepo.findByMobileNo(mobileno);
		
		return sellerUserDetails.stream().filter(Objects::nonNull).findFirst().get();
	}
	
	

}
