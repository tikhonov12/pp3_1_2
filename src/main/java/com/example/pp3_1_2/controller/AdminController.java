package com.example.pp3_1_2.controller;


import com.example.pp3_1_2.service.RoleService;
import com.example.pp3_1_2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {


    private UserService userService;
    private RoleService roleService;

    public AdminController() {
    }

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/home")
    public String home(Model model, Principal principal) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("auth", userService.findByName(principal.getName()));
        model.addAttribute("userService", userService);
        model.addAttribute("roleService", roleService);
        return "home";
    }
}
