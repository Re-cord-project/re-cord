package com.commitmate.re_cord.domain.user.user.repository;


import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByRefreshToken(String refreshToken);
    Optional<User> findByEmail(String email);
    Optional<User> getUserById(Long id);

    //중복 상태 체크
    boolean existsByNicknameAndIdNot(String nickname, Long id);
    boolean existsByEmailAndIdNot(String email, Long id);

}

