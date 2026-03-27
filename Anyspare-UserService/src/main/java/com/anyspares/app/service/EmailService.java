package com.anyspares.app.service;

public interface EmailService {

	public String sendPwdResetOtpMail(String toEmail, String userName);

	public String sendPwdResetOtpMail(String toEmail, String userName, String otp);

}