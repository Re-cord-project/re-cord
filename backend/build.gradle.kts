plugins {
	java
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.commitmate"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation ("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0") //2025-04-14 swagger 테스트로 추가
	implementation ("org.springframework.boot:spring-boot-starter-security") //2025-04-14 테스트로 추가
	implementation("org.springframework.boot:spring-boot-starter-web")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	runtimeOnly("com.h2database:h2")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	runtimeOnly("com.mysql:mysql-connector-j")

	// jwt & json
	// jwts
	implementation("io.jsonwebtoken:jjwt-api:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

	// swagger
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.5")


	//gson - json 메시지를 다루기 위한 라이브러리
	implementation("com.google.code.gson:gson")

	implementation("jakarta.validation:jakarta.validation-api:3.0.2")
	// security
//	implementation("org.springframework.boot:spring-boot-starter-security")

	// Oauth2
//	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")



}

tasks.withType<Test> {
	useJUnitPlatform()
}