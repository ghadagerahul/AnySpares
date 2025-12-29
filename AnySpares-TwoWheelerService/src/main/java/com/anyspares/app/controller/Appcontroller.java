package com.anyspares.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/twowheelers")
public class Appcontroller {

	@GetMapping("/V1/get")
	public String getRequest() {
		return "Two wheller service called.";
	}

}
