package com.buyerservice.app.service.impl;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.buyerservice.app.dto.VehicleCategoryDto;
import com.buyerservice.app.dto.VehicleModelsDto;
import com.buyerservice.app.entity.VehicleCategoryEntity;
import com.buyerservice.app.repo.VehicleCategoriesRepo;
import com.buyerservice.app.service.VehicleCategoryService;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class VehicleCategoryServiceImpl implements VehicleCategoryService {

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.presign.expiry.minutes}")
	private long presignExpiryMinutes;

	@Autowired
	private S3Presigner presigner;

	@Autowired
	private VehicleCategoriesRepo categoriesRepo;

	@Override
	public List<VehicleCategoryDto> loadVehicleCategory(String vehicleType) {

		List<VehicleCategoryEntity> categoryForvehicletypeList = categoriesRepo
				.findByCategoryForvehicletype(vehicleType);

		if (null == categoryForvehicletypeList || categoryForvehicletypeList.size() == 0)
			return Collections.emptyList();

		return categoryForvehicletypeList.stream().filter(Objects::nonNull)
				.collect(Collectors.toMap(VehicleCategoryEntity::getCategoryName, category -> category, (e1, e2) -> e1))
				.values().stream().map(entry -> {

					VehicleCategoryDto categoryDto = new VehicleCategoryDto();
					categoryDto.setCategoryId(entry.getCategoryId());
					categoryDto.setName(entry.getCategoryName());
					categoryDto.setDescription(entry.getDescription());

					String imageName = entry.getImage();
					categoryDto.setImage(getPrisignedUrlFromName(imageName));
					return categoryDto;
				}).collect(Collectors.toList());

	}

	private String getPrisignedUrlFromName(String fileName) {

		GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(fileName).build();

		PresignedGetObjectRequest presignedGet = presigner.presignGetObject(
				r -> r.getObjectRequest(getObjectRequest).signatureDuration(Duration.ofMinutes(presignExpiryMinutes)));

		return presignedGet.url().toString();
	}

}
