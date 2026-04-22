package com.anyspares.app.service.impl;

import com.anyspares.app.service.AuthService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AuthHandlerFactory {

    private final Map<String, AuthService> authServiceMap;

    AuthHandlerFactory(List<AuthService> services) {
        authServiceMap = services
                .stream()
                .collect(Collectors.toMap(map->map.getServiceType().toUpperCase(Locale.ROOT), s -> s));
    }

    public AuthService getServices(String type) {
        AuthService authService = authServiceMap.get(type.toUpperCase());
        if(authService == null) {
            //throw error
        }
        return authService;
    }

}
