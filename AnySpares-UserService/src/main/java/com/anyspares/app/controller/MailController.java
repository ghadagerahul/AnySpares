package com.anyspares.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.service.EmailService;

@RestController
@RequestMapping("/mail")
public class MailController {

	@Autowired
	private EmailService emailService;

	@GetMapping("/send-mail")
//	public String sendMail(@RequestParam String to, @RequestParam String subject, @RequestParam String body) {
	public String sendMail() {

		String toEmail = "";
		String userName = "";

		emailService.sendPwdResetOtpMail(toEmail, userName);

		return "Mail sent!";
	}
}
