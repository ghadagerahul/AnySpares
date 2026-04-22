package com.anyspares.app.payload.request;

import lombok.Data;

@Data
public class BuyerDetails {

	private String emailId;
	private long mobileNo;
	private String password;

}
