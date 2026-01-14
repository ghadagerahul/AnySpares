package com.anyspares.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/spare")
public class GatewayContoller {

	@GetMapping("/request")
	public String getRequest() {

		return "getting Request Sucessfully.";
	}

}
