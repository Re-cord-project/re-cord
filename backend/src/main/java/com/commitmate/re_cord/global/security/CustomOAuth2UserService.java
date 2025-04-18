package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.exception.exceptions.OAuth2AdditionalInfoRequiredException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserService userService;

    // 소셜 로그인이 성공할 때마다 이 함수가 실행된다.
    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String socialOauthId = oAuth2User.getName();

        String providerTypeCode = userRequest
                .getClientRegistration()
                .getRegistrationId()
                .toUpperCase(Locale.getDefault());

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, String> attributesProperties = (Map<String, String>) attributes.get("properties");
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        String email = null;
        if (kakaoAccount != null && kakaoAccount.get("email") != null) {
            email = (String) kakaoAccount.get("email");
        }
        String username = attributesProperties.get("nickname");
//        String profileImgUrl = attributesProperties.get("profile_image"); // 이미지는 안받아옴
        String oauthId = providerTypeCode + "__" + socialOauthId;
        Provider provider = Provider.valueOf(providerTypeCode);

        Optional<User> optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            // 기존 유저 로그인
            User user = optionalUser.get();
            return new SecurityUser(user.getId(),user.getOauthId(), user.getUsername(), "", user.getAuthorities());
        }



        // 👇 새 유저: 추가 정보 입력 필요 (임시 User 생성)
//        User tempUser = userService.createTempUser(oauthId, username, provider);
        User tempUser = null;
        try {
            tempUser = userService.createTempUser(oauthId, username, provider);
        } catch (Exception e) {
            // 예외 로깅
            e.printStackTrace();
        }


// 사용자 생성이 성공했다면 리다이렉트 예외 발생
        // 응답 헤더에 한글이 들어가므로 인코딩해준다.
        if (tempUser != null && tempUser.getId() != null) {
            // 임시 사용자 존재 → 추가 정보 입력이 필요하므로 예외 던짐
            throw new OAuth2AdditionalInfoRequiredException(oauthId, username, email);
        } else {
            // 사용자 생성 실패 처리
            throw new AuthenticationServiceException("임시 사용자 생성에 실패했습니다");
        }
    }
}


