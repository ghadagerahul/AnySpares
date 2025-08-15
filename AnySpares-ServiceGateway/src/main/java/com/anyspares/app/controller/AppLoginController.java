package com.anyspares.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

@RestController
@RequestMapping("/app")
public class AppLoginController {

	@PostMapping("/register")
	public ResponseEntity<String> registerUser() {

		return new ResponseEntity<>("", HttpStatus.OK);
	}

	
	
	
	@PostMapping("/login")
	public ResponseEntity<String> loginWithExistingUser() {

		return new ResponseEntity<>("", HttpStatus.OK);
	}

}
