package com.commitmate.re_cord.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@Profile("dev")  // 개발 환경에서만 적용되도록 설정
public class TestSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/", "/home", "/register", "/login").permitAll()  // 누구나 접근 가능
                                .requestMatchers("/board/**").permitAll()  // 게시판 API도 누구나 접근 가능하도록 설정
                                .anyRequest().permitAll()  // 그 외 모든 URL도 허용
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
