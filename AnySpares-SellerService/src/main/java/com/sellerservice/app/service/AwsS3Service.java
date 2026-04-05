package com.sellerservice.app.service;

import org.springframework.web.multipart.MultipartFile;

public interface AwsS3Service {

	public String uploadFile(MultipartFile file);

	public String presignFileWithUrl(String fileName, String contentType);

}
