package com.buyerservice.app.service.impl;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.buyerservice.app.dto.VehicleModelsDto;
import com.buyerservice.app.entity.VehicleModelDetailsEntity;
import com.buyerservice.app.repo.VehicleModelsRepo;
import com.buyerservice.app.service.VehicleModelsService;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class VehicleModelsServiceImpl implements VehicleModelsService {

	@Autowired
	private S3Presigner presigner;

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.presign.expiry.minutes}")
	private long presignExpiryMinutes;

	@Autowired
	private VehicleModelsRepo modelsRepo;

	@Override
	public List<VehicleModelsDto> loadVehicleModels(long brandId) {

		List<VehicleModelDetailsEntity> vehicleModelsList = modelsRepo.findByBrandId(brandId);

		if (vehicleModelsList == null || vehicleModelsList.isEmpty()) {
			return Collections.emptyList();
		}

		return vehicleModelsList.stream().filter(Objects::nonNull)
				.collect(Collectors.toMap(VehicleModelDetailsEntity::getModelName, entry -> entry, (e1, e2) -> e1))
				.values().stream().map(entry -> {

					VehicleModelsDto dto = new VehicleModelsDto();
					dto.setModelId(entry.getModelId());
					dto.setModelName(entry.getModelName());
					String modelDurationDate = entry.getModelYearFrom() + "-" + entry.getModelYearTo();
					dto.setModelDurationDate(modelDurationDate);

					dto.setModelImageUrl(getPrisignedUrlFromName(entry.getModelImage()));

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
