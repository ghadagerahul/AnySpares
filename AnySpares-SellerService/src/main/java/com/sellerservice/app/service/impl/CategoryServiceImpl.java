package com.sellerservice.app.service.impl;

import java.io.IOException;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sellerservice.app.constants.AppConstants;
import com.sellerservice.app.entity.CategoryEntity;
import com.sellerservice.app.model.CategoryDto;
import com.sellerservice.app.model.CategoryResponseDto;
import com.sellerservice.app.model.ProductSummaryDto;
import com.sellerservice.app.repo.CategoryRepository;
import com.sellerservice.app.repo.ProductRepository;
import com.sellerservice.app.service.CategoryService;

import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class CategoryServiceImpl implements CategoryService {

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.presign.expiry.minutes}")
	private long presignExpiryMinutes;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private S3Client client;

	@Autowired
	private S3Presigner presigner;

	@Override
	public boolean addCategory(CategoryDto categoryDto) {

		if (categoryDto == null) {
			return false;
		}

		CategoryEntity entity = new CategoryEntity();
		entity.setCategoryName(categoryDto.getName());
		entity.setCategoryForvehicletype(categoryDto.getForvehicletype());
		entity.setDescription(categoryDto.getDescription());
		entity.setColor(categoryDto.getColor());

		MultipartFile image = categoryDto.getImage();
		String originalFilename = image.getOriginalFilename();
		String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
		String fileName = UUID.randomUUID().toString() + extention;

		uploadImageToS3(image, fileName);
		entity.setImage(fileName);
		entity.setTotalProducts(categoryDto.getTotalProducts());

		CategoryEntity savedEntity = categoryRepository.save(entity);

		return savedEntity != null && savedEntity.getCategoryId() != null;
	}

	private void uploadImageToS3(MultipartFile image, String fileName) {

		PutObjectRequest putObjectRequest = software.amazon.awssdk.services.s3.model.PutObjectRequest.builder()
				.bucket(bucketName).key(fileName).contentType(image.getContentType()).build();
		try {
			PutObjectResponse putObject = client.putObject(putObjectRequest,
					RequestBody.fromInputStream(image.getInputStream(), image.getSize()));

		} catch (AwsServiceException | SdkClientException | IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public boolean categoryExists(String categoryName) {

		if (categoryName == null || categoryName.trim().isEmpty()) {
			return false;
		}

		return categoryRepository.existsByCategoryName(categoryName);
	}

	@Override
	public List<CategoryResponseDto> getAllCategories() {

		List<CategoryEntity> entities = categoryRepository.findAll();

		if (entities.isEmpty()) {
			return Collections.emptyList();
		}

		return entities.stream().map(entity -> {
			CategoryResponseDto dto = new CategoryResponseDto();
			dto.setCategoryId(entity.getCategoryId());
			dto.setName(entity.getCategoryName());
			dto.setForvehicletype(entity.getCategoryForvehicletype());
			dto.setDescription(entity.getDescription());
			dto.setColor(entity.getColor());
			dto.setTotalProducts(entity.getTotalProducts());

			String imagename = entity.getImage();
			dto.setImage(getPresignedS3Url(imagename));

			return dto;
		}).collect(Collectors.toList());
	}

	private String getPresignedS3Url(String imagename) {

		if (StringUtils.isBlank(imagename))
			return "";

		GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(imagename).build();

		PresignedGetObjectRequest presignedGet = presigner.presignGetObject(
				r -> r.getObjectRequest(getObjectRequest).signatureDuration(Duration.ofMinutes(presignExpiryMinutes)));

		return presignedGet.url().toString();
	}

	@Override
	public void getCategoriesById() {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean updateCategory(Long id, CategoryDto categoryDto) {

		if (id == null || categoryDto == null) {
			return false;
		}

		return categoryRepository.findById(id).map(existingCategory -> {

			existingCategory.setCategoryName(categoryDto.getName());
			existingCategory.setCategoryForvehicletype(existingCategory.getCategoryForvehicletype());
			existingCategory.setDescription(categoryDto.getDescription());
			existingCategory.setColor(categoryDto.getColor());

			MultipartFile image = categoryDto.getImage();
			String originalFilename = image.getOriginalFilename();
			String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
			String fileName = UUID.randomUUID().toString() + extention;

			uploadImageToS3(image, fileName);

			existingCategory.setImage(fileName);
			// Need to update products under category from product table on category &
			// vehicle type
			existingCategory.setTotalProducts(categoryDto.getTotalProducts());

			categoryRepository.save(existingCategory);
			return true;
		}).orElse(false);
	}

	@Override
	public boolean deleteCategory(Long categoryId) throws Exception {

		if (categoryId == null) {
			throw new IllegalArgumentException("Category id must not be null");
		}

		if (!categoryRepository.existsById(categoryId)) {
			return false;
		}

		categoryRepository.deleteById(categoryId);
		return true;
	}

	@Override
	public ProductSummaryDto getProductSummary() {

		ProductSummaryDto dto = new ProductSummaryDto();

		Integer total = productRepository.getProductSummary();
		Integer active = productRepository.getProductSummaryByStatus(AppConstants.STATUS_ACTIVE);
		Integer outOfStock = productRepository.getProductSummaryByStatus(AppConstants.STATUS_OUTOFSTOCK);

		dto.setTotal(total != null ? total : 0);
		dto.setActive(active != null ? active : 0);
		dto.setOutOfStock(outOfStock != null ? outOfStock : 0);

		return dto;
	}

}
