package com.commitmate.re_cord;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableJpaAuditing
@SpringBootApplication
@EnableScheduling // 스케쥴러를 사용하기 위한 어노테이션
public class ReCordApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReCordApplication.class, args);
	}

}