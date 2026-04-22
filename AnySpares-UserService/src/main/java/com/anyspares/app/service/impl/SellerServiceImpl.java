package com.anyspares.app.service.impl;

import com.anyspares.app.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class SellerServiceImpl implements AuthService {
    @Override
    public String validateUser() {
        return "Seller";
    }

    @Override
    public String getServiceType() {
        return "SELLER";
    }
}
