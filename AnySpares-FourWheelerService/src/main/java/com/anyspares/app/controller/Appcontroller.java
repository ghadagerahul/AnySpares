package com.anyspares.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anyspares.app.repo.FourWhellerRepository;

@RestController
@RequestMapping("/fourwheelers/V1")
public class Appcontroller {

	@Autowired
	private FourWhellerRepository fourWhellerRepository;

	@GetMapping("/get")
	public String getRequest() {
		return "Four wheller service called.";
	}

	@GetMapping("")
	public String getcarCompanies() {

		return "";
	}

}
