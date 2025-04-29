package com.commitmate.re_cord.domain.user.user.controller;

import com.commitmate.re_cord.global.security.TempTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class TempTokenController {

    private final TempTokenProvider tempTokenProvider;

    @PostMapping("/temp-token/verify")
    public Map<String, Object> verifyTempToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        return tempTokenProvider.parseTempToken(token);
    }
}
