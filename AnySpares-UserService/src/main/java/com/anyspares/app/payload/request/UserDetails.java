package com.anyspares.app.payload.request;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class UserDetails implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String userType;
    private BuyerDetails buyerDetails;
    private SellerDetails sellerDetails;

}
