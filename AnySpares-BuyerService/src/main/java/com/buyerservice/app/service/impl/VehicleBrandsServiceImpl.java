package com.buyerservice.app.service.impl;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.buyerservice.app.dto.VehicleBrandsDto;
import com.buyerservice.app.entity.VehicleBrandDetailsEntity;
import com.buyerservice.app.repo.VehicleBrandsRepo;
import com.buyerservice.app.service.VehicleBrandsService;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class VehicleBrandsServiceImpl implements VehicleBrandsService {

	@Autowired
	private S3Presigner presigner;

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.presign.expiry.minutes}")
	private long presignExpiryMinutes;

	@Autowired
	private VehicleBrandsRepo brandsRepo;

	@Override
	public List<VehicleBrandsDto> loadVehicleBrands(String vehicleType) {

		List<VehicleBrandDetailsEntity> vehicleBrandList = brandsRepo.findByVehicleCategory(vehicleType);

		if (vehicleBrandList == null || vehicleBrandList.isEmpty()) {
			return Collections.emptyList();
		}

		return vehicleBrandList.stream().filter(Objects::nonNull).collect(Collectors
				.toMap(VehicleBrandDetailsEntity::getBrandName, entity -> entity, (existing, replacement) -> existing

				)).values().stream().map(entity -> {
					VehicleBrandsDto dto = new VehicleBrandsDto();

					dto.setBrandId(entity.getVid());
					dto.setBrndname(entity.getBrandName());
					String imageUrl = StringUtils.isNotBlank(entity.getBrandImage())
							? getPrisignedUrlFromName(entity.getBrandImage())
							: "";

					dto.setImageName(imageUrl);
					return dto;
				}).collect(Collectors.toList());
	}

	private String getPrisignedUrlFromName(String fileName) {

		GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(fileName).build();

		PresignedGetObjectRequest presignedGet = presigner.presignGetObject(
				r -> r.getObjectRequest(getObjectRequest).signatureDuration(Duration.ofMinutes(presignExpiryMinutes)));

		return presignedGet.url().toString();

	}
}
