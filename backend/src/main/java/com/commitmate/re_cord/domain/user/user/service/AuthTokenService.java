//package com.commitmate.re_cord.domain.user.user.service;
//
//import com.commitmate.re_cord.Ut.Ut;
//import com.commitmate.re_cord.domain.user.user.entity.User;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//
//@Service
//public class AuthTokenService {
//    @Value("${custom.jwt.secretKey}")
//    private String jwtSecretKey;
//
//    @Value("${custom.accessToken.expirationSeconds}")
//    private long accessTokenExpirationSeconds;
//
//    String genAccessToken(User user) {
//        long id = user.getId();
//        String username = user.getUsername();
//
//        return Ut.jwt.toString(
//                jwtSecretKey,
//                accessTokenExpirationSeconds,
//                Map.of("id", id, "username", username)
//        );
//    }
//
//    Map<String, Object> payload(String accessToken) {
//        Map<String, Object> parsedPayload = Ut.jwt.payload(jwtSecretKey, accessToken);
//
//        if (parsedPayload == null) return null;
//
//        long id = (long) (Integer) parsedPayload.get("id");
//        String username = (String) parsedPayload.get("username");
//
//        return Map.of("id", id, "username", username);
//    }
//}
