package com.sellerservice.app.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sellerservice.app.entity.ProductEntity;
import com.sellerservice.app.model.ProductDto;
import com.sellerservice.app.repo.CategoryRepository;
import com.sellerservice.app.repo.ProductRepository;
import com.sellerservice.app.service.AwsS3Service;
import com.sellerservice.app.service.TwoWheelerProductService;

@Service
public class TwoWheelerProductServiceImpl implements TwoWheelerProductService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private AwsS3Service awsS3Service;

	@Autowired
	private CategoryRepository categoryRepository;

	Logger prodServiceLogger = LoggerFactory.getLogger(getClass());

	@Override
	public boolean addProduct(ProductDto productDto) {
		prodServiceLogger.info("Called TwoWheelerProductServiceImpl-addProduct");

		if (productDto == null) {
			return false;
		}

		// Build compatible models string
		String compatibleModelString = (productDto.getCompatibleModels() == null) ? ""
				: productDto.getCompatibleModels().stream().filter(Objects::nonNull).collect(Collectors.joining("|"));

		// Upload image if present
		String uploadedFileName = null;

		if (productDto.getImages() != null && productDto.getImages().size() > 0) {
			MultipartFile imageFile = productDto.getImages().get(0);
			uploadedFileName = awsS3Service.uploadFile(imageFile);
		}

		// Check for existing product
		Optional<ProductEntity> existingOpt = productRepository.findByNameAndBrandAndModelAndMrp(productDto.getName(),
				productDto.getBrand(), productDto.getModel(), productDto.getMrp());

		ProductEntity entity = existingOpt.orElse(new ProductEntity());

		// Map fields common for both new and update
		entity.setName(productDto.getName());
		entity.setVehicleType(productDto.getVehicleType());
		entity.setBrand(productDto.getBrand());
		entity.setModel(productDto.getModel());
		entity.setCategory(productDto.getCategory());
		entity.setStatus(productDto.getStatus());
		entity.setType(productDto.getType());
		entity.setMrp(productDto.getMrp());
		entity.setPrice(productDto.getPrice());

		entity.setStock((entity.getStock() != null ? entity.getStock() : 0) + productDto.getStock());
		entity.setMinQty(productDto.getMinQty());
		entity.setDescription(productDto.getDescription());
		entity.setCompatibleModels(compatibleModelString);
		entity.setWarranty(productDto.isWarranty());

		if (uploadedFileName != null) {
			entity.setProductimage(uploadedFileName);
		}

		ProductEntity saved = productRepository.save(entity);

		if (StringUtils.isNotBlank(saved.getCategory())) {
			updateTotalProductsToCategoryDetails(saved);
		}

		return true;
	}

	private void updateTotalProductsToCategoryDetails(ProductEntity save) {
		String categoryName = save.getCategory().trim();
		try {
			categoryRepository.updateTotalProducts(categoryName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public List<ProductEntity> getProductsByCategoryType(String categoryType) {
		// TODO Auto-generated method stub
		List<ProductEntity> productCategoryList = null;
		try {
			productCategoryList = productRepository.getByCategory(categoryType);

			if (null != productCategoryList)
				return productCategoryList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return productCategoryList;

	}

	@Override
	public Map<String, List<String>> getProductCategoriesList() {

		Map<String, List<String>> formReloadDatamap = new HashMap<>();
		formReloadDatamap.put("category", safeSortedList(categoryRepository.findDistinctCategories()));
		formReloadDatamap.put("brands", safeSortedList(productRepository.findDistinctBrands()));
		formReloadDatamap.put("models", safeSortedList(productRepository.findDistinctModels()));
		return formReloadDatamap;
	}

	private List<String> safeSortedList(List<String> source) {
		return Optional.ofNullable(source).orElse(Collections.emptyList()).stream().filter(Objects::nonNull).sorted()
				.toList();
	}

	@Override
	public ProductEntity getProductByProductId(String productId) {

		ProductEntity existing = productRepository.findById(Long.parseLong(productId)).get();

		return existing;
	}

	@Override
	public boolean updateProduct(ProductDto dto, String productId) {

		prodServiceLogger.info("TwoWheelerProductServiceImpl-updateProduct:productId: " + productId);
		prodServiceLogger.info("TwoWheelerProductServiceImpl-updateProduct:dto: " + dto);

		return productRepository.findById(Long.parseLong(productId)).map(existing -> {

			existing.setName(dto.getName());
			existing.setVehicleType(dto.getVehicleType());
			existing.setBrand(dto.getBrand());
			existing.setCategory(dto.getCategory());
			existing.setModel(dto.getModel());
			existing.setType(dto.getType());
			existing.setMrp(dto.getMrp());
			existing.setPrice(dto.getPrice());
			Integer updatedStock = dto.getStock() + existing.getStock();
			existing.setStock(updatedStock);
			existing.setMinQty(dto.getMinQty());
			existing.setDescription(dto.getDescription());
			existing.setWarranty(dto.isWarranty());
			existing.setStatus(dto.getStatus());

			// Compatible models simplified
			String compatibleModels = (dto.getCompatibleModels() == null || dto.getCompatibleModels().isEmpty()) ? ""
					: dto.getCompatibleModels().stream().filter(Objects::nonNull).collect(Collectors.joining("|"));
			existing.setCompatibleModels(compatibleModels);

			ProductEntity saved = productRepository.save(existing);

			if (StringUtils.isNotBlank(saved.getCategory())) {
				updateTotalProductsToCategoryDetails(saved);
			}
			return true;
		}).orElse(false);
	}

}
