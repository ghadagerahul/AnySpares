package com.anyspares.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/threewheelers/V1")
public class Appcontroller {

	@GetMapping("/get")
	public String getRequest() {
		return "Three wheller service called.";
	}

}
