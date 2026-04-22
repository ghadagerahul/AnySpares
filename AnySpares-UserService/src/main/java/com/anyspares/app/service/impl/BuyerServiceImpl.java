package com.anyspares.app.service.impl;

import com.anyspares.app.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class BuyerServiceImpl implements AuthService {
    @Override
    public String validateUser() {
        return "Buyer";
    }

    @Override
    public String getServiceType() {
        return "BUYER";
    }
}
