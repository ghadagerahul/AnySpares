package com.anyspares.app.utils;

import java.security.SecureRandom;

public class EmailTemplateUtils {

	private EmailTemplateUtils() {
	}

	/**
	 * Generates a 4-digit OTP
	 */
	public static String generateOTP() {
		SecureRandom random = new SecureRandom();
		int otp = 1000 + random.nextInt(9000);
		return String.valueOf(otp);
	}

	/**
	 * Returns a formatted password reset email body
	 * 
	 * @param userName recipient's name
	 * @param otp      4-digit OTP
	 * @return HTML email body as String
	 */
	public static String getPasswordResetTemplate(String userName, String otp) {
		return """
				<!DOCTYPE html>
				<html>
				<head>
				  <meta charset="UTF-8">
				  <title>Password Reset</title>
				</head>
				<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
				  <table width="100%%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
				    <tr>
				      <td align="center">
				        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
				          <tr>
				            <td style="background:#2c3e50; color:#ffffff; padding:10px; text-align:center;">
				              <h2>AnySpares</h2>
				              <p style="margin:0; font-size:12px;">Smart Spare Parts Platform</p>
				            </td>
				          </tr>
				          <tr>
				            <td style="padding:30px; color:#333333;">
				              <h3 style="margin-top:0;">Password Reset Request</h3>
				              <p>Hello <b>%s</b>,</p>
				              <p>We received a request to reset your password. Use the OTP below to proceed:</p>
				              <div style="text-align:center; margin:30px 0;">
				                <span style="display:inline-block; background:#ecf0f1; padding:15px 30px; font-size:26px; letter-spacing:5px; font-weight:bold; color:#2c3e50; border-radius:8px;">
				                  %s
				                </span>
				              </div>
				              <p style="margin-top:20px;">This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.</p>
				              <p>If you didn’t request this, you can safely ignore this email.</p>
				              <p style="margin-top:30px;">Regards,<br><b>AnySpares Support Team</b></p>
				            </td>
				          </tr>
				          <tr>
				            <td style="background:#f4f6f8; text-align:center; padding:15px; font-size:12px; color:#777;">
				              © 2026 AnySpares. All rights reserved.
				            </td>
				          </tr>
				        </table>
				      </td>
				    </tr>
				  </table>
				</body>
				</html>
				"""
				.formatted(userName, otp);
	}

}
