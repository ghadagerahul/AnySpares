package com.anyspares.app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/heavywheelers/V1")
public class Appcontroller {

	@GetMapping("/get")
	public String getRequest() {
		return "Heavy wheller service called.";
	}

}
