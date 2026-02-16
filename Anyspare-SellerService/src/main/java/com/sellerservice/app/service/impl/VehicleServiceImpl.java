package com.sellerservice.app.service.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sellerservice.app.entity.VehicleBrandDetailsEntity;
import com.sellerservice.app.entity.VehicleModelDetailsEntity;
import com.sellerservice.app.model.VehicleBrandsDetailsDto;
import com.sellerservice.app.model.VehicleModelDetailsDto;
import com.sellerservice.app.repo.VehicleBrandsDetailsRepo;
import com.sellerservice.app.repo.VehicleModelsDetailsRepo;
import com.sellerservice.app.service.AwsS3Service;
import com.sellerservice.app.service.VehicleService;

@Service
public class VehicleServiceImpl implements VehicleService {

	@Autowired
	private VehicleBrandsDetailsRepo brandsDetailsRepo;

	@Autowired
	private AwsS3Service awsS3Service;

	@Autowired
	private VehicleModelsDetailsRepo modelDetailsRepo;

	@Override
	public boolean addVehicleBrand(VehicleBrandsDetailsDto detailsDto) {

		if (StringUtils.isNotBlank(detailsDto.getBrandName())) {
			List<VehicleBrandDetailsEntity> byBrandName = brandsDetailsRepo.findByBrandName(detailsDto.getBrandName());
			if (null != byBrandName && byBrandName.size() > 0)
				return false;
		}

		VehicleBrandDetailsEntity entity = new VehicleBrandDetailsEntity();
		entity.setBrandName(detailsDto.getBrandName());
		entity.setVehicleCategory(detailsDto.getVehicleCategory());

		MultipartFile brandImage = detailsDto.getBrandImage();
		if (brandImage != null && !brandImage.isEmpty()) {
			String uploadedFileName = awsS3Service.uploadFile(brandImage);
			entity.setBrandImage(uploadedFileName);
		}

		brandsDetailsRepo.save(entity);
		return true;
	}

	@Override
	public List<VehicleBrandDetailsEntity> getVehicleBrands() {
		return brandsDetailsRepo.findAll();
	}

	@Override
	public boolean addVehicleModels(VehicleModelDetailsDto dto) {

		if (StringUtils.isNotBlank(dto.getModelName())
				&& modelDetailsRepo.findByModelName(dto.getModelName()).size() > 0)
			return false;

		VehicleModelDetailsEntity detailsEntity = new VehicleModelDetailsEntity();
		detailsEntity.setModelId(null);
		detailsEntity.setBrandId(dto.getBrandId());
		detailsEntity.setBrandName(dto.getBrandName());

		detailsEntity.setModelName(dto.getModelName());
		detailsEntity.setModelYearFrom(dto.getModelYearFrom());
		detailsEntity.setModelYearTo(dto.getModelYearTo());
		detailsEntity.setVehicleCategory(dto.getVehicleCategory());

		MultipartFile modelImage = dto.getModelImage();
		String uploadFileName = awsS3Service.uploadFile(modelImage);
		detailsEntity.setModelImage(uploadFileName);

		VehicleModelDetailsEntity save = modelDetailsRepo.save(detailsEntity);
		return true;
	}

}
