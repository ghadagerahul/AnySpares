package com.auth.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.app.service.EmailService;

@RestController
@RequestMapping("/mail")
public class MailController {

	@Autowired
	private EmailService emailService;

	@GetMapping("/send-mail")
//	public String sendMail(@RequestParam String to, @RequestParam String subject, @RequestParam String body) {
	public String sendMail() {

		String to = "rahulghadage032026@gmail.com";
		String subject = "Test Email || Urget";
		String body = "Hello,\n\nThis is a test email.\n\nRegards,\nYour Java App";

		emailService.sendSimpleMail(to, subject, body);
		return "Mail sent!";
	}
}
