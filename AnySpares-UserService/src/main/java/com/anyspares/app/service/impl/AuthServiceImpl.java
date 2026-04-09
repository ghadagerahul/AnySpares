package com.anyspares.app.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anyspares.app.constants.Constants;
import com.anyspares.app.dto.BuyerUserRegistrationDto;
import com.anyspares.app.dto.SellerUserRegistrationDto;
import com.anyspares.app.dto.UserLoginDto;
import com.anyspares.app.dto.UserRegistrationDto;
import com.anyspares.app.entity.BuyerUserDetails;
import com.anyspares.app.entity.PasswordResetOtp;
import com.anyspares.app.entity.SellerUserDetails;
import com.anyspares.app.repo.BuyerUsersRepo;
import com.anyspares.app.repo.PasswordResetOtpRepo;
import com.anyspares.app.repo.SellerUserRepo;
import com.anyspares.app.service.AuthService;
import com.anyspares.app.service.EmailService;
import com.anyspares.app.utils.EmailTemplateUtils;

import jakarta.transaction.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private BuyerUsersRepo buyerUserRepo;

	@Autowired
	private SellerUserRepo sellerUserRepo;

	@Autowired
	private PasswordResetOtpRepo passwordResetOtpRepo;

	@Autowired
	private EmailService emailService;

	Logger logger = LoggerFactory.getLogger(getClass());

	private static final String SUCCESS = "SUCCESS";

	@Override
	public boolean registerNewUser(UserRegistrationDto userdetails) {

		if (null == userdetails)
			return false;
		;

		if (StringUtils.isNotBlank(userdetails.getUserType())
				&& StringUtils.equalsIgnoreCase(userdetails.getUserType(), Constants.USER_SELLER)) {
			SellerUserDetails details = new SellerUserDetails();
			SellerUserDetails save = null;

			details.setBusinesstName(userdetails.getBusinessName());
			details.setOwnerName(userdetails.getOwnerName());
			details.setMobileNo(userdetails.getMobileNo());

			details.setEmailAddress(userdetails.getEmail());
			details.setGstNumber(userdetails.getGstNumber());
			details.setCompleteAddress(userdetails.getCompleteAddress());
			details.setCity(userdetails.getCity());
			details.setPincode(userdetails.getPincode());
			details.setVehicleType(userdetails.getVehicleType() != null
					? userdetails.getVehicleType().stream().filter(Objects::nonNull).collect(Collectors.joining("|"))
					: null);
			details.setPassword(userdetails.getPassword());

			try {
				save = sellerUserRepo.save(details);
				return null != save ? true : false;

			} catch (Exception e) {
				logger.error("Exception while Registering New user: " + e.getMessage());
			}

		} else if (StringUtils.isNotBlank(userdetails.getUserType())
				&& StringUtils.equalsIgnoreCase(userdetails.getUserType(), Constants.USER_BUYER)) {

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
					save = buyerUserRepo.save(details);
					return null != save ? true : false;
				} catch (Exception e) {
					logger.error("Exception while Registering New user: " + e.getMessage());
				}

			}

		}
		return false;
	}

	@Override
	public boolean isUserPresent(Long mobileno, String userType) {

		if (mobileno == null || StringUtils.isBlank(userType)) {
			return false;
		}

		try {
			if (Constants.USER_BUYER.equalsIgnoreCase(userType)) {
				return !buyerUserRepo.findByMobileNo(mobileno).isEmpty();
			}

			if (Constants.USER_SELLER.equalsIgnoreCase(userType)) {
				return !sellerUserRepo.findByMobileNo(mobileno).isEmpty();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
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
			String vehicleTypes = "";
			if (null != userdetails.getVehicleType() && userdetails.getVehicleType().size() > 0) {
				vehicleTypes = userdetails.getVehicleType().stream().filter(Objects::nonNull)
						.collect(Collectors.joining("|"));
			}
			details.setVehicleType(vehicleTypes);
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
	public boolean generateSellerForgetPasswordOtp(String emailIdStr, Long mobileNo) {

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
		pwd.setUserId(user.getId());
		pwd.setOtp(otp);
		pwd.setEmail(user.getEmailAddress());
		pwd.setMobileNo(user.getMobileNo());
		pwd.setCreatedAt(LocalDateTime.now().withNano(0));
		pwd.setExpiresAt(LocalDateTime.now().withNano(0).plusMinutes(10));
		pwd.setIsUsed("N");

		try {
			passwordResetOtpRepo.save(pwd);
		} catch (Exception e) {
			logger.error("Error saving PasswordResetOtp: {}", e.getMessage());
			return false;
		}

		// send email
		String toEmail = user.getEmailAddress();
		String sendResult = emailService.sendPwdResetOtpMail(toEmail, ownerName, otp);

		return SUCCESS.equalsIgnoreCase(sendResult);
	}

	@Override
	public boolean generateBuyerForgetPasswordOtp(String emailIdStr, Long mobileNo) {

		BuyerUserDetails user = null;

		// Validate inputs
		if (mobileNo == null && StringUtils.isBlank(emailIdStr)) {
			return false;
		}

		if (mobileNo != null) {
			List<BuyerUserDetails> byMobile = buyerUserRepo.findByMobileNo(mobileNo);
			if (byMobile != null && !byMobile.isEmpty()) {
				user = byMobile.stream().filter(Objects::nonNull).findFirst().orElse(null);
			}
		}

		if (user == null && StringUtils.isNotBlank(emailIdStr)) {
			List<BuyerUserDetails> byEmail = buyerUserRepo.findByEmailId(emailIdStr);
			if (byEmail != null && !byEmail.isEmpty()) {
				user = byEmail.stream().filter(Objects::nonNull).findFirst().orElse(null);
			}
		}

		if (user == null) {
			return false;
		}

		String ownerName = user.getFirstName();
		if (StringUtils.containsIgnoreCase(ownerName, " "))
			ownerName = ownerName.split(" ")[0];

		// generate OTP
		String otp = EmailTemplateUtils.generateOTP();

		// persist OTP with timestamps
		PasswordResetOtp otpObj = new PasswordResetOtp();
		otpObj.setUserId(user.getId());
		otpObj.setOtp(otp);
		otpObj.setEmail(user.getEmailId());
		otpObj.setMobileNo(user.getMobileNo());
		otpObj.setCreatedAt(LocalDateTime.now().withNano(0));
		otpObj.setExpiresAt(LocalDateTime.now().withNano(0).plusMinutes(10));
		otpObj.setIsUsed(Constants.N);

		try {
			passwordResetOtpRepo.save(otpObj);
		} catch (Exception e) {
			logger.error("Error saving PasswordResetOtp: {}", e.getMessage());
			return false;
		}

		// send email
		String toEmail = user.getEmailId();
		String sendResult = emailService.sendPwdResetOtpMail(toEmail, ownerName, otp);

		return SUCCESS.equalsIgnoreCase(sendResult);
	}

	@Override
	public boolean verifyBuyerForgetPasswordOtp(String mobileNo, String otp) {

		if (StringUtils.isNotBlank(mobileNo) && StringUtils.containsIgnoreCase(mobileNo, "@")) {
			List<BuyerUserDetails> byEmailId = buyerUserRepo.findByEmailId(mobileNo);
			if (null != byEmailId && !byEmailId.isEmpty()) {
				BuyerUserDetails userDetails = byEmailId.stream().filter(Objects::nonNull).findFirst().get();
				mobileNo = String.valueOf(userDetails.getMobileNo());
			}
		}
		Long mobileNoLong = Long.valueOf(mobileNo);

		List<BuyerUserDetails> buyerUserDetailsList = buyerUserRepo.findByMobileNo(mobileNoLong);

		if (null != buyerUserDetailsList && buyerUserDetailsList.size() > 0) {

			BuyerUserDetails userDetails = buyerUserDetailsList.stream().filter(Objects::nonNull).findFirst().get();

			PasswordResetOtp validOtp = passwordResetOtpRepo.findLatestUserIssuedOtp(userDetails.getId(), mobileNoLong,
					Constants.N);

			if (null != validOtp) {

				if (StringUtils.equals(validOtp.getOtp(), otp) && validOtp.getExpiresAt().isAfter(LocalDateTime.now())
						&& LocalDateTime.now().isBefore(validOtp.getCreatedAt().plusMinutes(10))) {
					validOtp.setIsUsed(Constants.Y);
					passwordResetOtpRepo.save(validOtp);
					return true;
				}
			}
		}

		return false;
	}

	@Override
	@Transactional
	public boolean resetBuyerPassword(String mobileNo, String otp, String newPassword) {

		if (StringUtils.isBlank(mobileNo) || StringUtils.isBlank(otp)) {
			return false;
		}

		if (StringUtils.isNotBlank(mobileNo) && StringUtils.containsIgnoreCase(mobileNo, "@")) {
			List<BuyerUserDetails> byEmailId = buyerUserRepo.findByEmailId(mobileNo);
			if (null != byEmailId && !byEmailId.isEmpty()) {
				BuyerUserDetails userDetails = byEmailId.stream().filter(Objects::nonNull).findFirst().get();
				mobileNo = String.valueOf(userDetails.getMobileNo());
			}
		}

		PasswordResetOtp otpVerified = passwordResetOtpRepo.checkOtpVerified(mobileNo, otp);

		if (null != otpVerified && StringUtils.equalsIgnoreCase(Constants.Y, otpVerified.getIsUsed())) {

			// update password
			int updated = buyerUserRepo.updatePasswordByMobileNo(mobileNo, otpVerified.getUserId(), newPassword);
			return updated == 1;
		}

		return false;
	}

	@Override
	public boolean verifySellerForgetPasswordOtp(String mobileNo, String otp) {

		if (StringUtils.isNotBlank(mobileNo) && StringUtils.containsIgnoreCase(mobileNo, "@")) {
			List<SellerUserDetails> byEmailId = sellerUserRepo.findByEmailAddress(mobileNo);
			if (null != byEmailId && !byEmailId.isEmpty()) {
				SellerUserDetails userDetails = byEmailId.stream().filter(Objects::nonNull).findFirst().get();
				mobileNo = String.valueOf(userDetails.getMobileNo());
			}
		}
		Long mobileNoLong = Long.valueOf(mobileNo);

		List<SellerUserDetails> buyerUserDetailsList = sellerUserRepo.findByMobileNo(mobileNoLong);

		if (null != buyerUserDetailsList && buyerUserDetailsList.size() > 0) {

			SellerUserDetails userDetails = buyerUserDetailsList.stream().filter(Objects::nonNull).findFirst().get();

			PasswordResetOtp validOtp = passwordResetOtpRepo.findLatestUserIssuedOtp(userDetails.getId(), mobileNoLong,
					Constants.N);

			if (null != validOtp) {

				if (StringUtils.equals(validOtp.getOtp(), otp) && validOtp.getExpiresAt().isAfter(LocalDateTime.now())
						&& LocalDateTime.now().isBefore(validOtp.getCreatedAt().plusMinutes(10))) {
					validOtp.setIsUsed(Constants.Y);
					passwordResetOtpRepo.save(validOtp);
					return true;
				}
			}
		}

		return false;
	}

	@Override
	public boolean resetSellerPassword(String mobileNo, String otp, String newPassword) {

		if (StringUtils.isBlank(mobileNo) || StringUtils.isBlank(otp)) {
			return false;
		}

		if (StringUtils.isNotBlank(mobileNo) && StringUtils.containsIgnoreCase(mobileNo, "@")) {
			List<SellerUserDetails> byEmailId = sellerUserRepo.findByEmailAddress(mobileNo);
			if (null != byEmailId && !byEmailId.isEmpty()) {
				SellerUserDetails userDetails = byEmailId.stream().filter(Objects::nonNull).findFirst().get();
				mobileNo = String.valueOf(userDetails.getMobileNo());
			}
		}

		PasswordResetOtp otpVerified = passwordResetOtpRepo.checkOtpVerified(mobileNo, otp);

		if (null != otpVerified && StringUtils.equalsIgnoreCase(Constants.Y, otpVerified.getIsUsed())) {

			// update password
			int updated = sellerUserRepo.updatePasswordByMobileNo(mobileNo, otpVerified.getUserId(), newPassword);
			return updated == 1;
		}

		return false;
	}

	@Override
	public boolean validateUserLogin(UserLoginDto details) {

		if (details == null || StringUtils.isBlank(details.getUserType()) || details.getMobileNo() == 0
				|| StringUtils.isBlank(details.getPassword())) {
			return false;
		}

		long mobileNo = details.getMobileNo();
		String password = details.getPassword();

		if (Constants.USER_BUYER.equalsIgnoreCase(details.getUserType())) {
			return buyerUserRepo.findByMobileNo(mobileNo).stream().filter(Objects::nonNull)
					.anyMatch(user -> password.equals(user.getPassword()));
		}

		if (Constants.USER_SELLER.equalsIgnoreCase(details.getUserType())) {
			return sellerUserRepo.findByMobileNo(mobileNo).stream().filter(Objects::nonNull)
					.anyMatch(user -> password.equals(user.getPassword()));
		}

		return false;
	}

}