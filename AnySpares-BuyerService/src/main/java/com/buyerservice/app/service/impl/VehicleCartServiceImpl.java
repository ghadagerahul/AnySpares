package com.buyerservice.app.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.buyerservice.app.AwsS3Urils;
import com.buyerservice.app.constants.Constants;
import com.buyerservice.app.dto.MyCartIteamsDto;
import com.buyerservice.app.dto.VehicleCartDto;
import com.buyerservice.app.entity.MyBucketEntity;
import com.buyerservice.app.entity.MyBucketItemEntity;
import com.buyerservice.app.repo.VehicleProductRepo;
import com.buyerservice.app.repo.vehicleCartRepo;
import com.buyerservice.app.service.VehicleCartService;
import com.netflix.discovery.converters.Auto;

import software.amazon.awssdk.auth.signer.internal.Aws4SignerUtils;

@Service
public class VehicleCartServiceImpl implements VehicleCartService {

	@Autowired
	private vehicleCartRepo cartRepo;

	@Autowired
	private VehicleProductRepo productRepo;

	@Autowired
	private AwsS3Urils awsS3Urils;

	Logger serviceLogger = LoggerFactory.getLogger(getClass());

	@Override
	public Map<String, Object> addToCart(VehicleCartDto cartDto) {

		Map<String, Object> response = new HashMap<>();

		if (cartDto.getQuantity() <= 0) {
			response.put("message", "Quantity must be greater than 0");
			return response;
		}

		MyBucketEntity bucket = cartRepo.findByUserId(cartDto.getUserId());

		if (bucket == null) {
			bucket = new MyBucketEntity();
			bucket.setUserId(cartDto.getUserId());
			bucket.setItems(new ArrayList<>());
		}

		if (bucket.getItems() == null) {
			bucket.setItems(new ArrayList<>());
		}

		Long productId = cartDto.getProductId();

		Optional<MyBucketItemEntity> optionalItem = bucket.getItems().stream().filter(Objects::nonNull)
				.filter(item -> productId.equals(item.getProductId())).findFirst();

		if (optionalItem.isPresent()) {

			MyBucketItemEntity existingItem = optionalItem.get();
			existingItem.setQuantity(existingItem.getQuantity() + cartDto.getQuantity());
		} else {

			MyBucketItemEntity newItem = new MyBucketItemEntity();
			newItem.setProductId(productId);
			newItem.setQuantity(cartDto.getQuantity());
			newItem.setBucket(bucket);

			bucket.getItems().add(newItem);
		}

		MyBucketEntity savedBucket = cartRepo.save(bucket);

		serviceLogger.info("Bucket updated. Total items: {}", savedBucket.getItems().size());

		response.put("message", "Item added/updated successfully");
		response.put("itemCount", savedBucket.getItems().size());

		return response;
	}

	@Override
	public List<MyCartIteamsDto> getBucketItems(Long userId) {

		MyBucketEntity bucket = cartRepo.findByUserId(userId);

		if (bucket == null || bucket.getItems() == null || bucket.getItems().isEmpty()) {
			return Collections.emptyList();
		}

		List<MyCartIteamsDto> responseList = new ArrayList<>();

		for (MyBucketItemEntity item : bucket.getItems()) {

			MyCartIteamsDto dto = new MyCartIteamsDto();
			dto.setProductId(item.getProductId());
			dto.setQuantity(item.getQuantity());

			productRepo.findById(item.getProductId()).ifPresent(product -> {
				dto.setProductName(product.getName());
				dto.setPrice(product.getPrice());

				String imageUrl = awsS3Urils.getPrisignedUrlFromName(product.getProductimage());
				dto.setImageUrl(imageUrl);
			});

			responseList.add(dto);
		}

		return responseList;
	}

	@Override
	public List<MyCartIteamsDto> updateCart(VehicleCartDto updateRequest) {

		if (Objects.nonNull(updateRequest)) {

			MyBucketEntity bucket = cartRepo.findByUserId(updateRequest.getUserId());

			if (Objects.nonNull(bucket) && Objects.nonNull(bucket.getItems())) {

				bucket.getItems().stream().filter(Objects::nonNull)
						.filter(item -> updateRequest.getProductId() == item.getProductId()).findFirst()
						.ifPresent(item -> {
							item.setQuantity(updateRequest.getQuantity());
							cartRepo.save(bucket);
						});

				List<MyCartIteamsDto> bucketItems = getBucketItems(updateRequest.getUserId());
				return bucketItems;
			}
		}
		return null;
	}

	@Override
	public List<MyCartIteamsDto> removeFromCart(Long userId, Long productId, String removeType) {

		MyBucketEntity bucket = cartRepo.findByUserId(userId);

		if (Objects.nonNull(bucket) && Objects.nonNull(bucket.getItems())) {

			if (!removeType.isBlank() && Constants.REMOVETYPE_ALL.equalsIgnoreCase(removeType)) {
				bucket.getItems().removeIf(item -> item.getProductId() > 0);
				cartRepo.save(bucket);
			} else if (!removeType.isBlank() && Constants.REMOVETYPE_SINGLE.equalsIgnoreCase(removeType)) {
				bucket.getItems().removeIf(item -> productId.equals(item.getProductId()));
				cartRepo.save(bucket);
			}

			List<MyCartIteamsDto> bucketItems = getBucketItems(userId);
			return bucketItems;
		}

		return null;
	}

}
