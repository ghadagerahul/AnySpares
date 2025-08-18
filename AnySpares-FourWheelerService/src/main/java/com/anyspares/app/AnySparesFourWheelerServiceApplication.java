package com.anyspares.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AnySparesFourWheelerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnySparesFourWheelerServiceApplication.class, args);
	}

}
