package com.anyspares.app.service.Impl;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.anyspares.app.service.AwsS3Service;

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
public class AwsS3ServiceImpl implements AwsS3Service {

	@Autowired
	private S3Client s3Client;

	@Autowired
	private S3Presigner presigner;

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.presign.expiry.minutes}")
	private long presignExpiryMinutes;

	Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public String uploadFile(MultipartFile file) {
		logger.info("Inside Service to Upload Multipart Image..!!!!");

		String originalFilename = file.getOriginalFilename();

		String extention = originalFilename.substring(originalFilename.lastIndexOf("."));

		String randonUuid = UUID.randomUUID().toString();

		String fileName = randonUuid + extention;

		logger.info("extention: " + extention);
		logger.info("randonUuid: " + randonUuid);
		logger.info("fileName: " + fileName);

		PutObjectRequest putObjectRequest = software.amazon.awssdk.services.s3.model.PutObjectRequest.builder()
				.bucket(bucketName).key(fileName).contentType(file.getContentType()).build();

		try {
			PutObjectResponse putObject = s3Client.putObject(putObjectRequest,
					RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
		} catch (AwsServiceException | SdkClientException | IOException e) {
			e.printStackTrace();
		}

		return fileName;
	}

	@Override
	public String presignFileWithUrl(String fileName, String contentType) {
		logger.info("presignFileWithUrl-fileName: {}", fileName);
		logger.info("presignFileWithUrl-contentType: {}", contentType);
		logger.info("presignFileWithUrl-bucketName: {}", bucketName);
		logger.info("presignFileWithUrl-presignExpiryMinutes: {}", presignExpiryMinutes);

		GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(fileName).build();

		PresignedGetObjectRequest presignedGet = presigner.presignGetObject(
				r -> r.getObjectRequest(getObjectRequest).signatureDuration(Duration.ofMinutes(presignExpiryMinutes)));

		return presignedGet.url().toString();
	}

}
