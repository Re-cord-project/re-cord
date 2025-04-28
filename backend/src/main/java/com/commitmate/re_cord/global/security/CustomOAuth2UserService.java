package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.exception.exceptions.OAuth2AdditionalInfoRequiredException;
import com.commitmate.re_cord.global.security.SecurityUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserService userService;
    private final TempTokenProvider tempTokenProvider;

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
        String email = null;
        String username = null;

        // 각 소셜 로그인에 맞는 필드를 분기 처리
        if ("KAKAO".equalsIgnoreCase(providerTypeCode)) {
            Map<String, String> attributesProperties = (Map<String, String>) attributes.get("properties");
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null && kakaoAccount.get("email") != null) {
                email = (String) kakaoAccount.get("email");
            }
            username = attributesProperties.get("nickname");
        } else if ("GITHUB".equalsIgnoreCase(providerTypeCode)) {
            // GitHub에서 이메일과 사용자명 가져오기
            Map<String, Object> githubAccount = (Map<String, Object>) attributes;
            email = (String) githubAccount.get("email");
            username = (String) githubAccount.get("login"); // GitHub에서 username은 "login" 필드로 제공됨
        }

        String oauthId = providerTypeCode + "__" + socialOauthId;
        Provider provider = Provider.valueOf(providerTypeCode);
        String profileImageUrl = "https://re-cord.s3.ap-northeast-2.amazonaws.com/user/profile/default-profile.png";

        Optional<User> optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            // 기존 유저 로그인
            User user = optionalUser.get();
            return new SecurityUser(user.getId(), user.getOauthId(), user.getUsername(), "", user.getAuthorities());
        }

        // 👇 새 유저: 추가 정보 입력 필요 (임시 User 생성)
        User tempUser = null;
        try {
            tempUser = userService.createTempUser(oauthId, username, email, provider, profileImageUrl);
        } catch (Exception e) {
            // 예외 로깅
            e.printStackTrace();
        }

        // 사용자 생성이 성공했다면 리다이렉트 예외 발생
        // 응답 헤더에 한글이 들어가므로 인코딩해준다.
        if (tempUser != null && tempUser.getId() != null) {
            // 임시 사용자 존재 → 추가 정보 입력이 필요하므로 예외 던짐
            String tempToken = tempTokenProvider.createTempToken(oauthId, username, email);
            throw new OAuth2AdditionalInfoRequiredException(tempToken);
        } else {
            // 사용자 생성 실패 처리
            throw new AuthenticationServiceException("임시 사용자 생성에 실패했습니다");
        }

    }
}
