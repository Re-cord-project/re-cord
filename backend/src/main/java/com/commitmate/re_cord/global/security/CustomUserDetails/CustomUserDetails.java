package com.commitmate.re_cord.global.security.CustomUserDetails;

import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 만약 user.getRole()의 결과가 ENUM이라면 "ROLE_" 접두사를 붙여서 반환합니다.
        return List.of(() -> "ROLE_" + user.getRole().name());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    public String getEmail() {
        return user.getEmail();
    }

    // 추가 사용자 정보를 제공할 수 있음
    public String getBootcamp() {
        return user.getBootcamp();
    }

    public int getGeneration() {
        return user.getGeneration();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 필요시 추가 로직 구현
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 필요시 추가 로직 구현
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 필요시 추가 로직 구현
    }

    @Override
    public boolean isEnabled() {
        return true; // 필요시 추가 로직 구현
    }
}
