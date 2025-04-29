package com.commitmate.re_cord.domain.user.user.repository;


import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByRefreshToken(String refreshToken);
    Optional<User> findByEmail(String email);
    Optional<User> getUserById(Long id);


    Optional<User> findByOauthId(String oauthId);

    //중복 상태 체크

    boolean existsByUsernameAndIdNot(String username, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByEmail(String email);

    Optional<User> findByBlogName(String blogName);

    Optional<User> getBootcampById(Long id);

    @Query("""
        SELECT u FROM User u
        JOIN u.categories c
        WHERE c.id = :categoryId
    """)
    List<User> findUsersByCategoryId(@Param("categoryId") Long categoryId);
}

