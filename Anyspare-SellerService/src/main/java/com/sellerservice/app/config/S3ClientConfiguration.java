package com.sellerservice.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3ClientConfiguration {

	@Value("${aws.access-key}")
	private String accessKey;

	@Value("${aws.secret-key}")
	private String secretKey;

	@Value("${aws.region}")
	private String region;

	Logger logger = LoggerFactory.getLogger(getClass());

	@Bean
	S3Client client() {

		AwsBasicCredentials awsBasicCredentials = AwsBasicCredentials.create(accessKey, secretKey);

		S3Presigner.builder().region(Region.of(region))
				.credentialsProvider(StaticCredentialsProvider.create(awsBasicCredentials)).build();

		return S3Client.builder().region(Region.of(region))
				.credentialsProvider(StaticCredentialsProvider.create(awsBasicCredentials)).build();

	}

	@Bean(destroyMethod = "close")
	S3Presigner presigner() {
		logger.info("===========================================================");
		logger.info("==================== Loading Presigner =====================");
		logger.info("===========================================================");

		AwsBasicCredentials awsBasicCredentials = AwsBasicCredentials.create(accessKey, secretKey);

		return S3Presigner.builder().region(Region.of(region))
				.credentialsProvider(StaticCredentialsProvider.create(awsBasicCredentials)).build();
	}

}
