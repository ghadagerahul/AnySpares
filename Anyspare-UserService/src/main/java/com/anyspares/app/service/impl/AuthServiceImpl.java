package com.anyspares.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.dto.BuyerUserRegistrationDto;
import com.anyspares.app.dto.SellerUserRegistrationDto;
import com.anyspares.app.entity.BuyerUserDetails;
import com.anyspares.app.entity.PasswordResetOtp;
import com.anyspares.app.entity.SellerUserDetails;
import com.anyspares.app.repo.BuyerUsersRepo;
import com.anyspares.app.repo.PasswordResetOtpRepo;
import com.anyspares.app.repo.SellerUserRepo;
import com.anyspares.app.service.AuthService;
import com.anyspares.app.service.EmailService;
import com.anyspares.app.utils.EmailTemplateUtils;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private BuyerUsersRepo appUserRepo;

	@Autowired
	private SellerUserRepo sellerUserRepo;

	@Autowired
	private PasswordResetOtpRepo passwordResetOtpRepo;

	@Autowired
	private EmailService emailService;

	Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public BuyerUserDetails registerNewUser(BuyerUserRegistrationDto userdetails) {

		BuyerUserDetails details = new BuyerUserDetails();
		BuyerUserDetails save = null;
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

		List<BuyerUserDetails> byMobileNo = null;
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
	public SellerUserDetails registerSellerUser(SellerUserRegistrationDto userdetails) {

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

	@Override
	public boolean generateForgetPasswordOtp(String emailIdStr, Long mobileNo) {

		SellerUserDetails user = null;

		// Validate inputs
		if (mobileNo == null && StringUtils.isBlank(emailIdStr)) {
			return false;
		}

		if (mobileNo != null) {
			List<SellerUserDetails> byMobile = sellerUserRepo.findByMobileNo(mobileNo);
			if (byMobile != null && !byMobile.isEmpty()) {
				user = byMobile.stream().filter(Objects::nonNull).findFirst().orElse(null);
			}
		}

		if (user == null && StringUtils.isNotBlank(emailIdStr)) {
			List<SellerUserDetails> byEmail = sellerUserRepo.findByEmailAddress(emailIdStr);
			if (byEmail != null && !byEmail.isEmpty()) {
				user = byEmail.stream().filter(Objects::nonNull).findFirst().orElse(null);
			}
		}

		if (user == null) {
			return false; 
		}

		String ownerName = user.getOwnerName();
		if (StringUtils.containsIgnoreCase(ownerName, " "))
			ownerName = ownerName.split(" ")[0];

		// generate OTP
		String otp = EmailTemplateUtils.generateOTP();

		// persist OTP with timestamps
		PasswordResetOtp pwd = new PasswordResetOtp();
		pwd.setSellerUserId(user.getId());
		pwd.setOtp(otp);
		pwd.setEmail(user.getEmailAddress());
		pwd.setMobileNo(user.getMobileNo());
		pwd.setCreatedAt(LocalDateTime.now());
		pwd.setExpiresAt(LocalDateTime.now().plusMinutes(10));
		pwd.setUsed(false);

		try {
			passwordResetOtpRepo.save(pwd);
		} catch (Exception e) {
			logger.error("Error saving PasswordResetOtp: {}", e.getMessage());
			return false;
		}

		// send email
		String toEmail = user.getEmailAddress();
		String sendResult = emailService.sendPwdResetOtpMail(toEmail, ownerName, otp);

		return "SUCCESS".equalsIgnoreCase(sendResult);
	}

}