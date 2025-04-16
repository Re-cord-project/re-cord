package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.exception.exceptions.OAuth2AdditionalInfoRequiredException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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

    // 소셜 로그인이 성공할 때마다 이 함수가 실행된다.
    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String oauthId = oAuth2User.getName();

        String providerTypeCode = userRequest
                .getClientRegistration()
                .getRegistrationId()
                .toUpperCase(Locale.getDefault());

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, String> attributesProperties = (Map<String, String>) attributes.get("properties");

        String nickname = attributesProperties.get("nickname");
//        String profileImgUrl = attributesProperties.get("profile_image"); // 이미지는 안받아옴
        String username = providerTypeCode + "__" + oauthId;
        Provider provider = Provider.valueOf(providerTypeCode);

        Optional<User> optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            // 기존 유저 로그인
            User user = optionalUser.get();
            return new SecurityUser(user.getId(), user.getUsername(), "", user.getNickname(), user.getAuthorities());
        }

        // 👇 새 유저: 추가 정보 입력 필요 (임시 User 생성)
        User tempUser = userService.createTempUser(username, nickname, provider);

        // 이후 프론트에서 /signup/oauth2 페이지로 이동하여 추가 정보 입력 유도
        throw new OAuth2AdditionalInfoRequiredException(username);
    }
}
