package com.example.pp3_1_2.controller;

import com.example.pp3_1_2.model.User;
import com.example.pp3_1_2.service.RoleService;
import com.example.pp3_1_2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/admin")
public class RestAdminController {

    private final UserService userService;

    @Autowired
    public RestAdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody @Valid User user, String newRole) {
        userService.addUser(user, newRole);
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
    @PutMapping("/save/{id}")
    public ResponseEntity<String> update(@PathVariable("id") long id, @RequestBody @Valid User user) {
        userService.updateUser(user, id);
        return new ResponseEntity<>("the user has been changed ", HttpStatus.OK);
    }

    @GetMapping("/findOne/{id}")
    public User findOne(@PathVariable Long id) {
        return userService.findById(id);
    }

    @DeleteMapping("linkDelete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return new ResponseEntity<>("the user has been deleted", HttpStatus.OK);
    }
    @GetMapping("/getAll")
    public ResponseEntity<Set<User>> getAllUsers(){
        return new ResponseEntity<>(userService.getAllUsers(),HttpStatus.OK);
    }
}
