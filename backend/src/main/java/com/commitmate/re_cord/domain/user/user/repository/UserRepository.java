package com.commitmate.re_cord.domain.user.user.repository;

import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

}

