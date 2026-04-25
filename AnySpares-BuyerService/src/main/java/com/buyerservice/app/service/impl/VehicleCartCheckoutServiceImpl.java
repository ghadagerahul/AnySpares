package com.buyerservice.app.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.buyerservice.app.constants.Constants;
import com.buyerservice.app.dto.BuyerUserRegistrationDto;
import com.buyerservice.app.dto.VehicleCheckoutContactDto;
import com.buyerservice.app.dto.VehicleOrderAddressDto;
import com.buyerservice.app.entity.VehicleCheckoutAddressEntity;
import com.buyerservice.app.entity.VehicleCheckoutContactEntity;
import com.buyerservice.app.repo.VehicleCheckoutAddressRepo;
import com.buyerservice.app.repo.VehicleCheckoutContactRepo;
import com.buyerservice.app.service.VehicleCartCheckoutService;

@Repository
public class VehicleCartCheckoutServiceImpl implements VehicleCartCheckoutService {

	private static final Logger logger = LoggerFactory.getLogger(VehicleCartCheckoutServiceImpl.class);

	@Autowired
	private VehicleCheckoutAddressRepo vehicleCheckoutCartRepository;

	@Autowired
	private VehicleCheckoutContactRepo vehicleOrderContactRepo;

	@Autowired
	private RestTemplate restTemplate;

	@Override
	public List<VehicleOrderAddressDto> getOrderAddress(String userId) {
		try {
			List<VehicleOrderAddressDto> orderAddressDtos = null;
			List<VehicleCheckoutAddressEntity> addressListr = vehicleCheckoutCartRepository.findByUserId(userId);
			if (null != addressListr && !addressListr.isEmpty()) {
				orderAddressDtos = addressListr.stream().filter(Objects::nonNull).map(entry -> {
					VehicleOrderAddressDto orderAddressDto = new VehicleOrderAddressDto();
					orderAddressDto.setId(entry.getId());
					orderAddressDto.setUserId(entry.getUserId());
					orderAddressDto.setName(entry.getName());
					orderAddressDto.setPhone(entry.getPhone());
					orderAddressDto.setStreet(entry.getStreet());
					orderAddressDto.setCity(entry.getCity());
					orderAddressDto.setState(entry.getState());
					orderAddressDto.setPincode(entry.getPincode());
					orderAddressDto.setIsDefault(StringUtils.equalsIgnoreCase(entry.getIsDefault(), "Y"));
					orderAddressDto.setCreatedAt(entry.getCreatedAt());
					orderAddressDto.setUpdatedAt(entry.getUpdatedAt());
					return orderAddressDto;
				}).toList();
				return orderAddressDtos;
			}
			return new ArrayList<>();
		} catch (Exception ex) {
			logger.error("Error in getOrderAddress for userId {}: {}", userId, ex.getMessage(), ex);
			return new ArrayList<>();
		}
	}

	@Override
	public List<VehicleOrderAddressDto> saveOrderAddress(VehicleOrderAddressDto orderAddressDto) {
		try {
			VehicleCheckoutAddressEntity orderAddressEntity = new VehicleCheckoutAddressEntity();
			orderAddressEntity.setUserId(orderAddressDto.getUserId());
			orderAddressEntity.setName(orderAddressDto.getName());
			orderAddressEntity.setPhone(orderAddressDto.getPhone());
			orderAddressEntity.setStreet(orderAddressDto.getStreet());
			orderAddressEntity.setCity(orderAddressDto.getCity());
			orderAddressEntity.setState(orderAddressDto.getState());
			orderAddressEntity.setPincode(orderAddressDto.getPincode());
			String flag = orderAddressDto.getIsDefault() != null ? orderAddressDto.getIsDefault() ? "Y" : "N" : "N";
			orderAddressEntity.setIsDefault(flag);
			vehicleCheckoutCartRepository.save(orderAddressEntity);
			return getOrderAddress(orderAddressDto.getUserId());
		} catch (Exception ex) {
			logger.error("Error in saveOrderAddress for userId {}: {}",
					orderAddressDto != null ? orderAddressDto.getUserId() : null, ex.getMessage(), ex);
			return new ArrayList<>();
		}
	}

	@Override
	@Transactional
	public List<VehicleOrderAddressDto> updateOrderAddress(String addressId, VehicleOrderAddressDto addressDto) {
		try {
			vehicleCheckoutCartRepository.findById(Long.valueOf(addressId)).ifPresent(entry -> {
				entry.setName(addressDto.getName());
				entry.setPhone(addressDto.getPhone());
				entry.setStreet(addressDto.getStreet());
				entry.setCity(addressDto.getCity());
				entry.setState(addressDto.getState());
				entry.setPincode(addressDto.getPincode());
				entry.setIsDefault(addressDto.getIsDefault() ? "Y" : "N");
				vehicleCheckoutCartRepository.save(entry);
			});
			if (addressDto.getIsDefault())
				vehicleCheckoutCartRepository.unselectDefaultAddresses(addressDto.getId(), addressDto.getUserId());
			return getOrderAddress(addressDto.getUserId());
		} catch (Exception ex) {
			logger.error("Error in updateOrderAddress for addressId {}: {}", addressId, ex.getMessage(), ex);
			return new ArrayList<>();
		}
	}

	@Override
	public List<VehicleOrderAddressDto> deleteOrderAddress(String addressId) {
		try {
			vehicleCheckoutCartRepository.findById(Long.valueOf(addressId)).ifPresent(entry -> {
				vehicleCheckoutCartRepository.delete(entry);
			});
			return vehicleCheckoutCartRepository.findById(Long.valueOf(addressId))
					.map(entry -> getOrderAddress(entry.getUserId())).orElseGet(ArrayList::new);
		} catch (Exception ex) {
			logger.error("Error in deleteOrderAddress for addressId {}: {}", addressId, ex.getMessage(), ex);
			return new ArrayList<>();
		}
	}

	@Override
	public List<VehicleCheckoutContactDto> getOrderContacts(String userId) {
		logger.info("Fetching order contacts for userId: {}", userId);
		try {
			List<VehicleCheckoutContactDto> vehicleOrderContactDtoList = vehicleOrderContactRepo.findByUserId(userId)
					.stream().filter(Objects::nonNull).map(entry -> {
						VehicleCheckoutContactDto orderContactDto = new VehicleCheckoutContactDto();
						orderContactDto.setId(entry.getId());
						orderContactDto.setUserId(entry.getUserId());
						orderContactDto.setName(entry.getName());
						orderContactDto.setPhone(entry.getPhone());
						orderContactDto.setEmail(entry.getEmail());
						return orderContactDto;
					}).toList();

			if (vehicleOrderContactDtoList == null || vehicleOrderContactDtoList.isEmpty()) {
				String url = Constants.USER_SERVICE_URL + "/v1/auth/user-details/" + userId;
				logger.info("No local contacts found. Calling UserService API: {}", url);
				try {
					BuyerUserRegistrationDto user = restTemplate.getForObject(url, BuyerUserRegistrationDto.class);
					if (user != null) {
						VehicleCheckoutContactDto orderContactDto = new VehicleCheckoutContactDto();
						orderContactDto.setUserId(userId);
						orderContactDto.setName(user.getUserName());
						orderContactDto.setPhone(String.valueOf(user.getMobileNo()));
						orderContactDto.setEmail(user.getEmailId());
						VehicleCheckoutContactDto saved = saveOrderContacts(orderContactDto);
						logger.info("UserService API returned user. Saved contact for userId: {}", userId);
						return List.of(saved);
					} else {
						logger.warn("UserService API returned null for userId: {}", userId);
					}
				} catch (Exception ex) {
					logger.error("Error calling UserService API for userId {}: {}", userId, ex.getMessage(), ex);
				}
			}
			logger.info("Returning {} order contacts for userId: {}", vehicleOrderContactDtoList.size(), userId);
			return vehicleOrderContactDtoList;
		} catch (Exception ex) {
			logger.error("Error in getOrderContacts for userId {}: {}", userId, ex.getMessage(), ex);
			return new ArrayList<>();
		}
	}

	@Override
	public VehicleCheckoutContactDto saveOrderContacts(VehicleCheckoutContactDto dto) {
		if (dto == null) {
			logger.warn("Attempted to save null VehicleOrderContactDto");
			return null;
		}
		try {
			logger.info("Saving order contact for userId: {}", dto.getUserId());

			if (null != dto && dto.getId() != null && dto.getId() > 0) {

				logger.info("Updating existing order contact with id: {}", dto.getId());
				vehicleOrderContactRepo.findById(dto.getId()).ifPresent(entry -> {
					if (!StringUtils.equalsIgnoreCase(entry.getName(), dto.getName())
							|| StringUtils.equalsIgnoreCase(entry.getPhone(), dto.getPhone())
							|| StringUtils.equalsIgnoreCase(entry.getEmail(), dto.getEmail())) {
						entry.setName(dto.getName());
						entry.setPhone(dto.getPhone());
						entry.setEmail(dto.getEmail());
						vehicleOrderContactRepo.save(entry);
					}
				});
				return getOrderContacts(dto.getUserId()).stream().filter(contact -> contact.getId().equals(dto.getId()))
						.findFirst().orElse(null);
			}

			VehicleCheckoutContactEntity orderContactEntity = new VehicleCheckoutContactEntity();
			orderContactEntity.setUserId(dto.getUserId());
			orderContactEntity.setName(dto.getName());
			orderContactEntity.setPhone(dto.getPhone());
			orderContactEntity.setEmail(dto.getEmail());
			VehicleCheckoutContactEntity save = vehicleOrderContactRepo.save(orderContactEntity);

			if (save != null) {
				logger.info("Order contact saved successfully for userId: {}", dto.getUserId());
				return dto;
			} else {
				logger.error("Failed to save order contact for userId: {}", dto.getUserId());
				return null;
			}
		} catch (Exception ex) {
			logger.error("Error in saveOrderContacts for userId {}: {}", dto.getUserId(), ex.getMessage(), ex);
			return null;
		}
	}

}