package com.buyerservice.app;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Component
public class AwsS3Urils {

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.presign.expiry.minutes}")
	private long presignExpiryMinutes;

	@Autowired
	private S3Presigner presigner;

	public String getPrisignedUrlFromName(String fileName) {

		GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(fileName).build();

		PresignedGetObjectRequest presignedGet = null;
		try {
			presignedGet = presigner.presignGetObject(r -> r.getObjectRequest(getObjectRequest)
					.signatureDuration(Duration.ofMinutes(presignExpiryMinutes)));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return presignedGet.url().toString();
	}

}
