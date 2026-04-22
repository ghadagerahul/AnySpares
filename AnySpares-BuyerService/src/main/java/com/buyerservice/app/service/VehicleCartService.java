package com.buyerservice.app.service;

import java.util.List;
import java.util.Map;

import com.buyerservice.app.dto.MyCartIteamsDto;
import com.buyerservice.app.dto.VehicleCartDto;

public interface VehicleCartService {

	public Map<String, Object> addToCart(VehicleCartDto cartDto);

	public List<MyCartIteamsDto> getBucketItems(Long userId);

	public List<MyCartIteamsDto> updateCart(VehicleCartDto updateRequest);

	public List<MyCartIteamsDto> removeFromCart(Long userId, Long productId, String removeType);

}
