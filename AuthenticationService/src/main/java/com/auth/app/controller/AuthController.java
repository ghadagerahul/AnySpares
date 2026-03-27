package com.auth.app.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.auth.app.dto.TokenResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final WebClient webClient = WebClient
			.create("http://localhost:8080/realms/my-realm/protocol/openid-connect/token");

	@GetMapping("/get-token")
	public TokenResponse getToken() {
		return webClient.post().contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.bodyValue("client_id=spring-boot-app&username=admin&password=admin&grant_type=password")
				.retrieve().bodyToMono(TokenResponse.class).block();
	}
}
