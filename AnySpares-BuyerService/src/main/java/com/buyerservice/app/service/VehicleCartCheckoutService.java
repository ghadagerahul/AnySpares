package com.buyerservice.app.service;

import java.util.List;

import com.buyerservice.app.dto.VehicleCheckoutContactDto;
import com.buyerservice.app.dto.VehicleOrderAddressDto;

public interface VehicleCartCheckoutService {

	List<VehicleOrderAddressDto> getOrderAddress(String string);

	List<VehicleOrderAddressDto> saveOrderAddress(VehicleOrderAddressDto orderAddressDto);

	List<VehicleOrderAddressDto> updateOrderAddress(String addressId, VehicleOrderAddressDto addressDto);

	List<VehicleOrderAddressDto> deleteOrderAddress(String addressId);

	List<VehicleCheckoutContactDto> getOrderContacts(String userId);

	VehicleCheckoutContactDto saveOrderContacts(VehicleCheckoutContactDto dto);

}
