package com.commitmate.re_cord.domain.post.post.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ApiV1PostController {
    @PostMapping
    public String index() {
        return "Hello World!";
    }

    @PostMapping
    public String create(){
        return "Post Created";
    }
}
