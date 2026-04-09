package com.anyspares.app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.anyspares.app.constants.EmailConstants;
import com.anyspares.app.service.EmailService;
import com.anyspares.app.utils.EmailTemplateUtils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender mailSender;

	@Value("{mail.from}")
	private String mailFrom;

	@Override
	public String sendPwdResetOtpMail(String toEmail, String userName) {
		// generate otp internally and delegate to new method so behavior remains
		// backward compatible
		String otp = EmailTemplateUtils.generateOTP();
		return sendPwdResetOtpMail(toEmail, userName, otp);
	}

	@Override
	public String sendPwdResetOtpMail(String toEmail, String userName, String otp) {

		String pwdResetOtpMailBody = EmailTemplateUtils.getPasswordResetTemplate(userName, otp);

		try {
			MimeMessage message = mailSender.createMimeMessage();

			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setFrom(mailFrom);
			helper.setTo(toEmail);
			helper.setSubject(EmailConstants.PASSWORD_RESET_OTP_MAIL_SUBJECT);
			helper.setText(pwdResetOtpMailBody, true);

			mailSender.send(message);
			System.out.println("Mail sent successfully!");

		} catch (MailException e) {
			e.printStackTrace();
			return "FAIL";
		} catch (MessagingException e) {
			e.printStackTrace();
			return "FAIL";
		}

		return "SUCCESS";
	}

}