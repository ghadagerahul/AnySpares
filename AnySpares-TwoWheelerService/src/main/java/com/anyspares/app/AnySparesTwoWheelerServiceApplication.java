package com.anyspares.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AnySparesTwoWheelerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnySparesTwoWheelerServiceApplication.class, args);
	}

}
