package com.commitmate.re_cord.domain.user.user.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Value("${custom.site.backUrl}")
    private String backUrl;

    @Value("${custom.site.frontUrl}")
    private String frontUrl;

    @GetMapping("/")
    public String mainPage(){

        System.out.println("backUrl = " + backUrl);
        System.out.println("frontUrl = " + frontUrl);

        return "Welcome to Main Page";
    }

}
