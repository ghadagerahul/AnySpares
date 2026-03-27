package com.anyspares.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/spare")
public class GatewayContoller {

	@GetMapping("/request")
	public String getRequest() {

		return "getting Request Sucessfully.";
	}

}
