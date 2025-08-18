package com.auth.app.service;

import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthenticationService {

	private static final String SECRET_KEY = "yourSecretKey";
	private static final long EXPIRATION_TIME = 3600000;

	public String generateJwtToken(String username, String password) {

		
		
		String token = generateToken(username);

		return "";
	}

	private String generateToken(String username) {

		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256).compact();

	}

}
