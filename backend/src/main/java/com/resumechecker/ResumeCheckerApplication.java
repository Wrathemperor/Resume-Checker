package com.resumechecker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ResumeCheckerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResumeCheckerApplication.class, args);
	}

}
