package com.commitmate.re_cord.global.security.exception;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // 필터에서 setAttribute로 넣어준 exception code를 얻음
        String exceptionCode = (String) request.getAttribute("exception");

        if (isRestRequest(request)) {
            handleRestResponse(request, response, exceptionCode);
        } else {
            handlePageResponse(request, response, exceptionCode);
        }
    }

    private void handleRestResponse(HttpServletRequest request,
                                    HttpServletResponse response,
                                    String exceptionCode) throws IOException {
        JwtExceptionCode code = (exceptionCode != null)
                ? JwtExceptionCode.fromCode(exceptionCode)
                : JwtExceptionCode.UNAUTHORIZED_ACCESS;

        log.error("REST request - Exception code: {}", exceptionCode);

        Map<String, Object> errorInfo = new HashMap<>();
        errorInfo.put("code", code.getCode());
        errorInfo.put("message", code.getMessage());

        String jsonResponse = new Gson().toJson(errorInfo);

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(jsonResponse);
    }

    private void handlePageResponse(HttpServletRequest request, HttpServletResponse response, String exception) throws IOException {
        String uri = request.getRequestURI();
        if (uri.startsWith("/loginform")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized access. Please login.");
        } else {
            response.sendRedirect("/loginform");
        }
    }

    private boolean isRestRequest(HttpServletRequest request) {
        String requestedWithHeader = request.getHeader("X-Requested-With");
        return "XMLHttpRequest".equals(requestedWithHeader)
                || request.getRequestURI().startsWith("/api/");
    }
}
