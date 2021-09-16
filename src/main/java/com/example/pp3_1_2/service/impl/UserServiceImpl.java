package com.example.pp3_1_2.service.impl;


import com.example.pp3_1_2.model.Role;
import com.example.pp3_1_2.model.User;
import com.example.pp3_1_2.repository.UserRepository;
import com.example.pp3_1_2.repository.UserRepositoryCustom;
import com.example.pp3_1_2.service.RoleService;
import com.example.pp3_1_2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepositoryCustom userRepositoryCustom;
    private final UserRepository userRepository;
    private final RoleService roleService;


    @Autowired
    public UserServiceImpl(@Qualifier("userRepository") UserRepositoryCustom userRepositoryCustom, UserRepository userRepository, RoleService roleService) {
        super();
        this.userRepositoryCustom = userRepositoryCustom;
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    @Override
    public User addUser(User user, String role1) {
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(10)));
        Role role = new Role();
        String DEFAULT_ROLE = "ROLE_USER";
        role.setRoleName(DEFAULT_ROLE);
        if (roleService.findByName(DEFAULT_ROLE).getRoleName() == null) {
            user.getRoleSet().add(roleService.addRole(role));
            return userRepository.save(user);
        }
        role = roleService.findByName(DEFAULT_ROLE);
        user.getRoleSet().add(role);
        if (role1 != null) {
            user.getRoleSet().add(roleService.findByName(role1));
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userRepositoryCustom.detachUser(findById(id));
        userRepository.deleteById(id);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public User findByName(String name) {
        return getAllUsers().stream().filter(s -> s.getUsername().equals(name)).findFirst().get();
    }

    @Override
    public Set<User> getAllUsers() {
        return new HashSet<>(userRepository.findAll());
    }

    @Override
    public void updateUser(User user, Long id) {
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(10)));
       // roleName = roleName.replaceAll("[^\\w[$^_]]", "");
//        Role role = roleService.findByName(roleName);
//        User user1 = findById(user.getId());
        Role role = roleService.findByName("ROLE_USER");
        User user1 = findById(id);
        user1.setUsername(user.getUsername());
        user1.setEmail(user.getEmail());
        user1.setPassword(user.getPassword());
//        if (role.getRoleName() == null) {
//            role = new Role();
//            role.setRoleName(roleName);
//            roleService.addRole(role);
//            user1.getRoleSet().add(roleService.findByName(roleName));
//        } else {
            user1.getRoleSet().add(role);
//        }
        userRepository.save(user1);
    }

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        User user = userRepository.findAll().stream().filter(s -> s.getUsername().equals(name)).findFirst().get();
        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(),
                user.getRoleSet()
                        .stream()
                        .map(q -> new SimpleGrantedAuthority(q.getRoleName()))
                        .collect(Collectors.toList()));
    }

}
