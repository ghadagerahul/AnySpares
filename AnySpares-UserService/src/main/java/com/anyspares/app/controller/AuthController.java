package com.anyspares.app.controller;

import com.anyspares.app.exception.AuthException;
import com.anyspares.app.payload.request.UserDetails;
import com.anyspares.app.service.AuthService;
import com.anyspares.app.service.impl.AuthHandlerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

	private final AuthHandlerFactory authHandlerFactory;

    AuthController(AuthHandlerFactory authHandlerFactory) {
        this.authHandlerFactory = authHandlerFactory;
    }

	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	@PostMapping("/validateUser")
	public ResponseEntity<String> validateUser(@RequestBody UserDetails userDetails) {
		logger.info("AuthController validate- details: {}", userDetails);

        String validateUserResponse = "";
		if (null != userDetails) {
            try {
                AuthService auth = authHandlerFactory.getServices(userDetails.getUserType());
                if(null != auth)
                    validateUserResponse = auth.validateUser();
            } catch (Exception e) {
                throw new AuthException(e.getMessage(), "");
            }
		}
		return ResponseEntity.status(HttpStatus.OK).body(validateUserResponse);
	}

}
