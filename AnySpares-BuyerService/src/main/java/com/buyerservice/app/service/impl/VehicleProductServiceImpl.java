package com.buyerservice.app.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.buyerservice.app.AnyspareBuyerServiceApplication;
import com.buyerservice.app.AwsS3Urils;
import com.buyerservice.app.dto.VehicleProductDto;
import com.buyerservice.app.entity.VehicleModelDetailsEntity;
import com.buyerservice.app.entity.VehicleProductEntiry;
import com.buyerservice.app.repo.VehicleModelsRepo;
import com.buyerservice.app.repo.VehicleProductRepo;
import com.buyerservice.app.service.VehicleProductService;

import io.micrometer.common.util.StringUtils;

@Service
public class VehicleProductServiceImpl implements VehicleProductService {

	@Autowired
	private VehicleProductRepo productRepo;

	@Autowired
	private VehicleModelsRepo modelsRepo;

	@Autowired
	private AwsS3Urils awsS3Urils;

	@Override
	public List<VehicleProductDto> loadProductsData(String modelId, String category, String vehicleType) {

		modelId = StringUtils.isNotBlank(modelId) ? modelId : "0";

		VehicleModelDetailsEntity vehicleModelDetailsEntity = null;
		try {
			vehicleModelDetailsEntity = modelsRepo.findById(Long.parseLong(modelId)).get();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(" vehicleModelDetailsEntity.getModelName(): " + vehicleModelDetailsEntity.getModelName());
		List<VehicleProductEntiry> productsData = productRepo
				.loadProductsData(vehicleModelDetailsEntity.getModelName().trim(), category, vehicleType);

		return productsData.stream().filter(Objects::nonNull)
				.collect(Collectors.toMap(VehicleProductEntiry::getName, entry -> entry, (e1, e2) -> e1)).values()
				.stream().map(entry -> {
					VehicleProductDto dto = new VehicleProductDto();

					dto.setId(entry.getProduct_id());
					dto.setName(entry.getName());
					dto.setType(entry.getType());

					dto.setRating(0); // need to calculate
					dto.setDiscountedPrice(0); // need to calcaulate

					dto.setOriginalPrice(entry.getPrice());
					dto.setDiscount(0); // Need to calculate

					String prisignedUrlFromName = StringUtils.isNotBlank(entry.getProductimage())
							? awsS3Urils.getPrisignedUrlFromName(entry.getProductimage())
							: "";
					dto.setImageUrl(prisignedUrlFromName);

					return dto;
				}).collect(Collectors.toList());

	}

	@Override
	public VehicleProductDto getProductDetails(long productId) {
		VehicleProductEntiry productDetails = null;
		try {
			productDetails = productRepo.findById(productId).get();
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (null == productDetails) {
			return null;
		}

		VehicleProductDto dto = new VehicleProductDto();

		dto.setId(productDetails.getProduct_id());
		dto.setName(productDetails.getName());
		dto.setType(productDetails.getType());

		dto.setRating(0); // need to calculate
		dto.setDiscountedPrice(0); // need to calcaulate

		dto.setOriginalPrice(productDetails.getPrice());
		dto.setDiscount(0); // Need to calculate

		String prisignedUrlFromName = StringUtils.isNotBlank(productDetails.getProductimage())
				? awsS3Urils.getPrisignedUrlFromName(productDetails.getProductimage())
				: "";
		dto.setImageUrl(prisignedUrlFromName);

		return dto;
	}

}
