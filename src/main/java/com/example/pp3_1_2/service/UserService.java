package com.example.pp3_1_2.service;



import com.example.pp3_1_2.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Set;


public interface UserService extends UserDetailsService {
    User addUser(User user,String role);

    void deleteById(Long id);

    User findById(Long id);

    User findByName(String name);

    Set<User> getAllUsers();

    void updateUser(User user, String roleName);

}
